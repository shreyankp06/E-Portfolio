"use client"

import { Mail, Phone, MapPin, Download, Radio, Send, Briefcase, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "shreyankp06@gmail.com",
    href: "mailto:shreyankp06@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 8424089685",
    href: "tel:+918424089685",
  },
  {
    icon: Briefcase,
    label: "LinkedIn",
    value: "linkedin.com/in/shreyankparab",
    href: "https://www.linkedin.com/in/shreyankparab",
  },
  {
    icon: Code,
    label: "GitHub",
    value: "github.com/shreyankp06",
    href: "https://github.com/shreyankp06",
  },
]

export function ContactSection() {
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
    <section ref={sectionRef} id="contact" className="relative py-32 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Radio className="w-4 h-4 animate-pulse" />
            Communication Hub
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-display)]">
            Get In <span className="text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I&apos;m currently looking for internship opportunities. Feel free to reach out if you&apos;d like to connect!
          </p>
        </div>

        {/* Communication Dashboard */}
        <div
          className={`relative rounded-3xl bg-card/30 backdrop-blur-md border border-border/30 overflow-hidden transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Top control bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-card/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Signal Active</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Mumbai, India</span>
            </div>
          </div>

          <div className="p-8">
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`group flex items-center gap-4 p-5 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm hover:bg-card/70 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500 shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-foreground font-medium truncate group-hover:text-primary transition-colors">
                      {item.value}
                    </p>
                  </div>
                  <Send className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-500 hover:scale-105"
              >
                <a href="mailto:shreyankp06@gmail.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Send Transmission
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-border/30 bg-card/30 backdrop-blur-sm hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-500 hover:scale-105"
              >
                <a href="/resume.pdf" download>
                  <Download className="w-5 h-5 mr-2" />
                  Download Mission File
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
