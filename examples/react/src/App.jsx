import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { html, toc, ReactComponent } from './content.md'
import LinkToRepository from './LinkToRepository'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button onClick={() => setCount(count => count + 1)}>count is: {count}</button>
        </p>
        <p>
          Edit <code>App.jsx</code> and save to test HMR updates.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <main>
        <h2>HTML</h2>
        {html}
        <h2>ToC</h2>
        {toc.map((h,i) => <li key={i}>{h.level} - {h.content}</li>)}
        <h2>ReactComponent</h2>
        <ReactComponent LinkToRepository={LinkToRepository} />
      </main>
    </div>
  )
}

export default App
