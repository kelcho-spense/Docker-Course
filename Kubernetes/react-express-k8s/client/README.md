To create the React app with the specified structure, components, and content, follow these steps:

### 1. Set Up the React Project with Vite

If you haven't already set up the Vite project, follow the steps below:

1. **Create a Vite React project:**
   ```bash
   npm create vite@latest my-react-app -- --template react
   cd my-react-app
   npm install
   ```

2. **Install necessary dependencies:**
   You'll need to install `react-router-dom` and `axios` for routing and HTTP requests.
   ```bash
   npm install react-router-dom axios
   ```

### 2. Create the Project Structure

Your project should be structured as follows:

```
my-react-app/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── Components/
│   │   ├── MainComponent.jsx
│   │   ├── MainComponent.css
│   │   ├── OtherPage.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── vite-env.d.ts
├── .dockerignore
├── .gitignore
├── Dockerfile
├── Dockerfile.dev
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── README.md
└── vite.config.js
```

### 3. Add the Required Code

#### `src/App.jsx`
```jsx
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MainComponent from './Components/MainComponent';
import OtherPage from './Components/OtherPage';

function App() {
  return (
    <Router>
      <>
        <header className="header">
          <div>This is a multicontainer application</div>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other page</Link>
        </header>
        <div className="main">
          <Route exact path="/" component={MainComponent} />
          <Route path="/otherpage" component={OtherPage} />
        </div>
      </>
    </Router>
  );
}

export default App;
```

#### `src/App.css`
```css
.header {
  background: #eee;
}

.header a {
  margin-left: 20px;
}

.main {
  padding: 10px;
  background: #ccc;
}
```

#### `src/index.css`
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

#### `src/main.jsx`
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

#### `src/Components/MainComponent.jsx`
```jsx
import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import "./MainComponent.css";

function MainComponent() {
  const [values, setValues] = useState([]);
  const [value, setValue] = useState("");

  const getAllNumbers = useCallback(async () => {
    const data = await axios.get("/api/values/all");
    setValues(data.data.rows.map(row => row.number));
  }, []);

  const saveNumber = useCallback(
    async (event) => {
      event.preventDefault();
      await axios.post("/api/values", { value });

      setValue("");
      getAllNumbers();
    },
    [value, getAllNumbers]
  );

  useEffect(() => {
    getAllNumbers();
  }, []);

  return (
    <div>
      <button onClick={getAllNumbers}>Get all numbers</button>
      <br />
      <span className="title">Values</span>
      <div className="values">
        {values.map((value, index) => (
          <div className="value" key={index}>{value}</div>
        ))}
      </div>
      <form className="form" onSubmit={saveNumber}>
        <label>Enter your value: </label>
        <input
          value={value}
          onChange={event => {
            setValue(event.target.value);
          }}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default MainComponent;
```

#### `src/Components/MainComponent.css`
```css
.title {
  font-weight: bold;
}

.values {
  margin-top: 20px;
  background: yellow;
}

.value {
  margin-top: 10px;
  border-top: 1px dashed black;
}

.form {
  margin-top: 20px;
}
```

#### `src/Components/OtherPage.jsx`
```jsx
import { Link } from "react-router-dom";

function OtherPage() {
  return (
    <div>
      I'm another page!
      <br />
      <br />
      <Link to="/">Go back to home screen</Link>
    </div>
  );
}

export default OtherPage;
```

### 4. Configuration Files

#### `.dockerignore`
```plaintext
node_modules
build
.git
.gitignore
Dockerfile
Dockerfile.dev
.dockerignore
*.log
.DS_Store
.git
```

#### `.gitignore`
```plaintext
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```
### 5. Add the docker files                                               
- #### `Docker.dev`                                                       
```docker                                                                 
# Use an official Node.js runtime as a parent image                       
FROM node:20.16.0-alpine                                                  
# Set the working directory in the container                              
WORKDIR /app                                                              
# Install dependencies                                                    
COPY package.json pnpm-lock.yaml ./                                       
# Copy the rest of the application code                                   
COPY . .                                                                  
# Expose port 5173 (default Vite port)                                    
EXPOSE 5173                                                               
# Command to run the development server                                   
CMD ["npm", "run", "dev"]                                                 
```                                                                       