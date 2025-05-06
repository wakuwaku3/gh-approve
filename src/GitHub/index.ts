export interface GitHub {
  token: string;
  targetRepositoryOwner: string;
  targetRepositoryName: string;
}

export const defaultGitHub: GitHub = {
  token: GH_TOKEN,
  targetRepositoryOwner: GH_TARGET_REPOSITORY_OWNER,
  targetRepositoryName: GH_TARGET_REPOSITORY_NAME,
};
