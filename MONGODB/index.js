const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://admin:pass@localhost:27017/?authSource=admin";
    const client = new MongoClient(uri);

    try {
        if (await client.connect()) {
            console.log('Connected to MongoDB');
        }

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