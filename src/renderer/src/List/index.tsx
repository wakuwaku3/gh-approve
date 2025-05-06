import { usePullRequests } from '../GitHub/usePullRequests'

import React, { useMemo, useState } from 'react'
import { useGitHub } from '../GitHub/GitHubContext'
import './index.css'
import { Label } from './Label'
import { Title } from './Title'

const CreatedAt: React.FC<{ date: string }> = ({ date }) => {
  const formatted = new Date(date).toLocaleString()
  return <span className="created-at">{formatted}</span>
}

export const List: React.FC = () => {
  const { targetRepositoryOwner, targetRepositoryName } = useGitHub()
  const { loading, error, pullRequests, approvePullRequests } = usePullRequests()
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])

  const [searchQuery, setSearchQuery] = useState('')

  const filteredPRs = useMemo(() => {
    return pullRequests.filter((pr) => {
      const q = searchQuery.toLowerCase()
      const titleMatch = pr.title.toLowerCase().includes(q)

      const labelMatch = pr.labels.some((label) => label.name.toLowerCase().includes(q))

      return titleMatch || labelMatch
    })
  }, [pullRequests, searchQuery])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error.message}</div>

  const toggleAll = (): void => {
    if (selectedNumbers.length === filteredPRs.length) {
      setSelectedNumbers([])
    } else {
      setSelectedNumbers(filteredPRs.map((pr) => pr.number))
    }
  }

  const toggleOne = (id: number): void => {
    setSelectedNumbers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="pull-request-list">
      <div className="repository-name">
        <h2>
          {targetRepositoryOwner}/{targetRepositoryName}
        </h2>
      </div>
      <div className="filters">
        <input
          type="text"
          placeholder="タイトルまたはラベルで検索"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          className="filter-input"
        />
      </div>
      <div className="actions">
        <button
          type="button"
          onClick={() => {
            const handleApprove = async (): Promise<void> => {
              if (selectedNumbers.length === 0) return
              const confirmed = window.confirm(
                `${selectedNumbers.length.toString()}件のPRを承認しますか？`
              )
              if (!confirmed) return

              try {
                await approvePullRequests(selectedNumbers)
                alert('承認が完了しました。')
                setSelectedNumbers([])
              } catch (err) {
                alert('承認中にエラーが発生しました。')
                console.error(err)
              }
            }
            void handleApprove()
          }}
          className="approve-button"
          disabled={selectedNumbers.length === 0}
        >
          Approve PR
        </button>{' '}
      </div>

      <div className="pull-request-header">
        <input
          type="checkbox"
          checked={selectedNumbers.length === filteredPRs.length}
          onChange={toggleAll}
          className="header-checkbox"
        />
        <div className="header-title">タイトル</div>
        <div className="header-date">作成日時</div>
        <div className="header-labels">ラベル</div>
      </div>

      {filteredPRs.map((pr) => (
        <div key={pr.number} className="pull-request-item">
          <input
            type="checkbox"
            checked={selectedNumbers.includes(pr.number)}
            onChange={() => {
              toggleOne(pr.number)
            }}
            className="row-checkbox"
          />
          <div className="pr-title">
            <Title {...pr} />
          </div>
          <div className="pr-date">
            <CreatedAt date={pr.created_at} />
          </div>
          <div className="pr-labels">
            {pr.labels.map((label) => (
              <Label key={label.id} {...label} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
