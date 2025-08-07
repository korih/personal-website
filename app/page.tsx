import type React from "react";
import {
  GlobeIcon,
  CodeIcon,
  BriefcaseIcon,
  PaperclipIcon,
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
import { LandingHeader } from "@/components/landing-header";
import Link from "next/link";

const SkillTagComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-2 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-400">
      {children}
    </div>
  );
};

export default function Home() {
  const projects = getAllProjects();
  const experienceInfo = getExperienceInfo();
  const technicalSkills = getTechnicalSkillsInfo();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-20 z-0"></div>

      {/* Add a Header */}
      <LandingHeader />

      <div className="relative z-10 container my-5 mx-auto p-3 sm:p-4 pt-20 sm:pt-24 pb-6 sm:pb-8">
        {/* Main Content Grid */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Experience Section - Expanded */}
          <AnimatedSection animation="fade-up" id="experience">
            <Card className="bg-zinc-900/70 border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 flex flex-col justify-center">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <h1 className="text-2xl font-medium">
                    Hello 👋, welcome to my website!
                  </h1>
                </div>
                <div className="flex items-center justify-center mb-4 sm:mb-6 gap-8">
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <Link href="/portfolio">
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold text-xl relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        Portfolio
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                      </div>
                    </Link>
                  </div>
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <Link href="/blogs">
                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold text-xl relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        Blogs
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                      </div>
                    </Link>
                  </div>
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
