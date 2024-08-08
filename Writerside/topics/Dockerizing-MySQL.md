#🔖️ A Guide to Dockerizing MySQL

## Chapter 1: Introduction
This guide will walk you through the steps of Dockerizing MySQL, setting up a user with specific credentials, persisting data using Docker volumes, and performing basic CRUD (Create, Read, Update, Delete) operations. We will cover everything from pulling the MySQL image to running queries.

## Chapter 2: Setting Up Docker
### 2.1 Installing Docker on Windows
1. Download Docker Desktop from the [Docker website](https://www.docker.com/products/docker-desktop).
2. Run the installer and follow the instructions.
3. After installation, start Docker Desktop.
4. Verify the installation:
   ```bash
   docker --version
   ```

## Chapter 3: Dockerizing MySQL
### 3.1 Pulling the MySQL Image
- Open a command prompt and run the following command to pull the official MySQL image:
  ```bash
  docker pull mysql
  ```

### 3.2 Creating a Docker Volume
- Create a volume to persist MySQL data:
  ```bash
  docker volume create mysql-data
  ```

### 3.3 Running MySQL Container with Authentication and Persistent Storage
- Run the MySQL container with environment variables to set the username and password, and use the volume for data persistence:
  ```bash
  docker run --name mysql_container -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_USER=admin -e MYSQL_PASSWORD=pass -e MYSQL_DATABASE=mydatabase -v mysql-data:/var/lib/mysql mysql
  ```

- Verify the container is running:
  ```bash
  docker ps
  ```

## Chapter 4: Connecting to MySQL
### 4.1 Using MySQL Shell
You have two options to connect to the MySQL shell:

#### Option 1: Direct Command
- Start the MySQL shell directly:
  ```bash
  docker exec -it mysql_container mysql -u admin -p
  ```
- you will be prompted to Enter password:
    ```bash
    Enter password: pass
    ```

#### Option 2: Entering the Container First
1. Start a bash shell inside the running MySQL container:
   ```bash
   docker exec -it mysql_container /bin/bash
   ```

2. Once inside the container, start the MySQL shell:
   ```bash
   mysql -u admin -p
   ```

3. Enter the password when prompted (`pass` in this example).

4. You should now be in the MySQL shell:
   ```sql
   mysql>
   ```

5. In the MySQL shell, you can list all databases using the following command:

- List All Databases:
   ```sql
   SHOW DATABASES;
   ```

## Chapter 5: CRUD Operations
### 5.1 Creating a Database and Table
1. Create a new database called `mydatabase`:
   ```sql
   CREATE DATABASE mydatabase;
   ```

2. Select the new database:
   ```sql
   USE mydatabase;
   ```

3. Create a new table called `mytable`:
   ```sql
   CREATE TABLE mytable (
       id INT AUTO_INCREMENT PRIMARY KEY,
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

### 5.6 Additional Useful Commands
- List all tables in the current database:
   ```sql
   SHOW TABLES;
   ```

- Describe the structure of a table:
   ```sql
   DESCRIBE mytable;
   ```

- List all users:
   ```sql
   SELECT User, Host FROM mysql.user;
   ```

## Chapter 6: Accessing MySQL from an Application
### 6.1 Using MySQL with Node.js
1. Install Node.js from the [official website](https://nodejs.org/).

2. Create a new project directory and navigate into it:
   ```bash
   mkdir my-mysql-app
   cd my-mysql-app
   ```

3. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```

4. Install the `mysql` package:
   ```bash
   npm install mysql2
   ```

5. Create an `index.js` file and add the following code:
   ```javascript
   const mysql = require('mysql2/promise');

    async function main() {
    const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'pass',
    database: 'mydatabase'
    });
    
    try {
    console.log('connected as id ' + connection.threadId);
    
        // Insert a record
        const [insertResults] = await connection.execute(
          "INSERT INTO mytable (name, age, occupation) VALUES (?, ?, ?)",
          ['Alice', 28, 'Designer']
        );
        console.log('Inserted record ID:', insertResults.insertId);
    
        // Select a record
        const [selectResults] = await connection.execute(
          "SELECT * FROM mytable WHERE name = ?",
          ['Alice']
        );
        console.log('Selected record:', selectResults[0]);
    
        // Update a record
        const [updateResults] = await connection.execute(
          "UPDATE mytable SET age = ? WHERE name = ?",
          [29, 'Alice']
        );
        console.log('Updated record count:', updateResults.affectedRows);
    
        // Delete a record
        const [deleteResults] = await connection.execute(
          "DELETE FROM mytable WHERE name = ?",
          ['Alice']
        );
        console.log('Deleted record count:', deleteResults.affectedRows);
    } catch (err) {
    console.error('error:', err.stack);
    } finally {
    await connection.end();
    }
    }
    
    main();
   ```

6. Run the application:
   ```bash
   node index.js
   ```

## Chapter 7: Cleaning Up
### 7.1 Stopping and Removing the MySQL Container
- Stop the container:
  ```bash
  docker stop mysql_container
  ```

- Remove the container:
  ```bash
  docker rm mysql_container
  ```

### 7.2 Removing the MySQL Image
- Remove the MySQL image:
  ```bash
  docker rmi mysql
  ```

### 7.3 Removing the Docker Volume
- Remove the Docker volume:
  ```bash
  docker volume rm mysql-data
  ```

---
