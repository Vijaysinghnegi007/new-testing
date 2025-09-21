import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post) return { title: 'Post not found' }
  return {
    title: post.seoTitle || `${post.title} - TravelWeb`,
    description: post.seoDescription || post.excerpt || post.title,
  }
}

export default async function BlogDetailPage({ params }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post || !post.published) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Link href="/blog" prefetch={false} className="text-primary underline">Back to blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <p className="text-muted-foreground mb-8 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
{post.featuredImage && (
            <Image src={post.featuredImage} alt={post.title} width={1200} height={630} className="w-full h-auto rounded mb-8" />
          )}
          {post.content && (
            <div className="prose prose-slate dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </div>
      </section>
    </div>
  )
}

