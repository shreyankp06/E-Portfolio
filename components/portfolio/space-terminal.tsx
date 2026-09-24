"use client"

import { useState, useEffect, useRef, SyntheticEvent, KeyboardEvent } from "react"
import { ChevronRight, Terminal } from "lucide-react"
import { useAudio } from "./audio-context"

interface SpaceTerminalProps {
  readonly isVisible: boolean
  readonly onCommand: (command: string) => void
}

const commands = {
  help: "Available commands: help, about, projects, skills, contact, clear, exit",
  about: "Navigate to astronaut profile and background",
  projects: "View space missions and achievements",
  skills: "Display technical capabilities and tools",
  contact: "Open communication channels",
  clear: "Clear terminal output",
  exit: "Exit terminal mode"
}

export function SpaceTerminal({ isVisible, onCommand }: Readonly<SpaceTerminalProps>) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([
    "Welcome to Space Terminal v2.1.7",
    "Type 'help' for available commands",
    "Ready for mission control..."
  ])
  const [cursorVisible, setCursorVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const { playClick } = useAudio()

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Handle escape key
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (event: Event) => {
      const keyboardEvent = event as unknown as KeyboardEvent
      if (keyboardEvent.key === "Escape") {
        onCommand("exit")
      }
    }

    globalThis.addEventListener("keydown", handleKeyDown)
    return () => globalThis.removeEventListener("keydown", handleKeyDown)
  }, [isVisible, onCommand])

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    playClick()
    const command = input.trim().toLowerCase()
    const newHistory = [...history, `> ${input}`]
    const response = commands[command as keyof typeof commands]

    if (command === "clear") {
      setHistory(["Terminal cleared.", "Ready for mission control..."])
    } else if (command === "exit") {
      setHistory(newHistory)
      onCommand("exit")
    } else if (response) {
      newHistory.push(response)
      setHistory(newHistory)

      if (["about", "projects", "skills", "contact"].includes(command)) {
        onCommand(command)
      }
    } else {
      newHistory.push(
        `Command not recognized: ${command}`,
        "Type 'help' for available commands"
      )
      setHistory(newHistory)
    }

    setInput("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      // Could implement command history here
      e.preventDefault()
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm font-mono text-green-400">
      {/* Terminal Header */}
      <div className="bg-gray-900 border-b border-green-400/30 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          <span className="font-bold">SPACE TERMINAL v2.1.7</span>
        </div>
        <div className="text-xs text-green-300">
          STATUS: ONLINE | MISSION: PORTFOLIO_NAVIGATION
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Command History */}
          <div className="space-y-2 mb-6">
            {history.map((line) => (
              <div key={line} className="flex items-start gap-2">
                {line.startsWith(">") ? (
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <span className="w-4 flex-shrink-0"></span>
                )}
                <span className={line.startsWith(">") ? "text-blue-400" : ""}>
                  {line}
                </span>
              </div>
            ))}
          </div>

          {/* Current Input Line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 flex-shrink-0 text-green-400" />
            <span className="text-green-400">mission-control@portfolio:~$</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-green-400 font-mono"
                placeholder="Enter command..."
                autoComplete="off"
                spellCheck="false"
              />
              <span
                className={`absolute right-0 top-0 h-full flex items-center ${
                  cursorVisible ? "opacity-100" : "opacity-0"
                } transition-opacity`}
              >
                <span className="w-2 h-5 bg-green-400 animate-pulse"></span>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="border-t border-green-400/30 p-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-xs text-green-300">
          <div>
            Commands: help | about | projects | skills | contact | clear | exit
          </div>
          <div>
            Press Enter to execute | ESC to exit terminal
          </div>
        </div>
      </div>
    </div>
  )
}