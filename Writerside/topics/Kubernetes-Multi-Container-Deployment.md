# Kubernetes Multi Container Deployment | React | Node.js | Postgres | Ingress Nginx | step by step

## Chapter 1: Introduction
![kubernetes.png](kubernetes.png)

This diagram illustrates a Kubernetes deployment architecture for a full-stack application consisting of a React frontend, a Node.js (Express) backend, and a PostgreSQL database, with traffic management handled by an Ingress service using Nginx. Here’s a step-by-step explanation of how this setup works:

### 1. **Traffic Ingress via Ingress Service**
- **Ingress Service**:
    - The first component of this architecture is the Ingress service, which acts as the entry point for all external traffic into the Kubernetes cluster.
    - In this context, Nginx is likely used as the ingress controller to manage incoming HTTP/HTTPS requests. It routes the traffic based on defined rules to the appropriate services inside the cluster.

### 2. **Routing to Cluster IP Services**
- **Cluster IP Services**:
    - These services act as internal load balancers within the Kubernetes cluster, distributing incoming requests from the Ingress to the appropriate pods.
    - There are two Cluster IP services in this diagram:
        - One for the **Client-react-app**.
        - One for the **Server-express-app**.

### 3. **Client-React-App Deployment**
- **Deployment**:
    - This is where the React frontend is deployed.
    - The React application is served as static files and is accessed by the user’s browser.
    - It communicates with the backend (Server-express-app) for dynamic data.
    - Traffic destined for the React app is routed by the Ingress service to this deployment via the corresponding Cluster IP service.

### 4. **Server-Express-App Deployment**
- **Deployment**:
    - This is where the backend server, built with Node.js and Express, is deployed.
    - The server handles API requests from the frontend and manages business logic. It also interacts with the PostgreSQL database to fetch or store data.
    - The Ingress service routes traffic intended for the backend to this deployment through its associated Cluster IP service.

### 5. **Postgres-DB Deployment**
- **Deployment**:
    - The PostgreSQL database is deployed here.
    - It stores all persistent data for the application and is accessed by the Server-express-app for CRUD operations.
    - This deployment is not exposed to external traffic but is accessed internally by the Server-express-app.

### 6. **Inter-Deployment Communication**
- **Server-Express-App to Postgres-DB**:
    - The backend server (Node.js Express app) communicates with the PostgreSQL database deployment internally within the Kubernetes cluster.
    - The communication is facilitated via internal DNS or direct service names in Kubernetes, ensuring that the database is secure and only accessible by the backend service.

## Install Kubernetes via Docker
- Please make sure this option is checked below.
![Screenshot 2024-08-13 170438.png](docker-kubernetes-config.png)
- Run this on your terminal `kubectl version` this command is used to check the version of the kubectl client and the version of the Kubernetes server (i.e., the Kubernetes control plane) that your kubectl is communicating with.

## Create K8S folder
![ks8-folder-structure.png](ks8-folder-structure.png)

### 1. Add `client-deployment.yml` file with this code
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: client-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      component: web
  template:
    metadata:
      labels:
        component: web
    spec:
      containers:
        - name: client
          image: kelchospense/react-app-prod
          ports:
            - containerPort: 5173
```
This YAML configuration is a Kubernetes manifest that defines a **Deployment** for a React application. Here's a brief explanation of each section:

- ####  **apiVersion: apps/v1**
Specifies the version of the Kubernetes API being used. The `apps/v1` version is used for managing deployments, stateful sets, and other application-related resources.

#### 2. **kind: Deployment**
- Indicates that this manifest describes a **Deployment** resource. A Deployment is responsible for managing a set of identical pods, ensuring that the desired number of pods are running, and handling updates to the application.

#### 3. **metadata**
- **name: client-deployment**: Assigns a name to the Deployment. In this case, it's called `client-deployment`.

#### 4. **spec**
- The `spec` section defines the desired state of the Deployment.

- **replicas: 1**: Specifies that only one replica (pod) of this application should be running. This can be scaled up if needed.

- **selector**:
  - **matchLabels**: This section defines a label selector. It ensures that the Deployment manages only the pods that have the label `component: web`.

- **template**:
  - Defines the template for the pods that will be created by this Deployment.

  - **metadata**:
    - **labels**: Labels added to the pod. Here, the label `component: web` is assigned to the pod. This label must match the `matchLabels` selector in the Deployment spec.

  - **spec**:
    - **containers**: Defines the container(s) that will run inside the pod.

      - **name: client**: The name of the container running in the pod.

      - **image: kelchospense/react-app-prod**: The Docker image that the container will run. In this case, it's a React application that has been containerized and pushed to a Docker registry under the name `kelchospense/react-app-prod`.

      - **ports**:
        - **containerPort: 5173**: Specifies the port on which the application inside the container listens. This port will be exposed by the container so that it can be accessed by other services or users.
### Testing the client-deployment.yml`
- Go to the root dir and open terminal.
```Bash
  kubectl apply -f k8s 
```
- Check the pod is running
```Bash
  kubectl get pods
```
- should get
```Bash
client-deployment-5656f88b7c-2p9cs     1/1     Running   2               18m
```