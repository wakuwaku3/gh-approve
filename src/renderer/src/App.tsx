import Versions from './components/Versions'
import { GitHubProvider } from './GitHub/GitHubProvider'
import { List } from './List'

function App(): React.JSX.Element {
  return (
    <>
      <GitHubProvider>
        <List />
      </GitHubProvider>
      <Versions></Versions>
    </>
  )
}

export default App
