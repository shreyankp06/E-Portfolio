"use client"

import { ExternalLink, GitBranch, Satellite, Cpu, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef, useState } from "react"
import { useAudio } from "./audio-context"

const projects = [
  {
    title: "PM 2.5 Prediction Model",
    description:
      "AI-powered system to predict PM2.5 air pollution using a fusion of MODIS AOD (satellite), MERRA-2 (reanalysis), and OpenAQ (ground-based) data. Prototype demonstrated for New Delhi with the goal to scale to grid-level predictions for all of India.",
    techStack: ["Python", "Machine Learning", "MODIS AOD", "MERRA-2", "OpenAQ", "Scikit-learn"],
    github: "https://github.com",
    icon: Satellite,
    status: "Active",
  },
  {
    title: "GeoAI Urban Growth & Infrastructure Stress Mapping",
    description:
      "A scalable spatial decision-intelligence framework to analyze urban expansion and infrastructure stress. Performed land cover classification using Sentinel-2 imagery and Random Forest in Google Earth Engine.",
    techStack: ["GIS", "Remote Sensing", "Google Earth Engine", "Sentinel-2", "Random Forest"],
    icon: Cpu,
    status: "Complete",
  },
  {
    title: "UIDAI Data Hackathon - Aadhaar Analytics",
    description:
      "Designed an interpretable governance metric (Lifecycle Deviation Score - LDS) to assess district-level alignment between Aadhaar enrolment and biometric updates with policy-ready visualizations.",
    techStack: ["Python", "Data Analytics", "EDA", "Visualization"],
    icon: BarChart3,
    status: "Complete",
  },
]

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { playClick, playHover } = useAudio()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="projects" className="relative py-32 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Satellite className="w-4 h-4" />
            Space Stations
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-display)]">
            Featured <span className="text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Exploring the intersection of AI, geospatial technology, and environmental science
          </p>
        </div>

        {/* Projects as Space Station Modules */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`group relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
              style={{
                transitionDelay: `${200 + index * 150}ms`,
              }}
            >
              {/* Connection line */}
              {index < projects.length - 1 && (
                <div className="absolute left-12 top-full w-0.5 h-8 bg-gradient-to-b from-primary/50 to-transparent hidden lg:block" />
              )}

              <button 
                onMouseEnter={playHover}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    playHover()
                  }
                }}
                className="relative rounded-3xl bg-card/30 backdrop-blur-md border border-border/30 overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] focus:outline-none focus:ring-2 focus:ring-primary/50">
                {/* Top control bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-card/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <project.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Module {String(index + 1).padStart(2, "0")}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${project.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors font-[family-name:var(--font-display)]">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-card/80 text-secondary-foreground border border-border/50 hover:border-primary/30 transition-colors px-3 py-1"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex lg:flex-col gap-3 lg:justify-center">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={playClick}>
                          <Button
                            variant="outline"
                            className="rounded-xl border-border/50 bg-card/50 hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
                          >
                            <GitBranch className="w-4 h-4 mr-2" />
                            Code
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-border/30 bg-card/30 backdrop-blur-sm hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-500"
          >
            <a href="https://github.com/shreyankp06" target="_blank" rel="noopener noreferrer" onClick={playClick}>
              <GitBranch className="w-5 h-5 mr-2" />
              View All on GitHub
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
