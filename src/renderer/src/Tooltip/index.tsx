import React from 'react'
import './index.css'

interface TooltipProps {
  children: React.ReactNode
  message: string
}

export const Tooltip: React.FC<TooltipProps> = ({ children, message }) => {
  return (
    <div className="tooltip-container">
      {children}
      <span className="tooltip-text">{message}</span>
    </div>
  )
}
