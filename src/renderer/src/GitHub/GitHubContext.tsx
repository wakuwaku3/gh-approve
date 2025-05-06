import { createContext, use } from 'react'
import { defaultGitHub, type GitHub } from '.'

export const GitHubContext = createContext<GitHub>(defaultGitHub)

export const useGitHub = (): GitHub => {
  return use(GitHubContext)
}
