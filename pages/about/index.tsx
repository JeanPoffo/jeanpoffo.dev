import Head from '../../components/Head'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from '../../styles/Home.module.css'

export default function About() {
  return (
    <div className={styles.container}>
      <Head />
      <Header />
      <main className={styles.main}>
        <h2 className={styles.title}>
          Sobre mim
        </h2>
        <p className={styles.description}>
          Olá! Meu nome é Jean Poffo
          Sou graduado como Engenheiro de Software pela Universidade do Estado de Santa Catarina - UDESC. 
          Previamente graduado como Técnico de Informática pelo Instituto Federal Catarinense - IFC.

          Na área de desenvolvimento de software, trabalhei 4 anos e meio desenvolvendo soluções para contabilidade pública. 
          Após este período, trabalhei cerca de 1 ano como freelancer. 
          Logo após, atuei em uma startup de tecnologia anti-fraude para compras online. 
          Também trabalhei no setor de pesquisa e IA em uma empresa que desenvolve e-commerces. 
          Atualmente trabalho como desenvolvedor back-end em uma empresa de pagamentos.
        </p>
      </main>
      <Footer />
    </div>
  )
}
