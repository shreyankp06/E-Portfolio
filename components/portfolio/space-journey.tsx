"use client"

import { useState, useEffect, useRef } from "react"
import { Rocket, Satellite, Globe2, User, Mail, FileText, ChevronRight, ChevronLeft, Monitor, Orbit } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudio } from "./audio-context"
import { SolarSystem3D } from "./solar-system-3d"
import { SpaceTerminal } from "./space-terminal"

interface SpaceJourneyProps {
  readonly onSectionChange?: (section: string) => void
}

const journeyStops = [
  {
    id: "launch",
    title: "Mission Control",
    subtitle: "Launch Sequence",
    icon: Rocket,
    description: "Initiating launch from Earth",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    position: { x: 10, y: 85 }
  },
  {
    id: "orbit",
    title: "Earth Orbit",
    subtitle: "Reaching Orbit",
    icon: Satellite,
    description: "Entering stable orbit around Earth",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    position: { x: 25, y: 70 }
  },
  {
    id: "solar-system",
    title: "Solar System",
    subtitle: "Journey Through Space",
    icon: Globe2,
    description: "Exploring the cosmic neighborhood",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    position: { x: 45, y: 50 }
  },
  {
    id: "mars",
    title: "Mars Colony",
    subtitle: "Red Planet Base",
    icon: FileText,
    description: "Projects & Achievements",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-500/10",
    position: { x: 65, y: 35 }
  },
  {
    id: "moon",
    title: "Lunar Station",
    subtitle: "Skills & Technologies",
    icon: User,
    description: "Technical expertise & capabilities",
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-500/10",
    position: { x: 80, y: 20 }
  },
  {
    id: "contact",
    title: "Communication Hub",
    subtitle: "Contact & Connect",
    icon: Mail,
    description: "Let's establish contact",
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-500/10",
    position: { x: 90, y: 10 }
  }
]

export function SpaceJourney({ onSectionChange }: SpaceJourneyProps) {
  const [currentStop, setCurrentStop] = useState(0)
  const [isAutoPiloting, setIsAutoPiloting] = useState(false)
  const [showJourney, setShowJourney] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSolarSystem, setShowSolarSystem] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { playClick, playHover, startAmbient, stopAmbient } = useAudio()

  // Draw orbital paths
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !showJourney) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const drawOrbitalPaths = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connecting lines between stops
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      journeyStops.forEach((stop, index) => {
        if (index < journeyStops.length - 1) {
          const current = journeyStops[index]
          const next = journeyStops[index + 1]

          const startX = (current.position.x / 100) * canvas.width
          const startY = (current.position.y / 100) * canvas.height
          const endX = (next.position.x / 100) * canvas.width
          const endY = (next.position.y / 100) * canvas.height

          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.stroke()

          // Highlight completed path
          if (index < currentStop) {
            ctx.strokeStyle = "rgba(34, 197, 94, 0.8)"
            ctx.setLineDash([])
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)
            ctx.stroke()
            ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
            ctx.lineWidth = 2
            ctx.setLineDash([5, 5])
          }
        }
      })
    }

    resizeCanvas()
    drawOrbitalPaths()
    window.addEventListener("resize", () => {
      resizeCanvas()
      drawOrbitalPaths()
    })

    return () => window.removeEventListener("resize", resizeCanvas)
  }, [currentStop, showJourney])

  const navigateToStop = (index: number) => {
    if (index === currentStop || isTransitioning) return

    setIsTransitioning(true)
    playClick()

    setTimeout(() => {
      setCurrentStop(index)
      onSectionChange?.(journeyStops[index].id)
      setIsTransitioning(false)
    }, 800)
  }

  const toggleAutoPilot = () => {
    setIsAutoPiloting(!isAutoPiloting)
    playClick()

    if (!isAutoPiloting) {
      // Start auto journey
      const autoNavigate = (index: number) => {
        if (index >= journeyStops.length || !isAutoPiloting) return

        navigateToStop(index)
        setTimeout(() => autoNavigate(index + 1), 3000)
      }
      autoNavigate(currentStop + 1)
    }
  }

  const toggleJourneyView = () => {
    if (showJourney) {
      setShowJourney(false)
      stopAmbient()
    } else {
      setShowJourney(true)
      startAmbient()
    }
    playClick()
  }

  const switchToTerminal = () => {
    setShowTerminal(true)
    setShowSolarSystem(false)
    playClick()
  }

  const switchToSolarSystem = () => {
    setShowSolarSystem(true)
    setShowTerminal(false)
    playClick()
  }

  const handleTerminalCommand = (command: string) => {
    if (command === "exit") {
      setShowTerminal(false)
    } else {
      // Map terminal commands to sections
      const sectionMap: { [key: string]: string } = {
        about: "about",
        projects: "projects",
        skills: "skills",
        contact: "contact"
      }
      if (sectionMap[command]) {
        onSectionChange?.(sectionMap[command])
        const element = document.getElementById(sectionMap[command])
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
  }

  return (
    <>
      {/* Mode Toggle Buttons */}
      <div className="fixed top-4 right-20 z-50 flex gap-2">
        <button
          onClick={toggleJourneyView}
          onMouseEnter={playHover}
          className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-full p-3 text-white hover:bg-white/10 transition-all duration-300"
          title="Journey Mode"
          aria-label="Toggle Journey Mode"
        >
          <Rocket className="w-5 h-5" />
        </button>
        <button
          onClick={switchToTerminal}
          onMouseEnter={playHover}
          className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-full p-3 text-white hover:bg-white/10 transition-all duration-300"
          title="Terminal Mode"
          aria-label="Terminal Mode"
        >
          <Monitor className="w-5 h-5" />
        </button>
        <button
          onClick={switchToSolarSystem}
          onMouseEnter={playHover}
          className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-full p-3 text-white hover:bg-white/10 transition-all duration-300"
          title="Solar System Explorer"
          aria-label="Solar System Explorer"
        >
          <Orbit className="w-5 h-5" />
        </button>
      </div>

      {/* Journey Interface */}
      {showJourney && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm">
          {/* Orbital Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* Journey Stops */}
          {journeyStops.map((stop, index) => {
            const Icon = stop.icon
            const isActive = index === currentStop
            const isCompleted = index < currentStop

            return (
              <button
                key={stop.id}
                onClick={() => navigateToStop(index)}
                onMouseEnter={playHover}
                disabled={isTransitioning}
                title={`${stop.title} - ${stop.subtitle}`}
                aria-label={`Navigate to ${stop.title}`}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
                  "group hover:scale-110",
                  isActive && "scale-125 animate-pulse",
                  isCompleted && "scale-110",
                  isTransitioning && "pointer-events-none"
                )}
                style={{
                  left: `${stop.position.x}%`,
                  top: `${stop.position.y}%`
                }}
              >
                {/* Orbital Ring */}
                <div className={cn(
                  "absolute inset-0 rounded-full border-2 transition-all duration-300",
                  isActive ? "border-white scale-150 animate-spin" : "border-white/30",
                  isCompleted && "border-green-400"
                )} />

                {/* Planet/Icon */}
                <div className={cn(
                  "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                  stop.bgColor,
                  "backdrop-blur-sm border border-white/20",
                  isActive && "shadow-lg shadow-white/50",
                  isCompleted && "bg-green-500/20 border-green-400"
                )}>
                  <Icon className={cn(
                    "w-8 h-8 transition-colors duration-300",
                    isActive ? "text-white" : "text-white/70",
                    isCompleted && "text-green-400"
                  )} />
                </div>

                {/* Tooltip */}
                <div className={cn(
                  "absolute top-full mt-2 left-1/2 transform -translate-x-1/2",
                  "bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm",
                  "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  "pointer-events-none whitespace-nowrap border border-white/20"
                )}>
                  <div className="font-bold">{stop.title}</div>
                  <div className="text-xs text-white/70">{stop.subtitle}</div>
                  <div className="text-xs mt-1">{stop.description}</div>
                </div>
              </button>
            )
          })}

          {/* Current Mission Display */}
          <div className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {journeyStops[currentStop].title}
                </h3>
                <p className="text-white/70 text-sm">
                  {journeyStops[currentStop].description}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Navigation Arrows */}
                <button
                  onClick={() => navigateToStop(Math.max(0, currentStop - 1))}
                  disabled={currentStop === 0 || isTransitioning}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Previous Stop"
                  aria-label="Previous Stop"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={() => navigateToStop(Math.min(journeyStops.length - 1, currentStop + 1))}
                  disabled={currentStop === journeyStops.length - 1 || isTransitioning}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Next Stop"
                  aria-label="Next Stop"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Auto Pilot */}
                <button
                  onClick={toggleAutoPilot}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    isAutoPiloting
                      ? "bg-red-500/20 text-red-400 border border-red-400"
                      : "bg-blue-500/20 text-blue-400 border border-blue-400"
                  )}
                >
                  {isAutoPiloting ? "Stop Auto" : "Auto Pilot"}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${((currentStop + 1) / journeyStops.length) * 100}%` }}

              />
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                Journey progress: {currentStop + 1} of {journeyStops.length} stops completed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Solar System 3D Explorer */}
      <SolarSystem3D
        isVisible={showSolarSystem}
        onClose={() => setShowSolarSystem(false)}
      />

      {/* Space Terminal */}
      <SpaceTerminal
        isVisible={showTerminal}
        onCommand={handleTerminalCommand}
      />
    </>
  )
}