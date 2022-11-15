---
title: 'Criando uma Instância Linux de Alta Performance para o MongoDB'
date: '2021-06-04T17:00:00.000Z'
author: Jean Poffo
---

A seguir, teremos uma série de dicas divididas em tópicos para configurar uma instância Linux de alta performance para executar o MongoDB.

## Incremento do Limite de Processos do OS

O MongoDB precisa criar vários descritores de arquivos quando vários clientes se conectam, sendo necessário ter vários processos  simultâneos para operar com eficácia. Os padrões normais do OS acabam por limitar essa quantidade de processos.

Vamos alterar os limites de processos no OS.

Edite o arquivo `limits.conf`:

```
sudo nano /etc/security/limits.conf
```

Adicione as seguintes linhas ao final do arquivo:

```
* soft nofile 64000
* hard nofile 64000
* soft nproc 64000
* hard nproc 64000
```

Crie um arquivo chamado `90-nproc.conf` em `/etc/security/limits.d/`:

```
sudo nano /etc/security/limits.d/90-nproc.conf
```

Adicione as seguintes linhas no arquivo:

```
* soft nproc 64000
* hard nproc 64000
```

## Desativação das *Transparent Huge Pages* (THP)

*Transparent Huge Pages* (THP) é um sistema de gerenciamento de memória do Linux, que tem como tarefa reduzir a sobrecarga de pesquisas de *Translation Lookaside Buffer* (TLB) em máquinas com grande quantidades de memórias, se utilizando de paginação de memória maiores.

Bancos de dados, como o MongoDB, possuem um desempenho ruim quando utilizado o THP, por ter padrões de acesso à memória que são esparsos e não contíguos.

Vamos criar um script para desabilitar o THP. 

Crie o arquivo `disable-transparent-hugepages`, na pasta `/etc/init.d/`:

```
sudo nano /etc/init.d/disable-transparent-hugepages
```

Adicione o seguinte conteúdo ao arquivo:

```
#!/bin/sh
### BEGIN INIT INFO
# Provides:          disable-transparent-hugepages
# Required-Start:    $local_fs
# Required-Stop:
# X-Start-Before:    mongod mongodb-mms-automation-agent
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Disable Linux transparent huge pages
# Description:       Disable Linux transparent huge pages, to improve
#                    database performance.
### END INIT INFO

case $1 in
  start)
    if [ -d /sys/kernel/mm/transparent_hugepage ]; then
      thp_path=/sys/kernel/mm/transparent_hugepage
    elif [ -d /sys/kernel/mm/redhat_transparent_hugepage ]; then
      thp_path=/sys/kernel/mm/redhat_transparent_hugepage
    else
      return 0
    fi

    echo 'never' > ${thp_path}/enabled
    echo 'never' > ${thp_path}/defrag

    unset thp_path
    ;;
esac
```

Execute o comando abaixo para tornar o arquivo executável:

```
sudo chmod 755 /etc/init.d/disable-transparent-hugepages
```

Configure o mesmo para executar sempre que iniciar o sistema:

```
sudo update-rc.d disable-transparent-hugepages defaults
```

## Desativação dos *Core Dumps*

Quando algum processo recebe certos sinais para o término do mesmo, é gerado um *Core Dump*, um arquivo com a imagem da memória do processo, no momento do término dele. 

O MongoDB pode gerar um *core dump* se ocorrer alguma falha, o que é péssimo para ambientes de produção pois esse processo pode demorar minutos ou horas dependendo da carga de trabalho no momento da falha.

Vamos desabilitar os *Core Dumps*. 

Edite o arquivo `apport`:

```
sudo nano /etc/default/apport
```

Encontre a seguinte linha:

```
enabled=1
```

E substitua por:

```
enabled=0
```

## Alocação de *Swap Memory*

O MongoDB possui um uso intenso de cache, onde a *Swap Memory* (Memória Virtual) pode ser muito útil para evitar sobrecarga do sistema.

Para alocar o tamanho mais eficiente de *Swap Memory*, veja as recomendações abaixo, em relação a quantidade de memória RAM:

- **Menos de 2GB**: tamanho equivalente ao dobro da quantidade de RAM.
- **2GB - 8GB**: tamanho equivalente à quantidade de RAM.
- **8GB - 64GB**: tamanho equivalente à metade da quantidade de RAM, se for realmente necessário.

O exemplo a seguir mostra como adicionar 1GB de *Swap* no sistema.

Primeiramente deve ser criado o arquivo de *Swap*, onde `1GB` é o tamanho do *Swap*:

```
sudo fallocate -l 1G /swapfile
```

Altere as permissões do arquivo:

```
sudo chmod 600 /swapfile
```

Use o utilitário de *Swap* para alocar o arquivo como uma área de *Swap Memory*:

```
sudo mkswap /swapfile
```

Ative o *Swap* no sistema:

```
sudo swapon /swapfile
```

Na sequência, faça a alteração para o uso de *Swap* ficar permanente, editando o seguinte arquivo:

```
sudo nano /etc/fstab
```

Adicione a seguinte linha no final do arquivo:

```
/swapfile swap swap defaults 0 0
```

Por último, altere o Swappiness, editando o arquivo `sysctl.conf`

```
sudo nano /etc/sysctl.conf
```

Coloque a seguinte linha no final do arquivo:

```
vm.swappiness = 1
```

E execute o seguinte comando para aplicar as alterações:

```
sudo sysctl -p
```

Para verificar se o *Swap* está funcionando e o Swappiness está correto, use os seguintes comandos:

```
sudo swapon --show
sudo cat /proc/sys/vm/swappiness
```

## Configurando uma partição XFS

O MongoDB utiliza a *Wired Tiger Storage Engine*, uma plataforma de NoSQL para gerenciamento de dados. Uma forte recomendação é utilizar o sistema de arquivos XFS, fazendo com que o *Wired Tiger* tenha o melhor desempenho possível.

Outra boa prática para configuração do servidor de banco de dados é a separação da gravação dos dados para um disco à parte, pois caso aconteça algum problema no servidor, o disco pode ser desacoplado e os dados podem ser acessados sem maiores problemas.

No próximo exemplo, vamos listar os discos, selecionar um destes, formatar o mesmo para XFS e configurar o MongoDB para utilizar ele.

Liste os discos no seus sistema:

```
sudo fdisk -l
```

Selecione o disco que deseja formatar (no caso, foi selecionado o `xvdf`):

```
sudo fdisk /dev/xvdf
```

Após o comando acima, pressione `n` e na sequência, pressione enter para selecionar a opção padrão de todas as perguntas. No final, digite `q` para sair.

Formate o disco como XFS:

```
sudo mkfs.xfs -L mongodb /dev/xvdf
```

Na sequência, crie uma pasta para o ponto de montagem:

```
sudo mkdir /mnt/mongodb
```

Altere o proprietário do diretório para o MongoDB

```
sudo chown mongodb:mongodb /mnt/mongodb/
```

Monte o sistema de arquivos:

```
sudo mount -t xfs /dev/xvdf /mnt/mongodb
```

Agora, para montar o sistema de arquivos quando iniciar o sistema, primeiramente anote o UUID do disco, listado com o seguinte comando:

```
sudo blkid /dev/xvdf
```

Edite o arquivo `fstab`:

```
sudo nano /etc/fstab
```

E adicione o seguinte conteúdo:

```
UUID=UUID-ANOTADO /mnt/mongodb xfs defaults 1 1
```

Por ultimo, deve ser alterado a configuração do MongoDB, no arquivo `mongod.conf`:

```
sudo nano /etc/mongod.conf
```

E altere a configuração do `dbPath`, para refletir o novo local:

```
storage:
  dbPath: /mnt/mongodb
```

## Configurando o Sistema de Arquivos

Por padrão o Linux atualiza o horário de atualização do arquivo, sempre que ele é alterado. Como o MongoDB escreve no sistema arquivos frequentemente, ele cria um *overhead* desnecessário.

Vamos desabilitar essa funcionalidade.

Altere o arquivo `fstab`:

```
sudo nano /etc/fstab
```

Localize no arquivo o seu sistema de arquivos, e logo após a palavra `default`, adicione `noatime`, conforme abaixo:

<pre>
UUID=UUID-ANOTADO /mnt/mongodb xfs defaults,<strong>noatime</strong> 1 1
</pre>

Caso você não utilize um disco com sistema de arquivo à parte, execute o mesmo procedimento, mas no sistema de arquivos padrão:

<pre>
LABEL=cloudimg-rootfs / ext4 defaults,<strong>noatime</strong>,discard 0 0
</pre>


## Número de Blocos do *Readahead*

Readhead é uma feature do kernel Linux, onde ele carrega o conteúdo dos arquivo em cache. Isso pré-busca o arquivo para que, quando ele for acessado posteriormente, seu conteúdo seja lido da memória RAM em vez do HD/SSD, resultando em latências de acesso ao arquivo muito menores.

Geralmente, o número de blocos de dados do *Readahead* não é otimizado para o MongoDB, e deve ser ajustado para 32.

Vamos ajustar esse tamanho.

Abra o Crontab do sistema (caso for a primeira vez, surgirá um *prompt* perguntando qual editor utilizar):

```
sudo crontab -e
```

Adicione o seguinte conteúdo ao final do arquivo:

```
@reboot /sbin/blockdev --setra 32 /dev/root
```

## Considerações Finais

Após todos os passos descritos, é necessário reiniciar a instância para que todas as alterações tenham efeito. Lembrando também que as especificações de hardware da máquina interferem muito no desempenho do MongoDB, como: IOPS do disco, quantidade de memória RAM, quantidade de *cores* do processador, latência da rede (principalmente para aplicações de *Sharded Cluster* e *Replica Set*), entre outros.