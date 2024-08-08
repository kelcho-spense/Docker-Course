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