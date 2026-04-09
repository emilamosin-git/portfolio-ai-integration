'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

type AvatarState = 'idle' | 'thinking' | 'happy'

interface AvatarProps {
  state: AvatarState
  size?: 'sm' | 'lg'
}

export default function Avatar({ state, size = 'lg' }: AvatarProps) {
  const dim = size === 'lg' ? 140 : 68
  const isThinking = state === 'thinking'
  const isHappy = state === 'happy'

  const glowColor = isThinking
    ? 'rgba(34, 211, 238, 0.7)'
    : isHappy
    ? 'rgba(34, 211, 238, 0.5)'
    : 'rgba(34, 211, 238, 0.22)'

  const glowSpread = isThinking ? 28 : isHappy ? 22 : 12

  return (
    <motion.div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: dim, height: dim }}
      layout
      transition={{ type: 'spring', stiffness: 200, damping: 28 }}
    >
      {/* Breathing wrapper */}
      <motion.div
        animate={{ scale: [1, 1.018, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: dim, height: dim, position: 'relative' }}
      >
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isThinking
              ? [
                  `0 0 0 2px ${glowColor}, 0 0 ${glowSpread}px rgba(34,211,238,0.35)`,
                  `0 0 0 2.5px rgba(34,211,238,0.9), 0 0 40px rgba(34,211,238,0.55)`,
                  `0 0 0 2px ${glowColor}, 0 0 ${glowSpread}px rgba(34,211,238,0.35)`,
                ]
              : `0 0 0 2px ${glowColor}, 0 0 ${glowSpread}px rgba(34,211,238,0.18)`,
          }}
          transition={{
            duration: isThinking ? 1.1 : 0.4,
            repeat: isThinking ? Infinity : 0,
            ease: 'easeInOut',
          }}
          style={{ zIndex: 1 }}
        />

        {/* Photo */}
        <div
          style={{
            width: dim,
            height: dim,
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 0,
          }}
        >
          <Image
            src="/Photo.png"
            alt="Emil Amosin"
            width={dim}
            height={dim}
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              width: '100%',
              height: '100%',
              filter: isThinking ? 'brightness(0.8)' : 'brightness(1)',
              transition: 'filter 0.4s ease',
            }}
            priority
          />
        </div>

        {/* Thinking overlay */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'rgba(34, 211, 238, 0.08)',
                backdropFilter: 'blur(1px)',
                zIndex: 2,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Typing dots below avatar */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            className="absolute flex gap-[5px]"
            style={{ bottom: size === 'lg' ? -14 : -10, left: '50%', transform: 'translateX(-50%)' }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
