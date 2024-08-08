# 3️⃣ Dockerizing PostgreSQL

## Chapter 1: Introduction
This guide will walk you through the steps of Dockerizing PostgreSQL, setting up a user with specific credentials, persisting data using Docker volumes, and performing basic CRUD (Create, Read, Update, Delete) operations. We will cover everything from pulling the PostgreSQL image to running queries.

## Chapter 2: Setting Up Docker
### 2.1 Installing Docker on Windows
1. Download Docker Desktop from the [Docker website](https://www.docker.com/products/docker-desktop).
2. Run the installer and follow the instructions.
3. After installation, start Docker Desktop.
4. Verify the installation:
   ```bash
   docker --version
   ```

## Chapter 3: Dockerizing PostgreSQL
### 3.1 Pulling the PostgreSQL Image
- Open a command prompt and run the following command to pull the official PostgreSQL image:
  ```bash
  docker pull postgres
  ```

### 3.2 Creating a Docker Volume
- Create a volume to persist PostgreSQL data:
  ```bash
  docker volume create postgres-data
  ```

### 3.3 Running PostgreSQL Container with Authentication and Persistent Storage
- Run the PostgreSQL container with environment variables to set the username and password, and use the volume for data persistence:
  ```bash
    docker run --name postgres_container -d -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=pass -v postgres-data:/var/lib/postgresql/data postgres
  ```

- Verify the container is running:
  ```bash
  docker ps
  ```

## Chapter 4: Connecting to PostgreSQL
### 4.1 Using psql Shell
You have two options to connect to the PostgreSQL shell:

#### Option 1: Direct Command
- Start the PostgreSQL shell directly:
  ```bash
    docker exec -it postgres_container psql -U admin
  ```

#### Option 2: Entering the Container First
1. Start a bash shell inside the running PostgreSQL container:
   ```bash
   docker exec -it postgres_container /bin/bash
   ```

2. Once inside the container, start the PostgreSQL shell:
   ```bash
   psql -U admin
   ```

3. You should now be in the PostgreSQL shell:
   ```bash
    admin=#
   ```
4. In the PostgreSQL shell (psql), you can list all databases using the following command:

   - List All Databases
   ```bash
    \l
   ```
   - or 
   ```bash
    \list
   ```
5. Additional Useful Commands
- List all tables in the current database:
   ```bash
    \dt
   ```
- List all schemas in the current database:
    ```bash
    \dn
    ```
- List all users:
    ```bash
    \du
   ```
- List all indexes:
    ```bash
    \di
    ```

## Chapter 5: CRUD Operations
### 5.1 Creating a Database and Table
1. Create a new database called `mydatabase`:
   ```sql
   CREATE DATABASE mydatabase;
   ```

2. Connect to the new database:
   ```sql
   \c mydatabase
   ```

3. Create a new table called `mytable`:
   ```sql
   CREATE TABLE mytable (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100),
       age INT,
       occupation VARCHAR(100)
   );
   ```

### 5.2 Create (Insert) Records
1. Insert a single record into `mytable`:
   ```sql
   INSERT INTO mytable (name, age, occupation) VALUES ('John Doe', 30, 'Engineer');
   ```

2. Insert multiple records:
   ```sql
   INSERT INTO mytable (name, age, occupation) VALUES 
   ('Jane Doe', 25, 'Teacher'),
   ('Steve Smith', 40, 'Chef');
   ```

### 5.3 Read (Query) Records
1. Select one record:
   ```sql
   SELECT * FROM mytable WHERE name = 'John Doe';
   ```

2. Select all records:
   ```sql
   SELECT * FROM mytable;
   ```

3. Select records with a condition:
   ```sql
   SELECT * FROM mytable WHERE age > 30;
   ```

### 5.4 Update Records
1. Update a single record:
   ```sql
   UPDATE mytable SET age = 31 WHERE name = 'John Doe';
   ```

2. Update multiple records:
   ```sql
   UPDATE mytable SET occupation = 'Head Chef' WHERE occupation = 'Chef';
   ```

### 5.5 Delete Records
1. Delete a single record:
   ```sql
   DELETE FROM mytable WHERE name = 'John Doe';
   ```

2. Delete multiple records:
   ```sql
   DELETE FROM mytable WHERE age < 30;
   ```

## Chapter 6: Accessing PostgreSQL from an Application
### 6.1 Using PostgreSQL with Node.js
1. Install Node.js from the [official website](https://nodejs.org/).

2. Create a new project directory and navigate into it:
   ```bash
   mkdir my-postgres-app
   cd my-postgres-app
   ```

3. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```

4. Install the `pg` package:
   ```bash
   npm install pg
   ```

5. Create an `index.js` file and add the following code:
   ```javascript
   const { Client } = require('pg');

   async function main() {
     const client = new Client({
       user: 'admin',
       host: 'localhost',
       database: 'mydatabase',
       password: 'pass',
       port: 5432,
     });

     await client.connect();

     try {
       // Insert a record
       const insertResult = await client.query("INSERT INTO mytable (name, age, occupation) VALUES ('Alice', 28, 'Designer') RETURNING id");
       console.log('Inserted record ID:', insertResult.rows[0].id);

       // Select a record
       const selectResult = await client.query("SELECT * FROM mytable WHERE name = 'Alice'");
       console.log('Selected record:', selectResult.rows[0]);

       // Update a record
       const updateResult = await client.query("UPDATE mytable SET age = 29 WHERE name = 'Alice'");
       console.log('Updated record count:', updateResult.rowCount);

       // Delete a record
       const deleteResult = await client.query("DELETE FROM mytable WHERE name = 'Alice'");
       console.log('Deleted record count:', deleteResult.rowCount);
     } finally {
       await client.end();
     }
   }

   main().catch(console.error);
   ```

6. Run the application:
   ```bash
   node index.js
   ```

## Chapter 7: Cleaning Up
### 7.1 Stopping and Removing the PostgreSQL Container
- Stop the container:
  ```bash
  docker stop postgres_container
  ```

- Remove the container:
  ```bash
  docker rm postgres_container
  ```

### 7.2 Removing the PostgreSQL Image
- Remove the PostgreSQL image:
  ```bash
  docker rmi postgres
  ```

### 7.3 Removing the Docker Volume
- Remove the Docker volume:
  ```bash
  docker volume rm postgres-data
  ```

---
