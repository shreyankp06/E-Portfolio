"use client"

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"

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
  unlockAudio: () => Promise<void>
}

const AudioContext = createContext<AudioContextType | null>(null)

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

// 🔊 Sound generator
function createOscillator(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.2
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)

  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(1)

  const audioContextRef = useRef<AudioContext | null>(null)
  const ambientNodesRef = useRef<
    { oscillator: OscillatorNode; gain: GainNode }[]
  >([])

  // ✅ Create / Resume context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  // 🔥 IMPORTANT: unlock audio (must be called on click)
  const unlockAudio = useCallback(async () => {
    const ctx = getAudioContext()
    if (ctx.state === "suspended") {
      await ctx.resume()
    }
  }, [getAudioContext])

  // 🔘 Click
  const playClick = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getAudioContext()

    createOscillator(ctx, 800, 0.08, "sine", volume * 0.3)
    setTimeout(() => createOscillator(ctx, 1200, 0.06, "sine", volume * 0.2), 20)
  }, [isSoundEnabled, volume, getAudioContext])

  // 🖱 Hover
  const playHover = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getAudioContext()
    createOscillator(ctx, 600, 0.05, "sine", volume * 0.2)
  }, [isSoundEnabled, volume, getAudioContext])

  // 🚀 Rocket Launch (FIXED LOUD + CLEAR)
  const playRocketLaunch = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getAudioContext()

    // 🔥 Rumble
    const noise = ctx.createOscillator()
    const noiseGain = ctx.createGain()

    noise.type = "sawtooth"
    noise.frequency.setValueAtTime(80, ctx.currentTime)
    noise.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1.5)

    noiseGain.gain.setValueAtTime(volume * 0.6, ctx.currentTime)
    noiseGain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 1.5
    )

    noise.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start()
    noise.stop(ctx.currentTime + 1.5)

    // 🔊 Whistle
    const whistle = ctx.createOscillator()
    const whistleGain = ctx.createGain()

    whistle.type = "sine"
    whistle.frequency.setValueAtTime(400, ctx.currentTime)
    whistle.frequency.exponentialRampToValueAtTime(
      2000,
      ctx.currentTime + 1.2
    )

    whistleGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime)
    whistleGain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 1.2
    )

    whistle.connect(whistleGain)
    whistleGain.connect(ctx.destination)

    whistle.start()
    whistle.stop(ctx.currentTime + 1.2)
  }, [isSoundEnabled, volume, getAudioContext])

  // 🌌 Ambient
  const startAmbient = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getAudioContext()

    const freqs = [60, 90, 120]

    freqs.forEach((f) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(f, ctx.currentTime)

      gain.gain.setValueAtTime(volume * 0.02, ctx.currentTime)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()

      ambientNodesRef.current.push({ oscillator: osc, gain })
    })
  }, [isSoundEnabled, volume, getAudioContext])

  const stopAmbient = useCallback(() => {
    ambientNodesRef.current.forEach(({ oscillator }) => {
      try {
        oscillator.stop()
      } catch {}
    })
    ambientNodesRef.current = []
  }, [])

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => !prev)
    if (!isSoundEnabled) stopAmbient()
  }, [isSoundEnabled, stopAmbient])

  useEffect(() => {
    return () => {
      stopAmbient()
      audioContextRef.current?.close()
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
        unlockAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}