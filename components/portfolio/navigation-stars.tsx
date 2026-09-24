"use client"

import { useState, useEffect } from "react"
import { useAudio } from "./audio-context"
import styles from "./navigation-stars.module.css"

interface NavigationStar {
  id: string
  label: string
  section: string
  baseX: number
  baseY: number
}

const navStars: NavigationStar[] = [
  { id: "hero", label: "Home", section: "hero", baseX: 15, baseY: 20 },
  { id: "about", label: "About", section: "about", baseX: 85, baseY: 35 },
  { id: "projects", label: "Projects", section: "projects", baseX: 10, baseY: 55 },
  { id: "skills", label: "Skills", section: "skills", baseX: 90, baseY: 70 },
  { id: "contact", label: "Contact", section: "contact", baseX: 20, baseY: 85 },
]

export function NavigationStars() {
  const [hoveredStar, setHoveredStar] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }>({})
  const { playClick, playHover } = useAudio()

  useEffect(() => {
    setMounted(true)
    
    // Initialize positions
    const initialPositions: { [key: string]: { x: number; y: number } } = {}
    navStars.forEach((star) => {
      initialPositions[star.id] = { x: star.baseX, y: star.baseY }
    })
    setPositions(initialPositions)
  }, [])

  useEffect(() => {
    if (!mounted) return

    let animationFrameId: number
    let time = 0

    const animate = () => {
      time += 0.01
      
      const newPositions: { [key: string]: { x: number; y: number } } = {}
      navStars.forEach((star, i) => {
        // Gentle floating motion
        const offsetX = Math.sin(time + i * 1.5) * 2
        const offsetY = Math.cos(time * 0.8 + i * 1.2) * 2
        newPositions[star.id] = {
          x: star.baseX + offsetX,
          y: star.baseY + offsetY,
        }
      })
      
      setPositions(newPositions)
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [mounted])

  const handleClick = (section: string) => {
    playClick()
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleHover = (starId: string) => {
    playHover()
    setHoveredStar(starId)
  }

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[15]">
      {navStars.map((star) => {
        const pos = positions[star.id] || { x: star.baseX, y: star.baseY }
        const isHovered = hoveredStar === star.id

        return (
          <button
            key={star.id}
            onClick={() => handleClick(star.section)}
            onMouseEnter={() => handleHover(star.id)}
            onMouseLeave={() => setHoveredStar(null)}
            className={`absolute pointer-events-auto cursor-pointer group transition-all duration-300 ${styles.navButton}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            aria-label={`Navigate to ${star.label}`}
          >
            {/* Outer glow ring */}
            <div
              className={`${styles.outerGlowRing} ${
                isHovered ? "scale-[3] opacity-100" : "scale-100 opacity-0"
              }`}
            />

            {/* Pulsing ring */}
            <div
              className={`${styles.pulsingRing} ${
                isHovered ? "animate-ping" : ""
              }`}
            />

            {/* Star core */}
            <div
              className={`relative w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isHovered
                  ? "bg-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.9),0_0_40px_rgba(56,189,248,0.5)] scale-150"
                  : "bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              }`}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-white/50 animate-pulse" />
            </div>

            {/* Label */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-y-6 scale-100"
                  : "opacity-0 translate-y-4 scale-90"
              }`}
            >
              <span className="px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/80 backdrop-blur-sm rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                {star.label}
              </span>
            </div>

            {/* Constellation lines (connecting dots) */}
            {isHovered && (
              <svg
                className={`absolute pointer-events-none opacity-30 ${styles.constellationSvg}`}
              >
                <line
                  x1="100"
                  y1="100"
                  x2="150"
                  y2="50"
                  stroke="rgba(56, 189, 248, 0.5)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <line
                  x1="100"
                  y1="100"
                  x2="50"
                  y2="150"
                  stroke="rgba(56, 189, 248, 0.5)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
