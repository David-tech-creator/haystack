import fs from "node:fs/promises"
import path from "node:path"

import matter from "gray-matter"
import GithubSlugger from "github-slugger"
import { compileMDX } from "next-mdx-remote/rsc"
import { remark } from "remark"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import { visit } from "unist-util-visit"
import { toString } from "mdast-util-to-string"
import type { Root } from "mdast"

const jobsDir = path.join(process.cwd(), "content/jobs")
const casesDir = path.join(process.cwd(), "content/cases")

const slugger = new GithubSlugger()
const processor = remark().use(remarkParse).use(remarkGfm)

function buildToc(markdown: string) {
  const tree = processor.parse(markdown) as Root
  const toc: TocItem[] = []
  slugger.reset()
  visit(tree, "heading", (node) => {
    const depth = node.depth ?? 0
    if (!depth || depth > 3) return
    const title = toString(node)
    if (!title) return
    const slug = slugger.slug(title)
    toc.push({ slug, title, depth })
  })
  return toc
}

const mdxOptions = {
  parseFrontmatter: false,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
}

export type TocItem = { slug: string; title: string; depth: number }

export type JobMeta = {
  title: string
  slug: string
  location: string
  tags: string[]
  level: string
  salaryRange?: string
  postedAt: string
}

export type JobContent = {
  meta: JobMeta
  content: React.ReactNode
  toc: TocItem[]
}

async function compileWithToc(source: string) {
  const toc = buildToc(source)
  const mdx = await compileMDX({ source, options: mdxOptions })
  return { content: mdx.content, toc }
}

export async function getJobs(): Promise<JobContent[]> {
  const files = await fs.readdir(jobsDir)
  const jobs = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const source = await fs.readFile(path.join(jobsDir, file), "utf8")
        const { content, data } = matter(source)
        const mdx = await compileWithToc(content)
        return {
          meta: data as JobMeta,
          content: mdx.content,
          toc: mdx.toc,
        }
      }),
  )

  return jobs.sort((a, b) => (a.meta.postedAt < b.meta.postedAt ? 1 : -1))
}

export async function getJobBySlug(slug: string): Promise<JobContent> {
  const source = await fs.readFile(path.join(jobsDir, `${slug}.mdx`), "utf8")
  const { content, data } = matter(source)
  const mdx = await compileWithToc(content)
  return {
    meta: data as JobMeta,
    content: mdx.content,
    toc: mdx.toc,
  }
}

export type CaseStudyMeta = {
  title: string
  slug: string
  summary: string
  impact: string[]
}

export type CaseStudyContent = {
  meta: CaseStudyMeta
  content: React.ReactNode
  toc: TocItem[]
}

export async function getCaseStudies(): Promise<CaseStudyContent[]> {
  const files = await fs.readdir(casesDir)
  return Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const source = await fs.readFile(path.join(casesDir, file), "utf8")
        const { content, data } = matter(source)
        const mdx = await compileWithToc(content)
        return {
          meta: data as CaseStudyMeta,
          content: mdx.content,
          toc: mdx.toc,
        }
      }),
  )
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyContent> {
  const source = await fs.readFile(path.join(casesDir, `${slug}.mdx`), "utf8")
  const { content, data } = matter(source)
  const mdx = await compileWithToc(content)
  return {
    meta: data as CaseStudyMeta,
    content: mdx.content,
    toc: mdx.toc,
  }
}
