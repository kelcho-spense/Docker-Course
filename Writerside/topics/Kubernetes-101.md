
# What is Kubernetes?

Kubernetes, often abbreviated as "K8s," is an open-source platform designed to automate the deployment, scaling, and management of containerized applications. It’s crucial in modern cloud-native application development for several reasons:

#### 1. **Scalability**
- Kubernetes allows you to easily scale your application up or down based on demand. This ensures that your application can handle traffic spikes without manual intervention.

#### 2. **High Availability**
- Kubernetes ensures that your application is always up and running by automatically restarting failed containers, replicating services across nodes, and managing rolling updates.

#### 3. **Efficient Resource Utilization**
- It schedules containers based on available resources and requirements, optimizing the use of underlying infrastructure. This ensures cost-effective usage of computing resources.

#### 4. **Self-Healing**
- Kubernetes automatically monitors the health of your applications and containers. If a container fails, it restarts it. If a node fails, it redistributes the workloads.

#### 5. **Automated Rollouts and Rollbacks**
- You can define how your application should be updated. Kubernetes will gradually roll out changes while monitoring the health of your application, allowing for automated rollbacks if something goes wrong.

#### 6. **Portability and Flexibility**
- Kubernetes abstracts away the underlying infrastructure, making it easier to move workloads between different environments (on-premises, public cloud, hybrid cloud).

#### Use Cases:
- **Microservices Architecture**: Kubernetes is ideal for deploying microservices because it can manage a large number of interdependent services with ease.
- **DevOps Pipelines**: Automate deployment, scaling, and operations of application containers across clusters of hosts.
- **Hybrid Cloud Deployments**: Consistently deploy applications across on-premises and public cloud environments.
- **Batch Processing and CI/CD**: Efficiently run batch jobs, continuous integration, and continuous deployment tasks with Kubernetes.

### Practical Example: Kubernetes on Docker Desktop

Let's create a simple example where we deploy a Node.js application on Kubernetes using Docker Desktop.


### Step 0: Set Up Kubernetes on Docker Desktop

1. **Install Docker Desktop**:
    - Download and install Docker Desktop from the [official site](https://www.docker.com/products/docker-desktop).

2. **Enable Kubernetes**:
    - Open Docker Desktop, go to **Settings** > **Kubernetes** and check "Enable Kubernetes".
    - Click "Apply & Restart". Docker Desktop will install and start a local Kubernetes cluster.

### Step 1: Set Up the Node.js Application

![express-k8s-folder-structure.png](express-k8s-folder-structure.png)

1. **Initialize the Node.js Project**:
   ```bash
   mkdir express-postgres-k8s
   cd express-postgres-k8s
   npm init -y
   npm install express pg sequelize
   ```

   - **`express`**: Framework to build the API.
   - **`pg`**: PostgreSQL client for Node.js.
   - **`sequelize`**: ORM (Object-Relational Mapping) for PostgreSQL.

2. **Set Up Sequelize and PostgreSQL Connection**:

   Create a file `db.js` to configure Sequelize and connect to PostgreSQL:

   ```javascript
   const { Sequelize } = require('sequelize');

   // Create a new Sequelize instance
   const sequelize = new Sequelize('todo_db', 'postgres', 'password', {
     host: 'localhost',
     dialect: 'postgres',
   });

   // Test the connection
   sequelize
     .authenticate()
     .then(() => {
       console.log('Connection to PostgreSQL has been established successfully.');
     })
     .catch(err => {
       console.error('Unable to connect to the database:', err);
     });

   module.exports = sequelize;
   ```

   - **Database Name**: `todo_db`
   - **User**: `postgres`
   - **Password**: `password`
   - **Host**: `localhost` (will be updated for Docker/Kubernetes)

3. **Define the To-Do Model**:

   Create a file `todo.model.js` to define the To-Do model:

   ```javascript
   const { DataTypes } = require('sequelize');
   const sequelize = require('./db');

   const Todo = sequelize.define('Todo', {
     id: {
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true,
     },
     title: {
       type: DataTypes.STRING,
       allowNull: false,
     },
     completed: {
       type: DataTypes.BOOLEAN,
       defaultValue: false,
     },
   });

   // Sync the model with the database
   sequelize.sync()
     .then(() => {
       console.log('Todo model synced with the database.');
     })
     .catch(err => {
       console.error('Failed to sync model with the database:', err);
     });

   module.exports = Todo;
   ```

4. **Create the Express Server with CRUD Routes**:

   Create a file `index.js` to define the Express server and CRUD routes:

   ```javascript
   const express = require('express');
   const Todo = require('./todo.model');

   const app = express();
   app.use(express.json());

   // Create a new to-do
   app.post('/todos', async (req, res) => {
     try {
       const todo = await Todo.create(req.body);
       res.status(201).json(todo);
     } catch (err) {
       res.status(400).json({ error: err.message });
     }
   });

   // Get all to-dos
   app.get('/todos', async (req, res) => {
     try {
       const todos = await Todo.findAll();
       res.status(200).json(todos);
     } catch (err) {
       res.status(400).json({ error: err.message });
     }
   });

   // Get a single to-do by ID
   app.get('/todos/:id', async (req, res) => {
     try {
       const todo = await Todo.findByPk(req.params.id);
       if (todo) {
         res.status(200).json(todo);
       } else {
         res.status(404).json({ error: 'To-do not found' });
       }
     } catch (err) {
       res.status(400).json({ error: err.message });
     }
   });

   // Update a to-do
   app.put('/todos/:id', async (req, res) => {
     try {
       const todo = await Todo.findByPk(req.params.id);
       if (todo) {
         await todo.update(req.body);
         res.status(200).json(todo);
       } else {
         res.status(404).json({ error: 'To-do not found' });
       }
     } catch (err) {
       res.status(400).json({ error: err.message });
     }
   });

   // Delete a to-do
   app.delete('/todos/:id', async (req, res) => {
     try {
       const todo = await Todo.findByPk(req.params.id);
       if (todo) {
         await todo.destroy();
         res.status(204).end();
       } else {
         res.status(404).json({ error: 'To-do not found' });
       }
     } catch (err) {
       res.status(400).json({ error: err.message });
     }
   });

   // Start the server
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });
   ```

5. **Create a PostgreSQL Database**:

   Before testing, create the database `todo_db` in PostgreSQL:

   ```bash
   psql -U postgres
   CREATE DATABASE todo_db;
   ```

6. **Test the Application Locally**:

   Run the Node.js application:
   ```bash
   node index.js
   ```

   - Use Postman or cURL to test the CRUD operations against `http://localhost:3000/todos`.

### Step 2: Dockerize the Application

1. **Create a Dockerfile**:

   ```Docker
   FROM node:14

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY . .

   EXPOSE 3000

   CMD ["node", "index.js"]
   ```

   2. **Create a `docker-compose.yml` outside `express-postgres-k8s` folder for Local Development**:

      We'll use Docker Compose to run the application along with PostgreSQL.

      ```yaml
      version: '3.8'
   
      services:
        postgres:
          image: postgres:13
          environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: password
            POSTGRES_DB: todo_db
            ports:
              - "5432:5432"
            volumes:
              - postgres-data:/var/lib/postgresql/data
   
        app:
          build:
            dockerfile: Dockerfile
            context: ./express-postgres-k8s
        environment:
          DB_HOST: postgres
          DB_USER: postgres
          DB_PASSWORD: password
          DB_NAME: todo_db
        ports:
          - "3000:3000"
        depends_on:
          - postgres
   
      volumes:
        postgres-data:
      ```

      - **Explanation**:
         - This `docker-compose.yml` sets up two services: `postgres` and `app`.
         - The Node.js app depends on the PostgreSQL service and uses environment variables to connect to the database.

3. **Update `db.js` to Use Environment Variables**:

   Update the `db.js` file to use the environment variables defined in `docker-compose.yml`:

   ```javascript
   const { Sequelize } = require('sequelize');

   const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
     host: process.env.DB_HOST,
     dialect: 'postgres',
   });

   sequelize.authenticate()
     .then(() => {
       console.log('Connection to PostgreSQL has been established successfully.');
     })
     .catch(err => {
       console.error('Unable to connect to the database:', err);
     });

   module.exports = sequelize;
   ```
4. **Testing the API**: install REST Client extension and create `app.http` and add this code
 ```Javascript
### Create a new To-Do
POST http://localhost:3000/todos
Content-Type: application/json

{
  "title": "Buy groceries"
}

### Get all To-Dos
GET http://localhost:3000/todos

### Get a single To-Do by ID
GET http://localhost:3000/todos/1

### Update a To-Do (mark as completed)
PUT http://localhost:3000/todos/1
Content-Type: application/json

{
  "completed": true
}

### Delete a To-Do
DELETE http://localhost:3000/todos/1

```
5. **Build and Run the Docker Compose Setup**:

   ```bash
   docker-compose up --build
   ```

   - This command will build the Node.js Docker image, start the PostgreSQL service, and run the application.
   - The app will be accessible at `http://localhost:3000`.

### Step 3: Deploy to Kubernetes

Now, let's deploy the application on Kubernetes.

1. **Push the Docker Image to Docker Hub**:

   ```bash
   docker build -t <your-dockerhub-username>/node-postgres-todo:v1 .
   docker push <your-dockerhub-username>/node-postgres-todo:v1
   ```

2. **Create Kubernetes Manifests**:

   1. **PostgreSQL Deployment** (`postgres-deployment.yaml`):
      ```yaml
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: postgres-deployment
      spec:
        replicas: 1
        selector:
          matchLabels:
            app: postgres
        template:
          metadata:
            labels:
              app: postgres
          spec:
            containers:
            - name: postgres
              image: postgres:13
              ports:
              - containerPort: 5432
              env:
              - name: POSTGRES_USER
                value: "postgres"
              - name: POSTGRES_PASSWORD
                value: "password"
              - name: POSTGRES_DB
                value: "todo_db"
              volumeMounts:
              - mountPath: /var/lib/postgresql/data
                name: postgres-storage
            volumes:
            - name: postgres-storage
              persistentVolumeClaim:
                claimName: postgres-pvc
      ```

   2. **PostgreSQL Persistent Volume Claim** (`postgres-pvc.yaml`):
      ```yaml
      apiVersion: v1
      kind: PersistentVolumeClaim
      metadata:
        name: postgres-pvc
      spec:
        accessModes:
          - ReadWriteOnce
        resources:


          requests:
            storage: 1Gi
      ```

   3. **PostgreSQL Service** (`postgres-service.yaml`):
      ```yaml
      apiVersion: v1
      kind: Service
      metadata:
        name: postgres-service
      spec:
        selector:
          app: postgres
        ports:
          - protocol: TCP
            port: 5432
        type: ClusterIP
      ```

   4. **Node.js Application Deployment** (`node-app-deployment.yaml`):
      ```yaml
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: node-app-deployment
      spec:
        replicas: 3
        selector:
          matchLabels:
            app: node-app
        template:
          metadata:
            labels:
              app: node-app
          spec:
            containers:
            - name: node-app
              image: <your-dockerhub-username>/node-postgres-todo:v1
              ports:
              - containerPort: 3000
              env:
              - name: DB_HOST
                value: "postgres-service"
              - name: DB_USER
                value: "postgres"
              - name: DB_PASSWORD
                value: "password"
              - name: DB_NAME
                value: "todo_db"
      ```

   5. **Node.js Application Service** (`node-app-service.yaml`):
      ```yaml
      apiVersion: v1
      kind: Service
      metadata:
        name: node-app-service
      spec:
        selector:
          app: node-app
        ports:
          - protocol: TCP
            port: 80
            targetPort: 3000
        type: LoadBalancer
      ```

3. **Deploy to Kubernetes**:

   ```bash
   kubectl apply -f postgres-pvc.yaml
   kubectl apply -f postgres-deployment.yaml
   kubectl apply -f postgres-service.yaml
   kubectl apply -f node-app-deployment.yaml
   kubectl apply -f node-app-service.yaml
   ```

4. **Verify the Deployment**:

   - Check the pods and services:
     ```bash
     kubectl get pods
     kubectl get svc
     ```

   - Once the services are up and running, the Node.js app will be accessible via the external IP of the `node-app-service`.

### Conclusion

You've now created a full-stack Node.js application using Express and PostgreSQL with a simple To-Do list example. You've containerized the application using Docker, orchestrated it using Docker Compose for local development, and finally deployed it on Kubernetes. This example demonstrates how Kubernetes can help manage a multi-service application, providing scalability, load balancing, and resilience.