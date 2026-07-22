'use client'
import { useEffect, useState } from 'react'

let _show: ((msg: string, isErr?: boolean) => void) | null = null

export function showToast(msg: string, isErr = false) {
  _show?.(msg, isErr)
}

export default function Toast() {
  const [state, setState] = useState({ msg: '', isErr: false, vis: false })

  useEffect(() => {
    _show = (msg, isErr = false) => {
      setState({ msg, isErr, vis: true })
      setTimeout(() => setState(s => ({ ...s, vis: false })), 2800)
    }
    return () => { _show = null }
  }, [])

  return (
    <div
      className="toast"
      style={{
        background: state.isErr ? 'var(--red)' : 'var(--green2)',
        opacity: state.vis ? 1 : 0,
        transform: state.vis
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(30px)',
      }}
    >
      {state.msg}
    </div>
  )
}
