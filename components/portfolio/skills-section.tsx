"use client"

import { Brain, Code2, Satellite, BarChart3, Database, Layers, Globe2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const skillCategories = [
  {
    title: "AI/ML",
    icon: Brain,
    skills: ["Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Machine Learning", "Data Modeling"],
  },
  {
    title: "MERN Stack",
    icon: Code2,
    skills: ["React", "JavaScript", "HTML/CSS", "Spring (Java)", "Node.js", "REST APIs"],
  },
  {
    title: "GIS & Remote Sensing",
    icon: Satellite,
    skills: ["Google Earth Engine", "ArcGIS", "Sentinel-2", "MODIS AOD", "MERRA-2", "Spatial Analytics"],
  },
  {
    title: "Data Analysis",
    icon: BarChart3,
    skills: ["EDA", "Data Cleaning", "Feature Engineering", "Visualization", "Statistical Analysis"],
  },
  {
    title: "Programming",
    icon: Database,
    skills: ["Python", "Java", "C/C++", "JavaScript", "SQL"],
  },
  {
    title: "Tools",
    icon: Layers,
    skills: ["Git", "GitHub", "VS Code", "Jupyter", "Linux"],
  },
]

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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
    <section ref={sectionRef} id="skills" className="relative py-32 px-6 overflow-hidden">
      {/* Orbital background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full border border-border/10 animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-border/10 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-primary/10 animate-[spin_20s_linear_infinite]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Globe2 className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
            Skill Orbit
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-display)]">
            Skills & <span className="text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A diverse toolkit combining AI, geospatial technology, and full-stack development
          </p>
        </div>

        {/* Skills Grid as Orbiting Planets */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <div
              key={category.title}
              className={`group relative rounded-3xl bg-card/30 backdrop-blur-md border border-border/30 overflow-hidden hover:border-primary/40 transition-all duration-700 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-500">
                      <category.icon className="w-7 h-7 text-primary" />
                    </div>
                    {/* Orbit ring */}
                    <div className="absolute -inset-2 rounded-full border border-primary/20 opacity-0 group-hover:opacity-100 group-hover:animate-[ping_2s_ease-out_infinite] transition-opacity" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-[family-name:var(--font-display)]">{category.title}</h3>
                </div>

                {/* Skills List */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span
                      key={skill}
                      className="px-4 py-2 text-sm rounded-full bg-card/80 text-secondary-foreground border border-border/50 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                      style={{ transitionDelay: `${skillIndex * 50}ms` } as React.CSSProperties}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certification Badge */}
        <div
          className={`mt-16 text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-card/30 backdrop-blur-md border border-primary/30 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-left">
              <div className="text-foreground font-bold">Elite + Gold (Top 2%)</div>
              <div className="text-sm text-muted-foreground">NPTEL Programming in Java</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
