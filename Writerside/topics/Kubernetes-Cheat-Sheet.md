Here's a Kubernetes cheat sheet with some commonly used commands, including how to delete pods and more:

# Kubernetes Cheat Sheet

#### 1. **Basic Commands**

- **Get cluster information:**
  ```bash
  kubectl cluster-info
  ```

- **View nodes in the cluster:**
  ```bash
  kubectl get nodes
  ```

- **View all resources (pods, services, etc.):**
  ```bash
  kubectl get all
  ```

#### 2. **Pods**

- **List all pods in the current namespace:**
  ```bash
  kubectl get pods
  ```

- **List pods in all namespaces:**
  ```bash
  kubectl get pods --all-namespaces
  ```

- **Get detailed information about a pod:**
  ```bash
  kubectl describe pod <pod_name>
  ```

- **Delete a specific pod:**
  ```bash
  kubectl delete pod <pod_name>
  ```

- **Force delete a pod (without waiting for graceful termination):**
  ```bash
  kubectl delete pod <pod_name> --grace-period=0 --force
  ```

- **Get logs of a specific pod:**
  ```bash
  kubectl logs <pod_name>
  ```

- **Stream logs of a specific pod:**
  ```bash
  kubectl logs -f <pod_name>
  ```

#### 3. **Deployments**

- **List all deployments:**
  ```bash
  kubectl get deployments
  ```

- **Describe a specific deployment:**
  ```bash
  kubectl describe deployment <deployment_name>
  ```

- **Create a deployment:**
  ```bash
  kubectl create deployment <deployment_name> --image=<image_name>
  ```

- **Update a deployment with a new image:**
  ```bash
  kubectl set image deployment/<deployment_name> <container_name>=<new_image_name>
  ```

- **Scale a deployment:**
  ```bash
  kubectl scale deployment <deployment_name> --replicas=<number_of_replicas>
  ```

- **Delete a deployment:**
  ```bash
  kubectl delete deployment <deployment_name>
  ```

#### 4. **Services**

- **List all services:**
  ```bash
  kubectl get services
  ```

- **Describe a specific service:**
  ```bash
  kubectl describe service <service_name>
  ```

- **Expose a deployment as a service:**
  ```bash
  kubectl expose deployment <deployment_name> --type=<type> --port=<port> --target-port=<target_port>
  ```

- **Delete a service:**
  ```bash
  kubectl delete service <service_name>
  ```

#### 5. **Namespaces**

- **List all namespaces:**
  ```bash
  kubectl get namespaces
  ```

- **Create a new namespace:**
  ```bash
  kubectl create namespace <namespace_name>
  ```

- **Delete a namespace:**
  ```bash
  kubectl delete namespace <namespace_name>
  ```

- **Switch to a different namespace:**
  ```bash
  kubectl config set-context --current --namespace=<namespace_name>
  ```

#### 6. **ConfigMaps & Secrets**

- **Create a ConfigMap:**
  ```bash
  kubectl create configmap <configmap_name> --from-literal=<key>=<value>
  ```

- **Create a Secret:**
  ```bash
  kubectl create secret generic <secret_name> --from-literal=<key>=<value>
  ```

- **Describe a ConfigMap or Secret:**
  ```bash
  kubectl describe configmap <configmap_name>
  kubectl describe secret <secret_name>
  ```

- **Delete a ConfigMap or Secret:**
  ```bash
  kubectl delete configmap <configmap_name>
  kubectl delete secret <secret_name>
  ```

#### 7. **Others**

- **Apply a configuration from a file:**
  ```bash
  kubectl apply -f <file_name>.yaml
  ```

- **Delete resources from a file:**
  ```bash
  kubectl delete -f <file_name>.yaml
  ```

- **View events:**
  ```bash
  kubectl get events
  ```

- **View the current context:**
  ```bash
  kubectl config current-context
  ```

This cheat sheet covers the most common operations in Kubernetes. It’s helpful to keep this handy when working with Kubernetes clusters!