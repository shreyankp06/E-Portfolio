"use client"

import { useState, useEffect, useMemo } from "react"
import { Rocket } from "lucide-react"
import { useAudio } from "./audio-context"

interface RocketIntroProps {
  readonly onComplete: () => void
}

// Generate stars with a seeded approach - fixed positions to avoid hydration mismatch
const generateStars = () => {
  const stars = []
  for (let i = 0; i < 50; i++) {
    // Use deterministic values based on index
    const left = ((i * 37) % 100)
    const top = ((i * 53 + 17) % 100)
    const opacity = 0.3 + ((i * 23) % 70) / 100
    const delay = ((i * 41) % 200) / 100
    stars.push({ left, top, opacity, delay })
  }
  return stars
}

export function RocketIntro({ onComplete }: RocketIntroProps) {
  const [phase, setPhase] = useState<"countdown" | "launch" | "complete">("countdown")
  const [count, setCount] = useState(3)
  const [mounted, setMounted] = useState(false)
  const { playRocketLaunch, isSoundEnabled } = useAudio()
  
  const stars = useMemo(() => generateStars(), [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (phase === "countdown" && count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 600)
      return () => clearTimeout(timer)
    } else if (phase === "countdown" && count === 0) {
      setPhase("launch")
    }
  }, [phase, count])

  useEffect(() => {
    if (phase === "launch") {
      // Play rocket launch sound when launch begins
      if (isSoundEnabled) {
        playRocketLaunch()
      }
      const timer = setTimeout(() => {
        setPhase("complete")
        setTimeout(onComplete, 500)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [phase, onComplete, isSoundEnabled, playRocketLaunch])

  if (phase === "complete") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0a1a] flex items-center justify-center animate-[fadeOut_0.5s_ease-out_forwards]">
        <style jsx>{`
          @keyframes fadeOut {
            to { opacity: 0; visibility: hidden; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a1a] flex items-center justify-center overflow-hidden">
      {/* Stars in intro - only render after mount to avoid hydration issues */}
      <div className="absolute inset-0">
        {mounted && stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Countdown */}
      {phase === "countdown" && (
        <div className="relative z-10 text-center">
          <div className="text-8xl font-bold text-primary font-[family-name:var(--font-display)] animate-[pulse_0.6s_ease-in-out]">
            {count === 0 ? "LAUNCH!" : count}
          </div>
          <p className="text-muted-foreground mt-4 uppercase tracking-widest text-sm">
            Initiating Mission
          </p>
        </div>
      )}

      {/* Rocket Launch */}
      {phase === "launch" && (
        <div className="relative z-10">
          <div className="animate-[rocketLaunch_1.5s_ease-in_forwards]">
            <div className="relative">
              <Rocket className="w-24 h-24 text-primary -rotate-45" />
              {/* Exhaust flames */}
              <div className="absolute top-16 left-0 w-8 h-32 animate-[flicker_0.1s_infinite]">
                <div className="w-full h-full bg-gradient-to-b from-orange-500 via-yellow-400 to-transparent rounded-full blur-sm" />
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes rocketLaunch {
              0% { transform: translateY(0) scale(1); opacity: 1; }
              100% { transform: translateY(-150vh) scale(0.3); opacity: 0; }
            }
            @keyframes flicker {
              0%, 100% { opacity: 1; transform: scaleY(1); }
              50% { opacity: 0.8; transform: scaleY(0.9); }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
