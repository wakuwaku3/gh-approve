import { useEffect, useState, useCallback } from 'react'
import { useGitHub } from './GitHubContext' // Assuming this context provides token, owner, name

interface PullRequest {
  number: number
  html_url: string
  title: string
  body: string | null
  created_at: string // ISO 8601 format string
  labels: Label[]
}

interface Label {
  id: number
  url: string
  name: string
  description: string | null
  color: string
}

interface UsePullRequestsResult {
  pullRequests: PullRequest[]
  loading: boolean
  error: Error | null
  refetch: () => void
  approvePullRequests: (numbers: number[]) => Promise<void>
}

// Helper function to parse the Link header
const parseLinkHeader = (linkHeader: string | null): Record<string, string> => {
  if (!linkHeader) {
    return {}
  }

  const links: Record<string, string> = {}
  const parts = linkHeader.split(',')

  parts.forEach((part) => {
    const section = part.split(';')
    if (section.length !== 2) {
      return // Malformed header part
    }

    const urlMatch = /<(.+)>/.exec(section[0].trim())
    const relMatch = /rel="(.+)"/.exec(section[1].trim())

    if (urlMatch && relMatch) {
      links[relMatch[1]] = urlMatch[1]
    }
  })

  return links
}

export const usePullRequests = (): UsePullRequestsResult => {
  const { token, targetRepositoryOwner, targetRepositoryName } = useGitHub()
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [fetchTrigger, setFetchTrigger] = useState(0)

  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!token || !targetRepositoryOwner || !targetRepositoryName) {
      setError(new Error('GitHub configuration (token, owner, repo) is missing in context.'))
      setPullRequests([])
      setLoading(false)
      return
    }

    const abortController = new AbortController()
    const { signal } = abortController

    const fetchAllPullRequests = async (): Promise<void> => {
      setLoading(true)
      setError(null)
      setPullRequests([]) // Clear previous results before fetching
      let allData: PullRequest[] = []
      // Define initial URL with parameters like per_page and state if needed
      // Example: Fetching all states, 100 per page for efficiency
      let nextUrl: string | null =
        `https://api.github.com/repos/${targetRepositoryOwner}/${targetRepositoryName}/pulls?state=open&per_page=100&direction=desc`

      const headers: HeadersInit = {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }

      try {
        while (nextUrl && !signal.aborted) {
          const response = await fetch(nextUrl, {
            method: 'GET',
            headers: headers,
            signal: signal
          })

          if (!response.ok) {
            // Handle API error response as in the original code
            let errorMessage = `GitHub API request failed: ${response.status.toString()} ${
              response.statusText
            }`
            try {
              const errorBody = (await response.json()) as Record<string, unknown>
              if (
                typeof errorBody === 'object' &&
                'message' in errorBody &&
                typeof errorBody.message === 'string'
              ) {
                errorMessage += ` - ${errorBody.message}`
              } else {
                errorMessage += ' - No additional message provided.'
              }
            } catch {
              errorMessage += ' (Could not parse error response body)'
            }
            throw new Error(errorMessage)
          }

          const data = (await response.json()) as PullRequest[]
          allData = [...allData, ...data]

          // Parse Link header to find the next page URL
          const linkHeader = response.headers.get('Link')
          const links = parseLinkHeader(linkHeader)
          nextUrl = links.next || null // Get URL for the next page, or null if it's the last page
        }

        if (!signal.aborted) {
          console.log('Fetched pull requests:', allData)
          setPullRequests(allData)
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted')
          // If aborted, we might not want to clear data or set error,
          // depending on desired behavior on re-triggering fetch.
          // Setting loading to false is generally correct here.
        } else {
          console.error('Failed to fetch pull requests:', err)
          const fetchError = err instanceof Error ? err : new Error(String(err))
          setError(fetchError)
          setPullRequests([]) // Clear data on error
        }
      } finally {
        // Ensure loading is set to false only when the process is fully complete or aborted/errored.
        // Do not set loading to false inside the loop.
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }

    void fetchAllPullRequests()

    return () => {
      abortController.abort()
      setLoading(false) // Also ensure loading is false if component unmounts during fetch
    }
  }, [token, targetRepositoryOwner, targetRepositoryName, fetchTrigger]) // Removed pullRequests from dependencies

  const approvePullRequests = useCallback(
    async (numbers: number[]) => {
      if (!token || !targetRepositoryOwner || !targetRepositoryName) return

      setLoading(true)
      setError(null)

      try {
        for (const prNumber of numbers) {
          const prIDStr = prNumber.toString()
          const response = await fetch(
            `https://api.github.com/repos/${targetRepositoryOwner}/${targetRepositoryName}/pulls/${prIDStr}/reviews`, // Use prIDStr here
            {
              method: 'POST',
              headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28'
              },
              body: JSON.stringify({
                event: 'APPROVE'
              })
            }
          )

          if (!response.ok) {
            const errBody = (await response.json()) as Record<string, unknown>
            throw new Error(
              `Failed to approve PR #${prIDStr}: ${String(errBody.message) || response.statusText}`
            )
          }
        }
        refetch()
      } catch (err: unknown) {
        console.error('Failed to approve PRs:', err)
        const approveError = err instanceof Error ? err : new Error(String(err))
        setError(approveError)
      } finally {
        setLoading(false)
      }
    },
    [token, targetRepositoryOwner, targetRepositoryName, refetch]
  )
  return { pullRequests, loading, error, refetch, approvePullRequests }
}
