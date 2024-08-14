# Dockerizing MSSQL
## Chapter 1: Introduction
This guide will walk you through the steps of Dockerizing Microsoft SQL Server (MSSQL), setting up a user with specific credentials, persisting data using Docker volumes, and performing basic CRUD (Create, Read, Update, Delete) operations on a Windows system. We will cover everything from pulling the MSSQL image to running queries.

## Chapter 2: Setting Up Docker
### 2.1 Installing Docker on Windows
1. Download Docker Desktop from the [Docker website](https://www.docker.com/products/docker-desktop).
2. Run the installer and follow the instructions.
3. After installation, start Docker Desktop.
4. Verify the installation:
   ```bash
   docker --version
   ```

## Chapter 3: Dockerizing MSSQL Server
### 3.1 Pulling the MSSQL Server Image
- Open a command prompt or PowerShell and run the following command to pull the official MSSQL Server image:
  ```bash
  docker pull mcr.microsoft.com/mssql/server
  ```

### 3.2 Creating a Docker Volume
- Create a volume to persist MSSQL Server data:
  ```bash
  docker volume create mssql-data
  ```

### 3.3 Running MSSQL Server Container with Authentication and Persistent Storage
- Run the MSSQL Server container with environment variables to set the SA password and use the volume for data persistence:
  ```bash
  docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=yourStrong(!)Password" -p 1433:1433 --name mssql_container -v mssql-data:/var/opt/mssql -d mcr.microsoft.com/mssql/server
  ```

- Verify the container is running:
  ```bash
  docker ps
  ```

## Chapter 4: Installing MSSQL Command Line Tools
### 4.1 Download and Install MSSQL Tools
1. Download the Microsoft ODBC Driver 17 for SQL Server from the [Microsoft website](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server).

2. Install the ODBC driver by running the downloaded installer.

3. Download the SQL Server Command Line Tools (`sqlcmd` and `bcp`) from the [Microsoft website](https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility).

4. Install the SQL Server Command Line Tools by running the downloaded installer.


## Chapter 5: Connecting to MSSQL Server
### 5.1 Using MSSQL Server Command Line Tools
1. Open Command Prompt or PowerShell.

2. Connect to the MSSQL Server using `sqlcmd`:
   ```bash
   sqlcmd -S localhost -U SA -P "yourStrong(!)Password"
   ```

3. You should now be in the MSSQL command line:
   ```sql
   1>
   ```

4. In the MSSQL command line, you can list all databases using the following command:
   ```sql
   SELECT name FROM sys.databases;
   GO
   ```
### Example Session
- Here's how an example session might look:
    ```bash
    C:\> sqlcmd -S localhost -U SA -P "yourStrong(!)Password"
    1> SELECT name FROM sys.databases;
    2> GO
    name
    --------------------------------------------------------------------------------------------------------------------------------
    master
    tempdb
    model
    msdb
    mydatabase
    
    (5 rows affected)
    1>
    ```

## Chapter 6: CRUD Operations
### 6.1 Creating a Database and Table
1. Create a new database called `mydatabase`:
   ```sql
   CREATE DATABASE mydatabase;
   GO
   ```

2. Use the new database:
   ```sql
   USE mydatabase;
   GO
   ```

3. Create a new table called `mytable`:
   ```sql
   CREATE TABLE mytable (
       id INT PRIMARY KEY IDENTITY(1,1),
       name NVARCHAR(100),
       age INT,
       occupation NVARCHAR(100)
   );
   GO
   ```

### 6.2 Create (Insert) Records
1. Insert a single record into `mytable`:
   ```sql
   INSERT INTO mytable (name, age, occupation) VALUES ('John Doe', 30, 'Engineer');
   GO
   ```

2. Insert multiple records:
   ```sql
   INSERT INTO mytable (name, age, occupation) VALUES 
   ('Jane Doe', 25, 'Teacher'),
   ('Steve Smith', 40, 'Chef');
   GO
   ```

### 6.3 Read (Query) Records
1. Select one record:
   ```sql
   SELECT * FROM mytable WHERE name = 'John Doe';
   GO
   ```

2. Select all records:
   ```sql
   SELECT * FROM mytable;
   GO
   ```

3. Select records with a condition:
   ```sql
   SELECT * FROM mytable WHERE age > 30;
   GO
   ```

### 6.4 Update Records
1. Update a single record:
   ```sql
   UPDATE mytable SET age = 31 WHERE name = 'John Doe';
   GO
   ```

2. Update multiple records:
   ```sql
   UPDATE mytable SET occupation = 'Head Chef' WHERE occupation = 'Chef';
   GO
   ```

### 6.5 Delete Records
1. Delete a single record:
   ```sql
   DELETE FROM mytable WHERE name = 'John Doe';
   GO
   ```

2. Delete multiple records:
   ```sql
   DELETE FROM mytable WHERE age < 30;
   GO
   ```

### 6.6 Additional Useful Commands
- List all tables in the current database:
   ```sql
   SELECT * FROM sys.Tables;
   GO
   ```

- Describe the structure of a table:
   ```sql
   sp_help mytable;
   GO
   ```

- List all users:
   ```sql
   SELECT name FROM sys.sql_logins;
   GO
   ```

## Chapter 7: Accessing MSSQL Server from an Application
### 7.1 Using MSSQL Server with Node.js
1. Install Node.js from the [official website](https://nodejs.org/).

2. Create a new project directory and navigate into it:
   ```bash
   mkdir my-mssql-app
   cd my-mssql-app
   ```

3. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```

4. Install the `mssql` package:
   ```bash
   npm install mssql
   ```

5. Create an `index.js` file and add the following code:
   ```javascript
   const sql = require('mssql');

   const config = {
     user: 'sa',
     password: 'yourStrong(!)Password',
     server: 'localhost', 
     database: 'mydatabase',
     options: {
       encrypt: true, // Use encryption
       trustServerCertificate: true // For self-signed certificate
     }
   };

   async function main() {
     try {
       let pool = await sql.connect(config);

       // Insert a record
       let insertResult = await pool.request()
         .query("INSERT INTO mytable (name, age, occupation) VALUES ('Alice', 28, 'Designer')");
       console.log('Inserted record:', insertResult);
   
        // Insert a many
        let insertResult = await pool.request()
            .query(`INSERT INTO mytable (name, age, occupation) VALUES  
                ('jane doe', 30, 'Designer'),
                ('kyle Smith', 40, 'Chef')`);
        console.log('Inserted record:', insertResult);

       // Select a record
       let selectResult = await pool.request()
         .query("SELECT * FROM mytable WHERE name = 'Alice'");
       console.log('Selected record:', selectResult.recordset);

       // Update a record
       let updateResult = await pool.request()
         .query("UPDATE mytable SET age = 29 WHERE name = 'Alice'");
       console.log('Updated record:', updateResult);

       // Delete a record
       let deleteResult = await pool.request()
         .query("DELETE FROM mytable WHERE name = 'Alice'");
       console.log('Deleted record:', deleteResult);

     } catch (err) {
       console.error('SQL error', err);
     }
   }

   main();
   ```

6. Run the application:
   ```bash
   node index.js
   ```

## Chapter 8: Cleaning Up
### 8.1 Stopping and Removing the MSSQL Server Container
- Stop the container:
  ```bash
  docker stop mssql_container
  ``

- Remove the container:
  ```bash
  docker rm mssql_container
  ```

### 8.2 Removing the MSSQL Server Image
- Remove the MSSQL Server image:
  ```bash
  docker rmi mcr.microsoft.com/mssql/server
  ```

### 8.3 Removing the Docker Volume
- Remove the Docker volume:
  ```bash
  docker volume rm mssql-data
  ```