"use client"

import { useRef, useEffect, useState } from "react"
import { useAudio } from "./audio-context"

interface SolarSystem3DProps {
  readonly isVisible: boolean
  readonly onClose?: () => void
}

export function SolarSystem3D({ isVisible, onClose }: Readonly<SolarSystem3DProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const { playHover } = useAudio()
  const [time, setTime] = useState(0)
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)

  const planets = [
    { name: "Mercury", radius: 8, distance: 80, speed: 0.02, color: "#8C7853" },
    { name: "Venus", radius: 12, distance: 110, speed: 0.015, color: "#FFC649" },
    { name: "Earth", radius: 14, distance: 150, speed: 0.01, color: "#6B93D6" },
    { name: "Mars", radius: 10, distance: 190, speed: 0.008, color: "#C1440E" },
    { name: "Jupiter", radius: 25, distance: 280, speed: 0.005, color: "#D8CA9D" },
    { name: "Saturn", radius: 22, distance: 350, speed: 0.003, color: "#FAD5A5" },
    { name: "Uranus", radius: 18, distance: 420, speed: 0.002, color: "#4FD0E7" },
    { name: "Neptune", radius: 17, distance: 480, speed: 0.001, color: "#4B70DD" }
  ]

  // Handle escape key
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.()
      }
    }

    globalThis.addEventListener("keydown", handleKeyDown)
    return () => globalThis.removeEventListener("keydown", handleKeyDown)
  }, [isVisible, onClose])

  useEffect(() => {
    if (!isVisible) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw sun
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30)
      sunGradient.addColorStop(0, "#FFD700")
      sunGradient.addColorStop(1, "#FFA500")
      ctx.fillStyle = sunGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 25, 0, Math.PI * 2)
      ctx.fill()

      // Draw sun glow
      ctx.shadowColor = "#FFD700"
      ctx.shadowBlur = 20
      ctx.beginPath()
      ctx.arc(centerX, centerY, 25, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw orbital paths
      planets.forEach(planet => {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2)
        ctx.stroke()
      })

      // Draw planets
      planets.forEach(planet => {
        const angle = time * planet.speed
        const x = centerX + Math.cos(angle) * planet.distance
        const y = centerY + Math.sin(angle) * planet.distance

        // Planet shadow/glow effect
        if (hoveredPlanet === planet.name) {
          ctx.shadowColor = planet.color
          ctx.shadowBlur = 15
        }

        // Planet body
        ctx.fillStyle = planet.color
        ctx.beginPath()
        ctx.arc(x, y, planet.radius, 0, Math.PI * 2)
        ctx.fill()

        // Reset shadow
        ctx.shadowBlur = 0

        // Planet label (only when hovered)
        if (hoveredPlanet === planet.name) {
          ctx.fillStyle = "white"
          ctx.font = "14px monospace"
          ctx.textAlign = "center"
          ctx.fillText(planet.name, x, y - planet.radius - 10)
        }
      })

      setTime(prev => prev + 0.02)
      animationRef.current = requestAnimationFrame(animate)
    }

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    animate()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible, time, hoveredPlanet])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Check if click is near any planet
    planets.forEach(planet => {
      const angle = time * planet.speed
      const planetX = centerX + Math.cos(angle) * planet.distance
      const planetY = centerY + Math.sin(angle) * planet.distance

      const distance = Math.hypot(x - planetX, y - planetY)

      if (distance < planet.radius + 10) {
        playHover()
        // Could trigger planet-specific content or navigation
        console.log(`Clicked on ${planet.name}`)
      }
    })
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    let foundPlanet = null

    planets.forEach(planet => {
      const angle = time * planet.speed
      const planetX = centerX + Math.cos(angle) * planet.distance
      const planetY = centerY + Math.sin(angle) * planet.distance

      const distance = Math.hypot(x - planetX, y - planetY)

      if (distance < planet.radius + 20) {
        foundPlanet = planet.name
      }
    })

    setHoveredPlanet(foundPlanet)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl max-h-4xl">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
        />

        {/* UI Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <h3 className="font-bold">Solar System Explorer</h3>
            <p className="text-sm text-white/70">Hover over planets to learn more</p>
          </div>

          <button
            onClick={onClose}
            className="bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Planet Info Panel */}
        {hoveredPlanet && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
            <h4 className="font-bold text-lg mb-2">{hoveredPlanet}</h4>
            <p className="text-sm text-white/70">
              {hoveredPlanet === "Earth" && "Home planet - Full of life and technology"}
              {hoveredPlanet === "Mars" && "The Red Planet - Future colonization target"}
              {hoveredPlanet === "Jupiter" && "Gas giant - Largest planet in our solar system"}
              {hoveredPlanet === "Saturn" && "Ringed beauty - Famous for its stunning rings"}
              {hoveredPlanet === "Venus" && "Hot and hostile - Surface temperatures reach 900°F"}
              {hoveredPlanet === "Mercury" && "Closest to the Sun - Extreme temperature swings"}
              {hoveredPlanet === "Uranus" && "Ice giant - Rotates on its side"}
              {hoveredPlanet === "Neptune" && "Distant world - Strongest winds in the solar system"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}