import "./App.css";
import { List } from "./List";
import { GitHubProvider } from "./GitHub/GitHubProvider";

function App() {
  return (
    <GitHubProvider>
      <List />
    </GitHubProvider>
  );
}

export default App;
