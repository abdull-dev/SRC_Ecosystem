import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { InformationCircleIcon } from '../icons'

export default function Tooltip({ content }: { content: string }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)

  const show = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.top, left: r.left + r.width / 2 })
    }
    setVisible(true)
  }

  const hide = () => setVisible(false)

  useEffect(() => {
    if (!visible) return
    window.addEventListener('scroll', hide, true)
    return () => window.removeEventListener('scroll', hide, true)
  }, [visible])

  return (
    <span className="inline-flex items-center ml-1.5 align-middle">
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="text-ink-faint hover:text-brand transition-colors focus:outline-none"
        aria-label="More information"
      >
        <InformationCircleIcon className="w-3.5 h-3.5" />
      </button>

      {visible && createPortal(
        <div
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform: 'translate(-50%, calc(-100% - 8px))',
            zIndex: 9999,
          }}
          className="w-56 bg-ink text-canvas text-xs rounded-lg px-3 py-2.5 leading-relaxed shadow-xl pointer-events-none"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-ink" />
        </div>,
        document.body
      )}
    </span>
  )
}
