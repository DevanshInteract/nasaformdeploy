const { MongoClient } = require("mongodb");

// Get the secret database connection string from Netlify's environment variables
const mongoUri = process.env.MONGODB_URI;

exports.handler = async function(event) {
  const client = new MongoClient(mongoUri);

  try {
    const data = JSON.parse(event.body);

    await client.connect();
    
    // We'll save this data to a new database and collection for the MUN event
    const collection = client.db("nasaHackathon").collection("munpass");
    
    // Insert the form data
    await collection.insertOne(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success! Your registration has been saved." })
    };
    
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving your submission." })
    };
  } finally {
    await client.close();
  }
};
