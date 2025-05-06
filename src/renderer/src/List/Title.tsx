import React from 'react'
import './Title.css'
import { Tooltip } from '../Tooltip'

export const Title: React.FC<{
  html_url: string
  title: string
  body: string | null
}> = ({ html_url, title, body }) => (
  <a href={html_url} target="_blank" rel="noopener noreferrer" className="title-link">
    {body ? (
      <Tooltip message={body}>
        <span className="title-title">{title}</span>
      </Tooltip>
    ) : (
      <span className="title-title">{title}</span>
    )}
  </a>
)
