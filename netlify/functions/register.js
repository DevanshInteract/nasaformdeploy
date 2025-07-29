const { MongoClient } = require("mongodb");

const mongoUri = process.env.MONGODB_URI;

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = new MongoClient(mongoUri);

  try {
    const data = JSON.parse(event.body);

    await client.connect();

    const collection = client.db("nasaHackathon").collection("teams");

    await collection.insertOne(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success! Your team has been registered." })
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving your registration." })
    };
  } finally {
    await client.close();
  }
};
