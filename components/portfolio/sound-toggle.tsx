"use client"

import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { useAudio } from "./audio-context"
import { cn } from "@/lib/utils"

export function SoundToggle() {
  const { isSoundEnabled, toggleSound, volume, setVolume, startAmbient, stopAmbient } = useAudio()
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  const handleToggle = () => {
    toggleSound()
    if (isSoundEnabled) {
      // Will be disabled after toggle
      stopAmbient()
    } else {
      setTimeout(() => startAmbient(), 300)
    }
  }

  return (
    <section 
      className="fixed top-6 right-6 z-50 flex items-center gap-2"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
      aria-label="Sound controls"
    >
      {/* Volume Slider */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full bg-card/30 backdrop-blur-md border border-border/30 transition-all duration-300",
          showVolumeSlider && isSoundEnabled ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        )}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
          title="Volume control"
          className="w-20 h-1 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={cn(
          "group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
          "bg-card/30 backdrop-blur-md border border-border/30",
          "hover:border-primary/50 hover:bg-primary/20 hover:scale-110",
          isSoundEnabled && "border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        )}
        aria-label={isSoundEnabled ? "Mute sound" : "Enable sound"}
      >
        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            isSoundEnabled ? "bg-primary/10 animate-pulse" : "bg-transparent"
          )}
        />
        
        {/* Icon */}
        {isSoundEnabled ? (
          <Volume2 className="w-5 h-5 text-primary relative z-10 transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <VolumeX className="w-5 h-5 text-muted-foreground relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
        )}

        {/* Ripple effect when enabled */}
        {isSoundEnabled && (
          <>
            <span className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_2s_ease-out_infinite]" />
            <span className="absolute inset-0 rounded-full border border-primary/20 animate-[ping_2s_ease-out_0.5s_infinite]" />
          </>
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute top-full mt-2 right-0 px-3 py-1.5 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
        {isSoundEnabled ? "Sound On" : "Sound Off (Click to enable)"}
      </div>
    </section>
  )
}
