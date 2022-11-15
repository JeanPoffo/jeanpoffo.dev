import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import PostType from '../interface/PostType'

const postsDirectory = join(process.cwd(), '_posts')

export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory)
  
  const posts = files
    .map((file) => getPostBySlug(file))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  
  return posts;
}

export function getPostBySlug(file: string) {
  const slug = file.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const post: PostType = {
    slug,
    title: data['title'],
    date: data['date'],
    author: data['author'],
    content,
  }

  return post
}