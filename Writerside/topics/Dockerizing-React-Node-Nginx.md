This guide provides a step-by-step approach to Dockerizing a React application using Vite, with Node.js, Postgres, and Nginx, for both development and production environments.

---

# Dockerizing React, Node.js, Postgres & Nginx <Dev & Prod>

## Development Mode

![dev.png](dev.png)

In your development environment, the architecture works as follows:

1. **Nginx** acts as a reverse proxy, routing incoming HTTP requests to either the **React server** or the **Express server** based on the request path.
2. **React Server** handles all requests for the frontend (i.e., your React application). When you develop, changes here are served by the React development server, often with hot-reloading.
3. **Express Server** processes backend API requests. These requests might involve querying or updating data in the **Postgres** database.
4. **Nginx** forwards requests:
    - Requests to the base URL (e.g., `http://localhost/`) are sent to the React server.
    - Requests to paths starting with `/api` are forwarded to the Express server, which may interact with the Postgres database.

This setup allows you to work on both the frontend and backend in a unified environment, ensuring that you can test how they interact together while still enjoying the benefits of a development-focused workflow like hot-reloading and quick feedback.
 ## React Folder & File structure
### 1. Client: React + Vite

![react-structure.png](react-structure.png)

- **Create a Vite React project:**
   ```bash
   npm create vite@latest my-react-app -- --template react
   cd my-react-app
   npm install
   ```
- **Install necessary dependencies:**
     You'll need to install `react-router-dom` and `axios` for routing and HTTP requests.
     ```bash
     npm install react-router-dom@4.3.1 axios
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
├── Dockerfile.dev
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── README.md
└── vite.config.js
```
### 3. Add the Required Code
- #### `src/App.jsx`
```javascript
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
- #### `src/App.css`
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

- #### `src/index.css`
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

- #### `src/main.jsx`
```javascript
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

- #### `src/Components/MainComponent.jsx`
```javascript
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

- #### `src/Components/MainComponent.css`
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

- #### `src/Components/OtherPage.jsx`
```javascript
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

- #### `.dockerignore`
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

- #### `.gitignore`
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
### 4. Adjust the vite.config.js config  
- #### `vite.config.js`  
```Javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  }
})
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
## Build the Docker Image
Navigate to the root directory of your project where the Dockerfile.dev is located. Run the following command to build the Docker image for development:
```Bash
docker build -t my-react-app-dev -f Dockerfile.dev .
```
This command tells Docker to:

-t client: Tag the image as my-react-app-dev.
-f Dockerfile.dev: Use the Dockerfile.dev file for building the image.
## Run the Docker Container
After building the image, you can run the container with the following command:
```Bash
docker run -it --rm -p 5173:5173 client
```
Explanation:
- **-it**: Runs the container interactively.
- **--rm**: Automatically removes the container when it exits.
-p `5173:5173`: Maps port 5173 on your local machine to port 5173 in the container, which is where the Vite development server will be running.

## Node Express Folder & File Structure
Here's a guide to create an Express.js application, dockerizing it for development, and managing environment variables securely using a `keys.js` file.

![serverfolderstructure.png](serverfolderstructure.png)

### Step 1: Set Up the Project Directory

```Bash
server/
├── node_modules/ 
├── .dockerignore 
├── Dockerfile.dev 
├── index.js
├── keys.js 
├── package.json
├── pnpm-lock.yaml
└── .gitignore
```

Create a new directory for your project:

```bash
mkdir express-postgres-app
cd express-postgres-app
```

### Step 2: Initialize the Node.js Project

Run the following command to initialize a new Node.js project:

```bash
npm init -y
```

This will create a `package.json` file with default settings.

### Step 3: Install Dependencies

Install the required dependencies: Express, PostgreSQL client (pg), CORS, and body-parser:

```bash
npm install express pg cors body-parser
```

### Step 4: Create the Application Files

#### 1. **Create `index.js`**

In the root of your project directory, create a file named `index.js` and add the following code:

```javascript
const keys = require("./keys");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on("connect", client => {
  client.query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch(err => console.log("PG ERROR", err));
});

// Express route definitions
app.get("/", (req, res) => {
  res.send("Hi");
});

// Get all values
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");
  res.send(values.rows);
});

// Insert a new value
app.post("/values", async (req, res) => {
  if (!req.body.value) return res.send({ working: false });

  await pgClient.query("INSERT INTO values(number) VALUES($1)", [req.body.value]);

  res.send({ working: true });
});

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
```

#### 2. **Create `keys.js`**

Create a file named `keys.js` in the root directory with the following content:

```javascript
module.exports = {
  pgUser: process.env.PGUSER,
  pgHost: process.env.PGHOST,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT
};
```

This file securely references environment variables for your PostgreSQL connection.

### Step 5: Create Docker Configuration

#### 1. **Create `Dockerfile.dev`**

Create a file named `Dockerfile.dev` in the root directory with the following content:

```dockerfile
# Use Alpine Node.js runtime as a parent image
FROM node:20.16.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (or package-lock.json)
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8000
EXPOSE 8000

# Command to run the application
CMD ["npm", "run", "dev"]
```

#### 2. **Create `.dockerignore`**

Create a `.dockerignore` file to ensure unnecessary files aren't copied into the Docker image:

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

### Step 6: Define the NPM Scripts

Open your `package.json` and add a script for running the development server:

```json
{
  "scripts": {
    "start": "node index.js",  
    "dev": "nodemon index.js"   
  }     
}
```

Ensure you have nodemon installed globally or as a dev dependency:

```bash
npm install -g nodemon
```

Or:

```bash
npm install --save-dev nodemon
```

### Step 7: Running the Application with Docker

#### 1. **Build the Docker Image**

Run the following command to build the Docker image using the development Dockerfile:

```bash
docker build -t server -f Dockerfile.dev .
```

#### 2. **Run the Docker Container**

Run the Docker container:

```bash
docker run -it --rm -p 8000:8000 server
```

Explanation:
- `-p 8000:8000`: Maps port 8000 on your machine to port 8000 in the container.

### Step 8: Test the Application

Open your browser or use a tool like Postman to test the endpoints:
- **GET** request to `http://localhost:8000/` should return "Hi".

## NGINX & File structure   
Nginx as a reverse proxy to route traffic between a React frontend (client) and an Express backend (API), using Docker. The configuration involves two files: default.conf (Nginx configuration) and Dockerfile.dev (Docker configuration for Nginx).
- Step 1: The structure looks like this:
```Bash
nginx/
├── default.conf          # Nginx configuration file
└── Dockerfile.dev        # Dockerfile for building the Nginx image 
```
- Step 2: Configure default.conf for Nginx
The default.conf file is an Nginx configuration file that routes traffic based on the request paths. Here’s what the configuration does:
```Javascript
upstream client {
    server client:5173;
}

upstream api {
    server api:8000;
}

server {
    listen 80;

    location / {
        proxy_pass http://client;
    }

    location /sockjs-node {
        proxy_pass http://client;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }

    location /api {
        rewrite /api/(.*) /$1 break;
        proxy_pass http://api;
    }
}
```
Explanation:

- Upstream Sections:
    * upstream client: Defines a group of servers for the React frontend running on port 5173.
    * upstream api: Defines a group of servers for the Express backend running on port 8000.
- Server Block:
  * listen 80: Configures Nginx to listen on port 80 (standard HTTP port).
  * location /: Routes root URL requests to the React client.
  * location /sockjs-node: Special handling for WebSocket connections, typically used for hot-reloading in development.
  * location /api: Routes /api requests to the Express backend, rewriting the URL to strip the /api prefix.

- Step 3: Create the Dockerfile.dev for Nginx
The Dockerfile.dev will build a Docker image for Nginx that uses your custom configuration. The Dockerfile content is:
```Docker
FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
```


### Step-by-Step Guide for Configuring Nginx with Docker

This guide walks you through setting up Nginx as a reverse proxy to route traffic between a React frontend (client) and an Express backend (API), using Docker. The configuration involves two files: `default.conf` (Nginx configuration) and `Dockerfile.dev` (Docker configuration for Nginx).

#### Step 1: Understand the Project Structure

From the provided image, the structure looks like this:

```
nginx/
├── default.conf          # Nginx configuration file
└── Dockerfile.dev        # Dockerfile for building the Nginx image
```

#### Step 2: Configure `default.conf` for Nginx

The `default.conf` file is an Nginx configuration file that routes traffic based on the request paths. Here’s what the configuration does:

```nginx
upstream client {
    server client:5173;
}

upstream api {
    server api:8000;
}

server {
    listen 80;

    location / {
        proxy_pass http://client;
    }

    location /sockjs-node {
        proxy_pass http://client;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }

    location /api {
        rewrite /api/(.*) /$1 break;
        proxy_pass http://api;
    }
}
```
**Explanation:**
- **Upstream Sections**:
  - `upstream client`: Defines a group of servers for the React frontend running on port 5173.
  - `upstream api`: Defines a group of servers for the Express backend running on port 8000.

- **Server Block**:
  - **listen 80**: Configures Nginx to listen on port 80 (standard HTTP port).
  - **location /**: Routes root URL requests to the React client.
  - **location /sockjs-node**: Special handling for WebSocket connections, typically used for hot-reloading in development.
  - **location /api**: Routes `/api` requests to the Express backend, rewriting the URL to strip the `/api` prefix.

#### Step 3: Create the `Dockerfile.dev` for Nginx

The `Dockerfile.dev` will build a Docker image for Nginx that uses your custom configuration. The Dockerfile content is:

```dockerfile
FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
```

**Explanation:**
- **FROM nginx**: This uses the official Nginx image as the base image.
- **COPY ./default.conf /etc/nginx/conf.d/default.conf**: Copies your custom Nginx configuration file (`default.conf`) into the appropriate directory inside the Nginx container (`/etc/nginx/conf.d/default.conf`), replacing the default configuration.

## Combined Project Structure with Docker Compose

Here's how to combine your `client`, `server`, and `nginx` components into a single project structure with a `docker-compose.yml` file that orchestrates the services. This structure is typical for a full-stack application setup using Docker Compose.

### Project Structure

```
my-app/
├── client/                   # React frontend
│   ├── Dockerfile.dev        # Dockerfile for the React app (development)
│   ├── src/                  # Source code for React
│   ├── public/               # Public assets for React
│   ├── package.json          # Package configuration for React
│   └── ...                   # Other React files and folders
├── server/                   # Express backend
│   ├── Dockerfile.dev        # Dockerfile for the Express app (development)
│   ├── index.js              # Main entry point for the Express server
│   ├── keys.js               # Environment configuration file
│   ├── package.json          # Package configuration for Express
│   └── ...                   # Other server files and folders
├── nginx/                    # Nginx reverse proxy
│   ├── default.conf          # Nginx configuration file
│   └── Dockerfile.dev        # Dockerfile for Nginx (development)
└── docker-compose.yml        # Docker Compose configuration file
```

### `docker-compose.yml`

Below is the `docker-compose.yml` file that defines all the services:

```yaml
version: "3.8"
services:
  postgres:
    image: "postgres:latest"
    environment:
      - POSTGRES_PASSWORD=postgres_password
    ports:
      - "5432:5432"
    restart: always

  nginx:
    container_name: nginx
    build:
      context: ./nginx
      dockerfile: Dockerfile.dev  # Change to `Dockerfile` for production
    ports:
      - "3500:80"
    depends_on:
      - api
      - client
    restart: always    

  api:
    build:
      context: "./server"
      dockerfile: Dockerfile.dev # Change to `Dockerfile` for production
    volumes:
      - /app/node_modules
      - ./server:/app
    environment:
      - PGUSER=postgres
      - PGHOST=postgres
      - PGDATABASE=postgres
      - PGPASSWORD=postgres_password
      - PGPORT=5432
    depends_on:
      - postgres
    ports:
      - "8000:8000"
    restart: always

  client:
    stdin_open: true
    build:
      context: ./client
      dockerfile: Dockerfile.dev # Change to `Dockerfile` for production
    volumes:
      - /app/node_modules
      - ./client:/app
    ports:
      - "5173:5173"
    depends_on:
      - api
    restart: always
```

### Explanation of the `docker-compose.yml` Services

1. **Postgres**:
   - This service runs the PostgreSQL database.
   - `environment`: Sets the environment variable `POSTGRES_PASSWORD` to `postgres_password` for the database.
   - `ports`: Exposes port `5432` for database connections.
   - `restart: always`: Ensures the container restarts automatically in case of a failure.

2. **Nginx**:
   - Acts as a reverse proxy, routing requests to the `client` (React frontend) and `api` (Express backend) services.
   - `build`: Builds the Nginx image from the `Dockerfile.dev` located in the `nginx` directory.
   - `ports`: Exposes port `3500` on the host, mapping it to port `80` inside the container (where Nginx listens).
   - `depends_on`: Ensures that the `api` and `client` services are started before Nginx.

3. **API (Express)**:
   - Runs the Express server.
   - `build`: Builds the Express image from the `Dockerfile.dev` located in the `server` directory.
   - `volumes`: Mounts the `server` directory and `node_modules` for hot-reloading in development.
   - `environment`: Passes PostgreSQL connection environment variables to the Express server.
   - `depends_on`: Ensures that the PostgreSQL service is up and running before the API service starts.
   - `ports`: Exposes port `8000` for the Express API.

4. **Client (React)**:
   - Runs the React frontend.
   - `build`: Builds the React image from the `Dockerfile.dev` located in the `client` directory.
   - `volumes`: Mounts the `client` directory and `node_modules` for hot-reloading in development.
   - `ports`: Exposes port `5173` for the React development server.
   - `depends_on`: Ensures the API service is running before the Client starts.

### Step-by-Step Setup and Execution

1. **Build and Start Services**:
   - Navigate to the root directory (`my-app/`) and run the following command to build and start all services:
     ```bash
     docker-compose up --build
     ```
   - The `--build` flag ensures that Docker builds the images before starting the containers.

4. **Access the Application**:
   - Visit `http://localhost:3500` in your browser to access the frontend, which is proxied through Nginx.
   - The React frontend interacts with the Express backend via the `/api` route, as defined in the Nginx configuration.

![devwebpreview.png](devwebpreview.png)

# Production Mode
We are going to use all files in the development mode but make a couple of changes.ie our docker files will be `Docker` instead of `Docker.dev`

![prod.png](prod.png)

### 1. `./client/nginx/default.conf`
- Create Nginx folder in client folder and add `default.conf` with this code
```Javascript
server {
    listen 5173;

    location / {
        root /usr/share/nginx/html;
        index index.html index.html;
        try_files $uri/ $uri/ /index.html
    }
}
```
### 2. `./client/Docker`
- inside the client folder, add a `Docker` file
```Docker
  #use alpine Node.js runtime as a parent image and name it as builder
FROM node:20.16.0-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

RUN npm run build

FROM nginx

# Expose port 5173
EXPOSE 5173
# copy nginx configuration to the docker image
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# copy all builded files
COPY --from=builder /app/build /usr/share/nginx/html
```
Summary in bullet points:

- **Base Image (Builder Stage)**:
  - Uses `node:20.16.0-alpine` as the base image, named as `builder`.
  - Sets the working directory to `/app` inside the container.

- **Dependency Installation**:
  - Copies `package.json` and `package-lock.json` into the container.
  - Installs Node.js dependencies using `npm i`.

- **Application Code**:
  - Copies the entire application code into the container.
  - Runs the build process with `npm run build`.

- **Final Image (Nginx Stage)**:
  - Uses `nginx` as the final base image.
  - Exposes port `5173` for the frontend.
  - Copies the Nginx configuration file (`default.conf`) to the appropriate location in the Nginx container.
  - Copies the built files from the `builder` stage to the Nginx web root directory (`/usr/share/nginx/html`).

### 3. `./nginx` 
- inside the nginx folder create this file `default.conf` add this code
```Javascript
upstream client {
    server client:5173;
}

upstream api {
    server api:8000;
}

server {
    listen 80;

    location / {
        proxy_pass http://client;
    }

    location /sockjs-node {
        proxy_pass http://client;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }

    location /api {
        rewrite /api/(.*) /$1 break;
        proxy_pass http://api;
    }
}
``` 
This configuration is for an Nginx server, typically used as a reverse proxy to direct incoming HTTP requests to different backend services based on the request's URL path. Here's a brief explanation:

#### `upstream client { ... }` and `upstream api { ... }`
- **`upstream client { server client:5173; }`**: Defines a group of servers (in this case, a single server) that Nginx will forward requests to for the `client`. The `client` service is running on port `5173`.
- **`upstream api { server api:8000; }`**: Similarly, this defines a group of servers for the `api`, which runs on port `8000`.

#### `server { ... }`
This block defines the configuration for handling incoming requests.

1 **`listen 80;`**: Configures the server to listen for HTTP requests on port `80`, the default HTTP port.

- **`location / { ... }`**:
    - Handles requests to the root (`/`) path.
    - **`proxy_pass http://client;`**: Forwards these requests to the `client` service defined earlier, which is the application running on port `5173`.

- **`location /sockjs-node { ... }`**:
    - Handles WebSocket connections, specifically for `sockjs-node`.
    - **`proxy_pass http://client;`**: Forwards these WebSocket requests to the `client` service.
    - **`proxy_http_version 1.1;`**: Ensures HTTP/1.1 is used, which is required for WebSocket connections.
    - **`proxy_set_header Upgrade $http_upgrade;` and `proxy_set_header Connection "Upgrade";`**: These headers are necessary for handling WebSocket connections, allowing the protocol to be upgraded from HTTP to WebSocket.

- **`location /api { ... }`**:
    - Handles requests to the `/api` path.
    - **`rewrite /api/(.*) /$1 break;`**: This rewrites the URL by stripping the `/api` prefix before passing it to the `api` service. For example, a request to `/api/users` becomes `/users`.
    - **`proxy_pass http://api;`**: Forwards the rewritten requests to the `api` service running on port `8000`.

- inside the nginx folder create this file `Dockerfile` add this code
```Javascript
FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
```

### 3. `./server` 
- inside the server folder create this file `Dockerfile` add this code
```Docker
#use alpine Node.js runtime as a parent image
FROM node:20.16.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json  ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8000
EXPOSE 8000

# Command to run the application
CMD ["npm", "run", "start"]
```
### 4. In both `server` and `client` folder
- Add `Dockerfile` with this code
```Docker
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
### 4. In the root folder create a `Docker-compose.yml` file.
```Docker
version: "3.8"
services:
  postgres:
    image: "postgres:latest"
    environment:
      - POSTGRES_PASSWORD=postgres_password
  nginx:
    container_name: nginx
    build:
      context: ./nginx
      dockerfile: Dockerfile  # Change to `Dockerfile` for production
    ports:
      - "80:80"
    depends_on:
      - api
      - client
    restart: always    
  api:
    build:
      dockerfile: Dockerfile # Change to `Dockerfile` for production
      context: "./server"
    volumes:
      - /app/node_modules
      - ./server:/app
    environment:
      - PGUSER=postgres
      - PGHOST=postgres
      - PGDATABASE=postgres
      - PGPASSWORD=postgres_password
      - PGPORT=5432
  client:
    stdin_open: true
    build:
      dockerfile: Dockerfile # Change to `Dockerfile` for production
      context: ./client
    volumes:
      - /app/node_modules
      - ./client:/app
```
This `docker-compose.yml` file defines a multi-service application using Docker Compose, where different containers are set up for PostgreSQL, Nginx, the API server, and the client application. Here's a breakdown of what each part does:

### Version
- **`version: "3.8"`**: Specifies the version of the Docker Compose file format. Version 3.8 is compatible with the latest features in Docker.

### Services
The `services` section defines all the containers that will be started as part of this application.

#### 1. **`postgres` Service**
- **`image: "postgres:latest"`**: Uses the latest official PostgreSQL Docker image.
- **`environment:`**: Sets environment variables for the PostgreSQL container.
    - `POSTGRES_PASSWORD=postgres_password`: Sets the password for the default `postgres` user in PostgreSQL.

#### 2. **`nginx` Service**
- **`container_name: nginx`**: Names the Nginx container as `nginx`.
- **`build:`**: Specifies how to build the Nginx Docker image.
    - `context: ./nginx`: Uses the `nginx` directory as the build context (where Docker looks for files like the Dockerfile).
    - `dockerfile: Dockerfile`: Specifies the Dockerfile to use for building the Nginx image. It's set to `Dockerfile`, indicating that it's ready for a production environment.
- **`ports:`**: Maps port `80` on the host to port `80` in the container, making the Nginx server accessible via HTTP.
- **`depends_on:`**: Ensures that the `api` and `client` services are started before Nginx.
- **`restart: always`**: Ensures that the Nginx container is always restarted if it stops.

#### 3. **`api` Service**
- **`build:`**: Specifies how to build the API server Docker image.
    - `dockerfile: Dockerfile`: Specifies the Dockerfile to use, ready for production.
    - `context: "./server"`: Uses the `server` directory as the build context.
- **`volumes:`**: Mounts local directories into the container.
    - `/app/node_modules`: Ensures `node_modules` inside the container isn’t overwritten by an empty host directory.
    - `./server:/app`: Mounts the `server` directory on the host to `/app` inside the container, allowing live development.
- **`environment:`**: Sets environment variables to configure the API server.
    - `PGUSER=postgres`, `PGHOST=postgres`, `PGDATABASE=postgres`, `PGPASSWORD=postgres_password`, `PGPORT=5432`: These configure the connection to the PostgreSQL database running in the `postgres` service.

#### 4. **`client` Service**
- **`stdin_open: true`**: Keeps the standard input open, which is often used for interactive debugging.
- **`build:`**: Specifies how to build the client application Docker image.
    - `dockerfile: Dockerfile`: Specifies the Dockerfile for the client, set up for production.
    - `context: ./client`: Uses the `client` directory as the build context.
- **`volumes:`**: Mounts local directories into the container.
    - `/app/node_modules`: Similar to the API service, it preserves the `node_modules` directory inside the container.
    - `./client:/app`: Mounts the `client` directory on the host to `/app` inside the container.

### Summary
This Docker Compose file sets up a full-stack application with:
- A **PostgreSQL database** (`postgres`).
- An **Nginx server** to act as a reverse proxy (`nginx`).
- An **API backend** (`api`).
- A **client frontend** (`client`).

## Build and Run using `docker-compose.yml`
To build and run the services defined in the `docker-compose.yml` file, you can use the following commands in your terminal:

### 1. Build the Services
```bash
docker-compose build
```
This command will build the Docker images for all the services (PostgreSQL, Nginx, API, and Client) as defined in the `docker-compose.yml` file. It will use the specified `Dockerfile` and context for each service.

### 2. Run the Services
```bash
docker-compose up
```
This command will start all the services defined in the `docker-compose.yml` file. It will also create and start any necessary networks, volumes, and dependencies.

### 3. Run the Services in Detached Mode (Optional)
If you want to run the services in the background (detached mode), you can use:
```bash
docker-compose up -d
```
This will start the containers in the background, allowing you to continue using the terminal for other tasks.

### 4. Stopping the Services
To stop the services that are running:
```bash
docker-compose down
```
This will stop and remove all the containers, networks, and volumes created by `docker-compose up`.

## Pushing local Docker images to DockerHub Repositories
- sign in to https://hub.docker.com/ and create a repository called `react-app-prod`, `express-app-prod` and `ngnix-prod`
- Go back to your project and cd into the root of `client`
- Log in to the Docker registry:
```Docker
docker login
```
- Enter your username and password when prompted. If you are using Docker Hub, these would be your Docker Hub credentials. For private registries, use the appropriate credentials.

### Client(React-app)
- 
- To push an image use
```Docker
docker push my-dockerhub-username/my-repo:tag
```
- For this example I'll build the client image with `my-dockerhub-username/my-repo:tag`
```Docker
docker build -t kelchospense/react-app-prod:v1 .
```
- Then push
```Docker
docker push kelchospense/react-app-prod:v1
```
### Server(Express-app)
- To build server go to the `./server` dir
```Docker
docker build -t kelchospense/express-app-prod:v1 .
```
- Then push
```Docker
docker push kelchospense/express-app-prod:v1
```