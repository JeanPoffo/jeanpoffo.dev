import { remark } from 'remark'
import html from 'remark-html'

export async function markdownToHtml(markdown: string) {
  const data = await remark().use(html).process(markdown)
  return data.toString()
}