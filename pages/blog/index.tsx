import Link from 'next/link'
import Head from '../../components/Head'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from '../../styles/Home.module.css'
import PostType from '../../interface/PostType'
import { getAllPosts } from '../../lib/posts'

type Props = {
  posts: PostType[]
}

export default function Blog({ posts }: Props) {
  return (
    <div className={styles.container}>
      <Head />
      <Header />
      <main className={styles.main}>
        <h2 className={styles.title}>
          Últimas Postagens
        </h2>
        <ul className={styles.description}>
          {posts && posts.map(post => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  
  return {
    props: {
      posts,
    },
  }
}
