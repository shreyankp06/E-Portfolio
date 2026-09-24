"use client"

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react"

interface AudioContextType {
  isSoundEnabled: boolean
  toggleSound: () => void
  playClick: () => void
  playHover: () => void
  playRocketLaunch: () => void
  startAmbient: () => void
  stopAmbient: () => void
  setVolume: (volume: number) => void
  volume: number
}

const AudioContext = createContext<AudioContextType | null>(null)

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

// Web Audio API based sound generator for futuristic sounds
function createOscillator(
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.1
) {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(0.3)
  const audioContextRef = useRef<AudioContext | null>(null)
  const ambientIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const ambientNodesRef = useRef<{ oscillator: OscillatorNode; gain: GainNode }[]>([])

  // Initialize audio context on first interaction
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume()
    }
    return audioContextRef.current
  }, [])

  // Click sound - short futuristic beep
  const playClick = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getAudioContext()
    
    // Short ascending tone
    createOscillator(ctx, 800, 0.08, "sine", volume * 0.15)
    setTimeout(() => createOscillator(ctx, 1200, 0.06, "sine", volume * 0.1), 20)
  }, [isSoundEnabled, volume, getAudioContext])

  // Hover sound - subtle blip
  const playHover = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getAudioContext()
    createOscillator(ctx, 600, 0.05, "sine", volume * 0.08)
  }, [isSoundEnabled, volume, getAudioContext])

  // Rocket launch sound - dramatic ascending sweep
  const playRocketLaunch = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getAudioContext()
    
    // Low rumble
    const noise = ctx.createOscillator()
    const noiseGain = ctx.createGain()
    noise.type = "sawtooth"
    noise.frequency.setValueAtTime(50, ctx.currentTime)
    noise.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.5)
    noiseGain.gain.setValueAtTime(volume * 0.2, ctx.currentTime)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
    noise.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start()
    noise.stop(ctx.currentTime + 1.5)

    // High ascending whistle
    const whistle = ctx.createOscillator()
    const whistleGain = ctx.createGain()
    whistle.type = "sine"
    whistle.frequency.setValueAtTime(400, ctx.currentTime)
    whistle.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 1.2)
    whistleGain.gain.setValueAtTime(volume * 0.1, ctx.currentTime)
    whistleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
    whistle.connect(whistleGain)
    whistleGain.connect(ctx.destination)
    whistle.start()
    whistle.stop(ctx.currentTime + 1.2)
  }, [isSoundEnabled, volume, getAudioContext])

  // Ambient space sound - subtle pulsing drone
  const startAmbient = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getAudioContext()
    
    // Create layered ambient drones
    const frequencies = [60, 90, 120]
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
      
      // Very subtle volume with slow modulation
      gain.gain.setValueAtTime(volume * 0.02, ctx.currentTime)
      
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start()
      
      ambientNodesRef.current.push({ oscillator, gain })
      
      // Add subtle volume modulation
      const modulate = () => {
        if (!ambientNodesRef.current.length) return
        const time = ctx.currentTime
        gain.gain.setValueAtTime(volume * 0.015, time)
        gain.gain.linearRampToValueAtTime(volume * 0.025, time + 2 + index)
        gain.gain.linearRampToValueAtTime(volume * 0.015, time + 4 + index)
      }
      
      modulate()
      ambientIntervalRef.current = setInterval(modulate, 4000)
    })
  }, [isSoundEnabled, volume, getAudioContext])

  const stopAmbient = useCallback(() => {
    ambientNodesRef.current.forEach(({ oscillator, gain }) => {
      gain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current?.currentTime ?? 0 + 0.5)
      setTimeout(() => {
        try {
          oscillator.stop()
        } catch {
          // Already stopped
        }
      }, 500)
    })
    ambientNodesRef.current = []
    
    if (ambientIntervalRef.current) {
      clearInterval(ambientIntervalRef.current)
      ambientIntervalRef.current = null
    }
  }, [])

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => {
      const newValue = !prev
      if (newValue) {
        // Play a confirmation sound when enabling
        const ctx = getAudioContext()
        createOscillator(ctx, 523, 0.1, "sine", 0.1) // C5
        setTimeout(() => createOscillator(ctx, 659, 0.1, "sine", 0.1), 100) // E5
        setTimeout(() => createOscillator(ctx, 784, 0.15, "sine", 0.1), 200) // G5
      } else {
        stopAmbient()
      }
      return newValue
    })
  }, [getAudioContext, stopAmbient])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbient()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stopAmbient])

  return (
    <AudioContext.Provider
      value={{
        isSoundEnabled,
        toggleSound,
        playClick,
        playHover,
        playRocketLaunch,
        startAmbient,
        stopAmbient,
        setVolume,
        volume,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}
