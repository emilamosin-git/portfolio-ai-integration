'use client'

import { useEffect, useRef, useCallback } from 'react'

export default function MouseEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const hueRef = useRef(180)
  const opacityRef = useRef(0)
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isActiveRef = useRef(false)

  const fadeOut = useCallback(() => {
    isActiveRef.current = false
  }, [])

  const resetInactivity = useCallback(() => {
    isActiveRef.current = true
    opacityRef.current = Math.min(opacityRef.current + 0.1, 1)
    if (inactivityRef.current) clearTimeout(inactivityRef.current)
    inactivityRef.current = setTimeout(fadeOut, 2200)
  }, [fadeOut])

  // Click splash effect
  const handleClick = useCallback((e: MouseEvent) => {
    const ring = document.createElement('div')
    ring.className = 'splash-ring'
    ring.style.left = `${e.clientX}px`
    ring.style.top = `${e.clientY}px`
    document.body.appendChild(ring)
    setTimeout(() => ring.remove(), 650)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      resetInactivity()
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', handleClick)

    const isDark = () =>
      document.documentElement.getAttribute('data-theme') !== 'light'

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)

      // Fade in/out
      if (isActiveRef.current) {
        opacityRef.current = Math.min(opacityRef.current + 0.04, 1)
      } else {
        opacityRef.current = Math.max(opacityRef.current - 0.02, 0)
      }

      if (opacityRef.current <= 0) return

      const { x, y } = mouseRef.current
      const dark = isDark()

      // Fade old trail with semi-transparent fill
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = dark
        ? `rgba(5, 5, 5, 0.18)`
        : `rgba(250, 250, 250, 0.18)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw rainbow blob at cursor
      ctx.globalCompositeOperation = 'source-over'
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 130)
      const h = hueRef.current
      grad.addColorStop(0, `hsla(${h}, 100%, 65%, ${0.35 * opacityRef.current})`)
      grad.addColorStop(0.5, `hsla(${(h + 40) % 360}, 100%, 60%, ${0.15 * opacityRef.current})`)
      grad.addColorStop(1, `hsla(${(h + 80) % 360}, 100%, 55%, 0)`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      hueRef.current = (hueRef.current + 0.6) % 360
    }

    draw()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (inactivityRef.current) clearTimeout(inactivityRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('resize', resize)
    }
  }, [resetInactivity, handleClick])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, mixBlendMode: 'screen' }}
      aria-hidden
    />
  )
}
