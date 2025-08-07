import type React from "react";
import {
  GlobeIcon,
  CodeIcon,
  BriefcaseIcon,
  PaperclipIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "@/components/project-card";
import { getAllProjects } from "@/lib/data";
import { ExperienceCard } from "@/components/experience-card";
import { EnhancedScrollIndicator } from "@/components/enhanced-scroll-indicator";
import { AnimatedSection } from "@/components/animated-section";
import { EnhancedProfile } from "@/components/enhanced-profile";
import { CredentialsSection } from "@/components/credentials-section";
import { PortfolioHeader } from "@/components/portfolio-header";
import { getExperienceInfo, getTechnicalSkillsInfo } from "@/lib/data";
import { BlogCard } from "@/components/blog-card";
import { BlogHeader } from "@/components/blog-header";
import { getAllDynamicPosts, getDynamicPostById } from "@/lib/blogs";
import Link from "next/link";

const SkillTagComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-2 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-400">
      {children}
    </div>
  );
};

export default function Home() {
  const blogInfo = getAllDynamicPosts();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-20 z-0"></div>

      {/* Add a Header */}
      <BlogHeader />

      <div className="relative z-10 container my-5 mx-auto p-3 sm:p-4 pt-20 sm:pt-24 pb-6 sm:pb-8">
        {/* Main Content Grid */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Experience Section - Expanded */}
          <AnimatedSection animation="fade-up" id="experience">
            <Card className="bg-zinc-900/70 border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center mb-4 sm:mb-6">
                  <PaperclipIcon className="w-5 h-5 mr-2 text-cyan-400" />
                  <h3 className="text-lg font-medium">Posts</h3>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  {blogInfo.map((blog, index) => (
                    <Link href={`/blogs/${blog.id}`} key={index}>
                      <AnimatedSection
                        key={index}
                        animation="fade-up"
                        delay={100 * (index + 1)}
                      >
                        <BlogCard
                          title={blog.title}
                          date={blog.date}
                          description={blog.description}
                          tags={blog.tags}
                        />
                      </AnimatedSection>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
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
