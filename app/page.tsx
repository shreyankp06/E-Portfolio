"use client"

import { useState } from "react"
import { StarBackground } from "@/components/portfolio/star-background"
import { RocketIntro } from "@/components/portfolio/rocket-intro"
import { SpaceNavigation } from "@/components/portfolio/space-navigation"
import { CursorRocket } from "@/components/portfolio/cursor-rocket"
import { NavigationStars } from "@/components/portfolio/navigation-stars"
import { AudioProvider } from "@/components/portfolio/audio-context"
import { SoundToggle } from "@/components/portfolio/sound-toggle"
import { HeroSection } from "@/components/portfolio/hero-section"
import { AboutSection } from "@/components/portfolio/about-section"
import { ProjectsSection } from "@/components/portfolio/projects-section"
import { SkillsSection } from "@/components/portfolio/skills-section"
import { ContactSection } from "@/components/portfolio/contact-section"
import { Footer } from "@/components/portfolio/footer"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <AudioProvider>
      {showIntro && <RocketIntro onComplete={() => setShowIntro(false)} />}
      
      <StarBackground />
      <CursorRocket />
      <NavigationStars />
      <SoundToggle />
      
      <main className="relative z-10 min-h-screen">
        <SpaceNavigation />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </main>
    </AudioProvider>
  )
}
