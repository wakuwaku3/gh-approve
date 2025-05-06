import { JSX, type ReactNode } from 'react'
import { GitHubContext } from './GitHubContext'
import { defaultGitHub } from '.'

// Provider コンポーネント
export const GitHubProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return <GitHubContext value={defaultGitHub}>{children}</GitHubContext>
}
