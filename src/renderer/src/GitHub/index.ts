export interface GitHub {
  token: string
  targetRepositoryOwner: string
  targetRepositoryName: string
}

export const defaultGitHub: GitHub = {
  token: import.meta.env.RENDERER_VITE_GH_APPROVE_GITHUB_TOKEN,
  targetRepositoryOwner: import.meta.env.RENDERER_VITE_GH_APPROVE_GITHUB_TARGET_REPOSITORY_OWNER,
  targetRepositoryName: import.meta.env.RENDERER_VITE_GH_APPROVE_GITHUB_TARGET_REPOSITORY_NAME
}
