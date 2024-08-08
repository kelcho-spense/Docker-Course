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