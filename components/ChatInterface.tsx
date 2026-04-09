'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage, type TextUIPart } from 'ai'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { ArrowUp, Sun, Moon } from '@phosphor-icons/react'
import Avatar from './Avatar'
import MouseEffects from './MouseEffects'

type AvatarState = 'idle' | 'thinking' | 'happy'

const CHIPS = [
  'Show me your best projects',
  'What tools do you use?',
  'How can we collaborate?',
  'Tell me a fun fact about Emil',
]

function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is TextUIPart => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

// Stable transport — created once, never recreated
const transport = new DefaultChatTransport({ api: '/api/chat' })

export default function ChatInterface() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [hasStarted, setHasStarted] = useState(false)
  const [avatarState, setAvatarState] = useState<AvatarState>('idle')
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport,
    onFinish: () => {
      setAvatarState('happy')
      setTimeout(() => setAvatarState('idle'), 2200)
    },
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (isLoading) setAvatarState('thinking')
  }, [isLoading])

  useEffect(() => {
    if (messages.length > 0) setHasStarted(true)
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }, [input])

  const submit = useCallback(() => {
    const text = input.trim()
    if (!text || isLoading) return
    setHasStarted(true)
    setInput('')
    setTimeout(() => {
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }, 0)
    sendMessage({ text })
  }, [input, isLoading, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleChip = (chip: string) => {
    setHasStarted(true)
    sendMessage({ text: chip })
  }

  const showTyping = isLoading && messages[messages.length - 1]?.role !== 'assistant'

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        color: 'var(--text)',
        position: 'relative',
      }}
    >
      <MouseEffects />

      {/* ── Header ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderBottom: hasStarted ? '1px solid var(--border)' : 'none',
          background: hasStarted ? 'var(--bg)' : 'transparent',
          backdropFilter: hasStarted ? 'blur(12px)' : 'none',
        }}
      >
        <AnimatePresence>
          {hasStarted && (
            <motion.div
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            >
              <Avatar state={avatarState} size="sm" />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
                  Emil Amosin
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                  Systems Support Specialist · ShiftMarkets
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!hasStarted && <div />}

        <motion.button
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid var(--border-strong)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
        </motion.button>
      </header>

      {/* ── Scrollable middle ── */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <div style={{ maxWidth: 672, margin: '0 auto', padding: '0 16px' }}>

          {/* Hero — shown only before chat starts */}
          {!hasStarted && (
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: 'calc(100dvh - 120px)',
                padding: '64px 0',
              }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                style={{ marginBottom: 28 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.1 }}
              >
                <Avatar state={avatarState} size="lg" />
              </motion.div>

              <motion.h1
                style={{
                  fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: 'var(--text)',
                  marginBottom: 10,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 22 }}
              >
                Hey, I&apos;m Emil Amosin{' '}
                <span role="img" aria-label="wave">👋</span>
              </motion.h1>

              <motion.p
                style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 40 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, type: 'spring', stiffness: 180, damping: 22 }}
              >
                Systems Support Specialist &amp; Internal Tools Developer at ShiftMarkets
              </motion.p>

              <motion.div
                style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } } }}
              >
                {CHIPS.map((chip) => (
                  <motion.button
                    key={chip}
                    onClick={() => handleChip(chip)}
                    className="chip-hover"
                    style={{
                      fontSize: 14,
                      padding: '8px 16px',
                      borderRadius: 9999,
                      border: '1px solid var(--border-strong)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  >
                    {chip}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Messages — shown once chat starts */}
          {hasStarted && (
            <motion.div
              style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '24px 0' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {messages.map((m) => {
                const text = getMessageText(m)
                if (!text && m.role === 'assistant') {
                  // Still streaming with no text yet — skip rendering
                  return null
                }
                return (
                  <motion.div
                    key={m.id}
                    style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                  >
                    {m.role === 'user' ? (
                      <div
                        style={{
                          maxWidth: '80%',
                          fontSize: 15,
                          padding: '10px 16px',
                          borderRadius: 18,
                          background: 'var(--bubble-user)',
                          border: '1px solid var(--border)',
                          color: 'var(--text)',
                          lineHeight: 1.6,
                        }}
                      >
                        {text || getMessageText(m)}
                      </div>
                    ) : (
                      <div
                        style={{
                          maxWidth: '90%',
                          padding: '12px 16px',
                          borderRadius: 18,
                          background: 'var(--bubble-ai)',
                          border: '1px solid var(--border)',
                          boxShadow: '0 0 20px var(--accent-glow)',
                        }}
                      >
                        <ReactMarkdown className="prose-chat">{text}</ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                )
              })}

              <AnimatePresence>
                {showTyping && (
                  <motion.div
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '12px 16px',
                        borderRadius: 18,
                        background: 'var(--bubble-ai)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Input bar ── */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 20,
          padding: '12px 16px 16px',
          background: 'var(--bg)',
          borderTop: hasStarted ? '1px solid var(--border)' : 'none',
        }}
      >
        <div
          className="input-glow"
          style={{
            maxWidth: 672,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            borderRadius: 18,
            padding: '10px 12px 10px 16px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-strong)',
            transition: 'box-shadow 0.2s ease',
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about my projects"
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: 'var(--text)',
              fontSize: 15,
              lineHeight: '1.6',
              maxHeight: 160,
              overflowY: 'auto',
              fontFamily: 'inherit',
            }}
          />
          <motion.button
            onClick={submit}
            disabled={!input.trim() || isLoading}
            className="send-btn"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-strong)',
              color: input.trim() && !isLoading ? 'var(--accent)' : 'var(--text-subtle)',
              cursor: input.trim() && !isLoading ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            whileTap={input.trim() && !isLoading ? { scale: 0.92 } : {}}
          >
            <ArrowUp size={15} weight="bold" />
          </motion.button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, marginTop: 6, color: 'var(--text-subtle)' }}>
          AI can make mistakes. Verify important details with Emil directly.
        </p>
      </div>
    </div>
  )
}
