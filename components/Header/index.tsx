import Link from 'next/link'
import { GrLinkedin } from 'react-icons/gr';
import styles from '../../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <b>Jean Poffo</b>
      </div>
      <nav className={styles.links}>
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/about">Sobre</Link>
      </nav>
      <div className={styles.social}>
        <a href="https://www.linkedin.com/in/jean-poffo-768b4827/" target="_blank" rel="noopener noreferrer">
          <GrLinkedin />
        </a>
      </div>
    </header>
  );
}
