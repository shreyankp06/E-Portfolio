"use client"

import { Satellite, Brain, Globe2, Database } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const highlights = [
  {
    icon: Brain,
    title: "AI/ML",
    description: "Building intelligent systems with machine learning and deep learning",
  },
  {
    icon: Satellite,
    title: "GeoAI",
    description: "Satellite data processing and spatial analytics for environmental modeling",
  },
  {
    icon: Globe2,
    title: "Space Tech",
    description: "Remote sensing and Earth observation for data-driven insights",
  },
  {
    icon: Database,
    title: "Full Stack",
    description: "End-to-end application development with modern frameworks",
  },
]

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const delayClasses = ["delay-300", "delay-400", "delay-500", "delay-600", "delay-700"]

  return (
    <section ref={sectionRef} id="about" className="relative py-32 px-6 overflow-hidden">
      {/* Floating panel background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Astronaut Profile</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-display)]">
            About <span className="text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Me</span>
          </h2>
        </div>

        {/* Spaceship Panel Design */}
        <div
          className={`relative rounded-3xl bg-card/30 backdrop-blur-md border border-border/30 overflow-hidden transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Top control bar */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border/30 bg-card/50">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-4 text-xs text-muted-foreground uppercase tracking-wider">Mission Control Panel</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 p-8 lg:p-12">
            {/* Text Content */}
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I&apos;m a <span className="text-foreground font-medium">Computer Engineering student</span> at
                Vidyalankar Institute of Technology, Mumbai, with a strong passion for leveraging technology
                to solve real-world environmental and urban challenges.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                My work focuses on <span className="text-primary font-medium">Geospatial AI</span>,{" "}
                <span className="text-primary font-medium">environmental modeling</span>, and{" "}
                <span className="text-primary font-medium">spatial decision systems</span>. I enjoy integrating
                satellite data, machine learning, and large-scale geospatial analytics to build data-driven
                environmental and urban intelligence frameworks.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Currently maintaining a <span className="text-foreground font-medium">CGPA of 9.89</span> while actively working on projects involving PM2.5 prediction, urban growth analysis, and governance analytics. Certified <span className="text-foreground font-medium">Elite + Gold (Top 2%)</span> in NPTEL Programming in Java.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/30">
                  <div className="text-3xl font-bold text-primary">9.89</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">CGPA</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/30">
                  <div className="text-3xl font-bold text-primary">Top 2%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">NPTEL Java</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-card/50 border border-border/30">
                  <div className="text-3xl font-bold text-primary">3+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Projects</div>
                </div>
              </div>
            </div>

            {/* Highlight Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div
                  key={item.title}
                  className={cn(
                    "group p-6 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm hover:bg-card/70 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                    delayClasses[index] ?? "delay-300"
                  )}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
