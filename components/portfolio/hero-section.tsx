"use client"

import Image from "next/image"
import { Mail, Linkedin, Github, Phone, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

const socialLinks = [
  { icon: Mail, href: "mailto:shreyankp06@gmail.com", label: "Email" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/shreyankparab", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/shreyankp06", label: "GitHub" },
  { icon: Phone, href: "tel:+918424089685", label: "Phone" },
]

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Animated nebula effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Astronaut Badge / Profile Image */}
        <div
          className={`mb-8 flex justify-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative group">
            {/* Hologram ring effect */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/50 via-cyan-400/50 to-primary/50 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_10s_linear_infinite]" />
            <div className="absolute -inset-2 rounded-full border border-primary/30 animate-[ping_3s_ease-out_infinite]" />
            <div className="absolute -inset-4 rounded-full border border-primary/20 animate-[ping_3s_ease-out_infinite_0.5s]" />
            
            {/* Main image container */}
            <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-primary/50 bg-card shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              <Image
                src="/images/profile.png"
                alt="Shreyank Parab"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            
            {/* Badge label */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary/90 rounded-full text-xs font-bold text-primary-foreground uppercase tracking-wider whitespace-nowrap">
              Mission Commander
            </div>
          </div>
        </div>

        {/* Name with glitch effect on hover */}
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 font-[family-name:var(--font-display)] transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="inline-block text-foreground hover:animate-[glitch_0.3s_ease_infinite] transition-all">Shreyank</span>{" "}
          <span className="inline-block text-primary hover:animate-[glitch_0.3s_ease_infinite] transition-all drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">Parab</span>
        </h1>

        <p
          className={`text-lg md:text-xl text-muted-foreground mb-2 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          Computer Engineering Student
        </p>

        {/* Animated tagline */}
        <div
          className={`text-xl md:text-2xl font-medium mb-10 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-card/30 backdrop-blur-sm border border-border/30">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-foreground/90">AI/ML</span>
            <span className="text-primary">•</span>
            <span className="text-foreground/90">GeoAI</span>
            <span className="text-primary">•</span>
            <span className="text-foreground/90">Space Tech</span>
          </span>
        </div>

        {/* Social Links with stagger animation */}
        <div
          className={`flex justify-center gap-4 mb-12 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {socialLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={link.label}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full border-border/30 bg-card/30 backdrop-blur-sm hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-500 hover:scale-110"
              >
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Button>
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-500 hover:scale-105"
          >
            <a href="#projects">Explore Projects</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-border/30 bg-card/30 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-500 hover:scale-105"
          >
            <a href="/resume.pdf" download>
              Download Mission File
            </a>
          </Button>
        </div>

        {/* Scroll indicator with bounce */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <a
            href="#about"
            aria-label="Scroll to about section"
            className="group flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
              Explore
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2 group-hover:border-primary/50 transition-colors">
              <div className="w-1 h-2 rounded-full bg-primary animate-[scrollBounce_1.5s_ease-in-out_infinite]" />
            </div>
          </a>
        </div>
      </div>

      <style jsx global>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}
