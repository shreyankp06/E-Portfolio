"use client"

import { useEffect, useState, useCallback } from "react"
import { Rocket } from "lucide-react"

export function CursorRocket() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(-45)
  const [isVisible, setIsVisible] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [trail, setTrail] = useState<{ x: number; y: number; opacity: number }[]>([])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setTargetPosition({ x: e.clientX, y: e.clientY })
    setIsVisible(true)
    setIsMoving(true)
  }, [])

  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const mediaQuery = window.matchMedia("(hover: hover)")
    if (!mediaQuery.matches) return

    window.addEventListener("mousemove", handleMouseMove)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleMouseMove])

  useEffect(() => {
    let animationFrameId: number
    let lastTime = 0
    let moveTimeout: NodeJS.Timeout

    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time
      const delta = (time - lastTime) / 1000
      lastTime = time

      setPosition((prev) => {
        const dx = targetPosition.x - prev.x
        const dy = targetPosition.y - prev.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 1) {
          // Calculate rotation based on movement direction
          const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45
          setRotation(angle)

          // Smooth easing
          const ease = 0.08
          const newX = prev.x + dx * ease
          const newY = prev.y + dy * ease

          // Add trail particle
          setTrail((prevTrail) => {
            const newTrail = [
              ...prevTrail,
              { x: newX, y: newY, opacity: 0.6 },
            ].slice(-8) // Keep last 8 particles

            return newTrail.map((p) => ({ ...p, opacity: p.opacity * 0.85 }))
          })

          return { x: newX, y: newY }
        }

        return prev
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Set moving to false after no movement
    clearTimeout(moveTimeout)
    moveTimeout = setTimeout(() => setIsMoving(false), 150)

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearTimeout(moveTimeout)
    }
  }, [targetPosition])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {/* Trail particles */}
      {trail.map((particle, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: particle.x - 4,
            top: particle.y - 4,
            opacity: particle.opacity,
            background: `radial-gradient(circle, rgba(56, 189, 248, ${particle.opacity}) 0%, transparent 70%)`,
            boxShadow: `0 0 ${6 + i}px rgba(56, 189, 248, ${particle.opacity * 0.5})`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Rocket */}
      <div
        className="absolute transition-transform duration-75"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${isMoving ? 1.1 : 1})`,
        }}
      >
        {/* Rocket glow */}
        <div
          className="absolute inset-0 blur-md opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.6) 0%, transparent 70%)",
            width: 40,
            height: 40,
            left: -10,
            top: -10,
          }}
        />
        
        {/* Engine flame */}
        {isMoving && (
          <div
            className="absolute animate-pulse"
            style={{
              width: 12,
              height: 20,
              left: -2,
              top: 18,
              background: "linear-gradient(to bottom, #f97316 0%, #fbbf24 50%, transparent 100%)",
              borderRadius: "50% 50% 50% 50%",
              filter: "blur(2px)",
              transform: "rotate(180deg)",
            }}
          />
        )}

        <Rocket
          className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          strokeWidth={2}
        />
      </div>
    </div>
  )
}
