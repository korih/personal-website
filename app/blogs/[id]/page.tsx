import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Markdown from "markdown-to-jsx";
import { BlogPost as BlogPostInterface, getDynamicPostById } from "@/lib/blogs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/animated-section";
import { PortfolioHeader } from "@/components/portfolio-header";
import { EnhancedScrollIndicator } from "@/components/enhanced-scroll-indicator";
import { BlogHeader } from "@/components/blog-header";

interface Props {
  params: { id: string };
}

export default function BlogPostPage({ params }: Props) {
  const post: BlogPostInterface = getDynamicPostById(params.id);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-20 z-0"></div>

      {/* Header */}
      <BlogHeader />

      <div className="relative z-10 container mx-auto p-3 sm:p-4 pt-20 sm:pt-24 pb-6 sm:pb-8">
        {/* Back Button */}
        <AnimatedSection animation="fade-in">
          <Link
            href="/blogs"
            className="inline-flex items-center text-xs sm:text-sm text-zinc-400 hover:text-white mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Back to Blogs
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Blog Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <AnimatedSection animation="fade-up" delay={100}>
              <Card className="bg-zinc-900/70 border-zinc-800 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2">{post.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag: any) => (
                      <span
                        key={tag}
                        className="inline-block bg-cyan-900/60 text-cyan-300 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Markdown
                    options={{
                      forceBlock: true,
                      overrides: {
                        h1: { props: { className: "text-2xl font-bold mt-6 mb-2" } },
                        h2: { props: { className: "text-xl font-bold mt-5 mb-2" } },
                        h3: { props: { className: "text-lg font-semibold mt-4 mb-2" } },
                        p: { props: { className: "mb-4" } },
                        ul: { props: { className: "list-disc pl-6 mb-4" } },
                        ol: { props: { className: "list-decimal pl-6 mb-4" } },
                        code: { props: { className: "bg-zinc-800 px-1 rounded" } },
                        pre: { props: { className: "bg-zinc-900 p-3 rounded mb-4 overflow-x-auto" } },
                        a: { props: { className: "text-cyan-400 underline" } },
                      },
                    }}
                  >
                    {post.content || ""}
                  </Markdown>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

          {/* Blog Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <AnimatedSection animation="slide-left" delay={100}>
              <Card className="bg-zinc-900/70 border-zinc-800 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Blog Details</h2>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-zinc-400">Published</h3>
                      <p className="text-sm sm:text-base">{post.date ? new Date(post.date).toDateString() : ""}</p>
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-zinc-400">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag: any) => (
                          <span
                            key={tag}
                            className="inline-block bg-cyan-900/60 text-cyan-300 px-2 py-1 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>

        {/* Footer */}
        <AnimatedSection
          animation="fade-in"
          delay={500}
          className="mt-8 sm:mt-12 py-4 sm:py-6 text-center text-xs sm:text-sm text-zinc-500"
        >
          <p></p>
        </AnimatedSection>
      </div>

      {/* Scroll to Top Button */}
      <EnhancedScrollIndicator />
    </main>
  );
}
