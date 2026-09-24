"use client"

import { useEffect, useState, useCallback } from "react"
import { Rocket } from "lucide-react"
import styles from "./cursor-rocket.module.css"

export function CursorRocket() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(-45)
  const [isVisible, setIsVisible] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [trail, setTrail] = useState<{ x: number; y: number; opacity: number }[]>([])

  const updateTrailParticles = (newX: number, newY: number) => {
    setTrail((prevTrail) => {
      const newTrail = [
        ...prevTrail,
        { x: newX, y: newY, opacity: 0.6 },
      ].slice(-8) // Keep last 8 particles

      return newTrail.map((p) => ({ ...p, opacity: p.opacity * 0.85 }))
    })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setTargetPosition({ x: e.clientX, y: e.clientY })
    setIsVisible(true)
    setIsMoving(true)
  }, [])

  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const mediaQuery = globalThis.matchMedia("(hover: hover)")
    if (!mediaQuery.matches) return

    globalThis.addEventListener("mousemove", handleMouseMove)
    
    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleMouseMove])

  useEffect(() => {
    let animationFrameId: number
    let lastTime = 0
    let moveTimeout: NodeJS.Timeout | undefined

    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time
      lastTime = time

      setPosition((prev) => {
        const dx = targetPosition.x - prev.x
        const dy = targetPosition.y - prev.y
        const distance = Math.hypot(dx, dy)

        if (distance > 1) {
          // Calculate rotation based on movement direction
          const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45
          setRotation(angle)

          // Smooth easing
          const ease = 0.08
          const newX = prev.x + dx * ease
          const newY = prev.y + dy * ease

          // Add trail particle
          updateTrailParticles(newX, newY)

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
          className={styles.trailParticle}
          style={{
            left: `${particle.x - 4}px`,
            top: `${particle.y - 4}px`,
            opacity: particle.opacity,
            transform: `scale(${1 + i * 0.1})`,
          }}
        />
      ))}

      {/* Rocket */}
      <div
        className={styles.rocketContainer}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${isMoving ? 1.1 : 1})`,
        }}
      >
        {/* Rocket glow */}
        <div
          className={styles.rocketGlow}
        />
        
        {/* Engine flame */}
        {isMoving && (
          <div
            className={styles.engineFlame}
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
