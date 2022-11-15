import Head from '../components/Head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head />
      <Header />
      <main className={styles.main}>
        <h2 className={styles.title}>
          Tecnologia, engenharia e um pouco de fotografia
        </h2>
        <p className={styles.description}>
          Sejam bem-vindos ao meu blog! Aqui eu falo várias coisas sobre tecnologia 
        </p>
      </main>
      <Footer />
    </div>
  )
}
