"use client"

import { Rocket } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-border/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-display)]">
              <span className="text-foreground">Shreyank</span>{" "}
              <span className="text-primary">Parab</span>
            </span>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Shreyank Parab. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Built with Next.js, Tailwind CSS & passion for space
            </p>
          </div>
        </div>

        {/* Back to top */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Rocket className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            Back to Launch Pad
          </button>
        </div>
      </div>
    </footer>
  )
}
