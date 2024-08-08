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

        // Insert a many
        let insertResult = await pool.request()
            .query(`INSERT INTO mytable (name, age, occupation) VALUES  
                ('Alice', 28, 'Designer'),
                ('Steve Smith', 40, 'Chef')`);
        console.log('Inserted record:', insertResult);

        let allRecords = await pool.request()
            .query("SELECT * FROM mytable");
        console.log(allRecords)

        // Select a record
        let selectResult = await pool.request()
            .query("SELECT * FROM mytable WHERE name = 'Alice'");
        console.log('Selected record:', selectResult.recordset);

        // // Update a record
        let updateResult = await pool.request()
            .query("UPDATE mytable SET age = 29 WHERE name = 'Alice'");
        console.log('Updated record:', updateResult);

        // // Delete a record
        let deleteResult = await pool.request()
            .query("DELETE FROM mytable WHERE name = 'Alice'");
        console.log('Deleted record:', deleteResult);

    } catch (err) {
        console.error('SQL error', err);
    }
}

main();
