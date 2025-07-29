const { MongoClient } = require("mongodb");

// Get the secret database connection string from Netlify's environment variables
const mongoUri = process.env.MONGODB_URI;

exports.handler = async function(event) {
  const client = new MongoClient(mongoUri);

  try {
    const data = JSON.parse(event.body);

    await client.connect();
    
    // As requested, this will save to a "hackathon" database
    const collection = client.db("hackathon").collection("registrations");
    
    // Insert the form data from your new form
    await collection.insertOne(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success! Your registration has been saved." })
    };
    
  } catch (error)
  {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving your submission." })
    };
  } finally {
    await client.close();
  }
};
