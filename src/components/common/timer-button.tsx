"use client"

import { CheckCircle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface TimerButtonProps {
  duration?: number // Duration in seconds
  onComplete?: () => void
  onCancel?: () => void
  text?: string
  loadingText?: string
  completedText?: string
  className?: string
  cancelOnHover?: boolean
}

export default function TimerButton({
  duration = 10,
  onComplete,
  onCancel,
  text = "Confirmar",
  loadingText = "Confirmando...",
  completedText = "Confirmado!",
  className = "",
  cancelOnHover = true,
}: TimerButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const startTime = Date.now()
    const endTime = startTime + duration * 1000

    const updateProgress = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const newProgress = Math.min((elapsed / (duration * 1000)) * 100, 100)

      setProgress(newProgress)

      if (currentTime >= endTime) {
        setIsLoading(false)
        setIsCompleted(true)
        if (onComplete) onComplete()
        return
      }

      requestAnimationFrame(updateProgress)
    }

    const animationId = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(animationId)
  }, [isLoading, duration, onComplete])

  const handleClick = () => {
    if (isLoading || isCompleted) return
    setIsLoading(true)
    setProgress(0)
  }

  const handleMouseEnter = () => {
    if (cancelOnHover && isLoading) {
      setIsLoading(false)
      setProgress(0)
      if (onCancel) onCancel()
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={isLoading}
      className={`relative overflow-hidden rounded-md px-6 py-3 font-medium text-primary-foreground transition-all ${
        isCompleted
          ? "bg-primary hover:bg-primary/90"
          : "bg-primary hover:bg-primary/90"
      } ${className}`}
    >
      {/* Progress background */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-primary transition-all"
          style={{
            width: `${progress}%`,
            transition: "width 0.1s linear",
          }}
        />
      )}

      {/* Button content */}
      <div className="relative flex items-center justify-center gap-2">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isCompleted && <CheckCircle className="h-4 w-4" />}
        <span>
          {isCompleted ? completedText : isLoading ? loadingText : text}
        </span>
      </div>
    </button>
  )
}
