# Dockerizing MongoDB

## Chapter 1: Introduction
This guide will walk you through the steps of Dockerizing MongoDB, setting up a user with specific credentials, persisting data using Docker volumes, and performing basic CRUD (Create, Read, Update, Delete) operations. We will cover everything from pulling the MongoDB image to running queries.

## Chapter 2: Setting Up Docker
### 2.1 Installing Docker on Windows
1. Download Docker Desktop from the [Docker website](https://www.docker.com/products/docker-desktop).
2. Run the installer and follow the instructions.
3. After installation, start Docker Desktop.
4. Verify the installation:
   ```bash
   docker --version
   ```

## Chapter 3: Dockerizing MongoDB
### 3.1 Pulling the MongoDB Image
- Open a command prompt and run the following command to pull the official MongoDB image:
  ```bash
  docker pull mongo
  ```

### 3.2 Creating a Docker Volume
- Create a volume to persist MongoDB data:
  ```bash
  docker volume create mongodb-data
  ```

### 3.3 Running MongoDB Container with Authentication and Persistent Storage
- Run the MongoDB container with environment variables to set the username and password, and use the volume for data persistence:
  ```bash
  docker run --name mongodb_container -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=pass -v mongodb-data:/data/db mongo
  ```

- Verify the container is running:
  ```bash
  docker ps
  ```

## Chapter 4: Connecting to MongoDB
### 4.1 Using MongoDB Shell
You have two options to connect to MongoDB shell:

#### Option 1: Direct Command
- Start the MongoDB shell directly:
  ```bash
  docker exec -it mongodb_container bash -c 'mongosh -u admin -p pass --authenticationDatabase admin'
  ```

#### Option 2: Entering the Container First
1. Start a bash shell inside the running MongoDB container:
   ```bash
   docker exec -it mongodb_container /bin/bash
   ```

2. Once inside the container, start the MongoDB shell:
   ```bash
   mongosh -u admin -p pass --authenticationDatabase admin
   ```

3. You should now be in the MongoDB shell:
   ```bash
   > 
   ```
4. List all databases:
   ```bash
   > show databases
   ```

## Chapter 5: CRUD Operations
### 5.1 Creating a Database and Collection
1. Create a new database called `mydatabase`:
   ```bash
   use mydatabase
   ```

2. Create a new collection called `mycollection`:
   ```bash
   db.createCollection("mycollection")
   ```

### 5.2 Create (Insert) Documents
1. Insert a single document into `mycollection`:
   ```bash
   db.mycollection.insertOne({ name: "John Doe", age: 30, occupation: "Engineer" })
   ```

2. Insert multiple documents:
   ```bash
   db.mycollection.insertMany([
     { name: "Jane Doe", age: 25, occupation: "Teacher" },
     { name: "Steve Smith", age: 40, occupation: "Chef" }
   ])
   ```

### 5.3 Read (Query) Documents
1. Find one document:
   ```bash
   db.mycollection.findOne({ name: "John Doe" })
   ```

2. Find all documents:
   ```bash
   db.mycollection.find()
   ```

3. Find documents with a condition:
   ```bash
   db.mycollection.find({ age: { $gt: 30 } })
   ```

### 5.4 Update Documents
1. Update a single document:
   ```bash
   db.mycollection.updateOne({ name: "John Doe" }, { $set: { age: 31 } })
   ```

2. Update multiple documents:
   ```bash
   db.mycollection.updateMany({ occupation: "Chef" }, { $set: { occupation: "Head Chef" } })
   ```

### 5.5 Delete Documents
1. Delete a single document:
   ```bash
   db.mycollection.deleteOne({ name: "John Doe" })
   ```

2. Delete multiple documents:
   ```bash
   db.mycollection.deleteMany({ age: { $lt: 30 } })
   ```

## Chapter 6: Accessing MongoDB from an Application
### 6.1 Using MongoDB with Node.js
1. Install Node.js from the [official website](https://nodejs.org/).

2. Create a new project directory and navigate into it:
   ```bash
   mkdir my-mongo-app
   cd my-mongo-app
   ```

3. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```

4. Install the MongoDB driver:
   ```bash
   npm install mongodb
   ```

5. Create an `index.js` file and add the following code:
   ```javascript
   const { MongoClient } = require('mongodb');

   async function main() {
     const uri = "mongodb://admin:pass@localhost:27017/?authSource=admin";
     const client = new MongoClient(uri);

     try {
       await client.connect();

       const database = client.db('mydatabase');
       const collection = database.collection('mycollection');

       // Insert a document
       const insertResult = await collection.insertOne({ name: "Alice", age: 28, occupation: "Designer" });
       console.log('Inserted document:', insertResult.insertedId);

       // Find a document
       const findResult = await collection.findOne({ name: "Alice" });
       console.log('Found document:', findResult);

       // Update a document
       const updateResult = await collection.updateOne({ name: "Alice" }, { $set: { age: 29 } });
       console.log('Updated document:', updateResult.modifiedCount);

       // Delete a document
       const deleteResult = await collection.deleteOne({ name: "Alice" });
       console.log('Deleted document:', deleteResult.deletedCount);
     } finally {
       await client.close();
     }
   }

   main().catch(console.error);
   ```

6. Run the application:
   ```bash
   node index.js
   ```

## Chapter 7: Cleaning Up
### 7.1 Stopping and Removing the MongoDB Container
- Stop the container:
  ```bash
  docker stop mongodb_container
  ```

- Remove the container:
  ```bash
  docker rm mongodb_container
  ```

### 7.2 Removing the MongoDB Image
- Remove the MongoDB image:
  ```bash
  docker rmi mongo
  ```

### 7.3 Removing the Docker Volume
- Remove the Docker volume:
  ```bash
  docker volume rm mongodb-data
  ```

