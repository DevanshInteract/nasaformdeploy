const { MongoClient } = require("mongodb");

// Get the database connection string from Netlify's environment variables
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

exports.handler = async function(event) {
  try {
    const data = JSON.parse(event.body);

    // Connect to the database
    await client.connect();
    
    // Choose the database and collection (they will be created automatically)
    const collection = client.db("spaceapps").collection("registrations");
    
    // Insert the form data as a new document
    await collection.insertOne(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success! Your registration has been saved." })
    };
    
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving your registration." })
    };
  } finally {
    // Always close the connection
    await client.close();
  }
};
