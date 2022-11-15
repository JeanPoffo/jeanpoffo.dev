import { useRouter } from 'next/router'
import { getAllPosts, getPostBySlug } from '../../lib/posts'
import { markdownToHtml } from '../../lib/markdown'

import ErrorPage from 'next/error'
import Head from '../../components/Head'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import styles from '../../styles/Home.module.css'
import PostType from '../../interface/PostType'

type Props = {
  post: PostType
}

export default function Post({ post }: Props) {
  const router = useRouter()
  
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  
  return (
    <div className={styles.container}>
      <Head />
      <Header />
      {router.isFallback ? (
        <span>Loading…</span>
      ) : (
        <article className={styles.main}>
          <h4>{post.title}</h4>
          <h4>{post.author}</h4>
          <h4>{post.date}</h4>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      )}
      <Footer />
    </div>
  )
}

type Params = {
  params: {
    slug: string,
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug)
  
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
