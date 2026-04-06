"use client"

import { useState, useEffect } from "react"
import { Rocket, Satellite, Globe2, User, Mail, FileText, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudio } from "./audio-context"

const navItems = [
  { href: "#home", icon: Rocket, label: "Home", orbitDelay: "0s" },
  { href: "#about", icon: User, label: "About", orbitDelay: "0.5s" },
  { href: "#projects", icon: Satellite, label: "Projects", orbitDelay: "1s" },
  { href: "#skills", icon: Globe2, label: "Skills", orbitDelay: "1.5s" },
  { href: "#contact", icon: Mail, label: "Contact", orbitDelay: "2s" },
]

export function SpaceNavigation() {
  const [activeSection, setActiveSection] = useState("home")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { playClick, playHover } = useAudio()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)

      const sections = navItems.map((item) => item.href.replace("#", ""))
      for (const section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight / 2) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    playClick()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Floating Navigation */}
      <nav
        className={cn(
          "fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 transition-all duration-700",
          isScrolled ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
        )}
      >
        {navItems.map((item, index) => (
          <button
            key={item.href}
            onClick={() => scrollToSection(item.href)}
            onMouseEnter={playHover}
            className={cn(
              "group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500",
              "bg-card/30 backdrop-blur-md border border-border/30 hover:border-primary/50",
              "hover:bg-primary/20 hover:scale-110 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
              activeSection === item.href.replace("#", "") &&
                "bg-primary/30 border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            )}
            style={{
              animation: isScrolled ? `floatIn 0.5s ease-out ${index * 0.1}s both` : undefined,
            }}
            aria-label={item.label}
          >
            <item.icon
              className={cn(
                "w-5 h-5 transition-all duration-300",
                activeSection === item.href.replace("#", "") ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )}
            />
            {/* Tooltip */}
            <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0">
              {item.label}
            </span>
            {/* Orbit ring animation */}
            <div
              className={cn(
                "absolute inset-0 rounded-full border border-primary/30 scale-150 opacity-0 transition-all duration-500",
                activeSection === item.href.replace("#", "") && "animate-[ping_2s_ease-out_infinite] opacity-100"
              )}
            />
          </button>
        ))}

        {/* Resume button */}
        <a
          href="/resume.pdf"
          download
          className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 bg-primary/20 backdrop-blur-md border border-primary/30 hover:border-primary/50 hover:bg-primary/30 hover:scale-110 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          style={{
            animation: isScrolled ? `floatIn 0.5s ease-out 0.5s both` : undefined,
          }}
          aria-label="Download Resume"
        >
          <FileText className="w-5 h-5 text-primary" />
          <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0">
            Resume
          </span>
        </a>
      </nav>

      {/* Mobile Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-500",
          isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/30" : "bg-transparent"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <a href="#home" className="text-2xl font-bold font-[family-name:var(--font-display)]">
            <span className="text-foreground">S</span>
            <span className="text-primary">P</span>
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-border/30 flex items-center justify-center"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/30 transition-all duration-500 overflow-hidden",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="p-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  "flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-300",
                  activeSection === item.href.replace("#", "")
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-4 w-full p-3 rounded-xl bg-primary/20 text-primary transition-all duration-300 hover:bg-primary/30"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Download Resume</span>
            </a>
          </div>
        </div>
      </header>

      <style jsx global>{`
        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
