const { MongoClient } = require("mongodb");

const mongoUri = process.env.MONGODB_URI;

exports.handler = async function(event) {
  // We're adding console.log statements to see how far the code gets.
  console.log("1. Function handler started.");

  // Note: We moved the 'new MongoClient' inside the try block for better error handling.
  let client;

  try {
    // The form data is sent as a string, so we need to parse it
    console.log("2. Inside try block. Will attempt to connect to database.");
    
    // Check if the connection string exists
    if (!mongoUri) {
      throw new Error("Database connection string is missing.");
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    
    console.log("3. Database connection successful.");

    const data = JSON.parse(event.body);
    const name = data.fullName;
    const collection = client.db("spaceapps").collection("registrations");
    await collection.insertOne(data);

    console.log("4. Data inserted successfully.");

    // Send back a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success! Registration received for " + name })
      body: JSON.stringify({ message: "Success! Your registration has been saved." })
    };

  } catch (error) {
    // Send back an error response
    // If anything fails in the 'try' block, this will run.
    console.error("5. ERROR CAUGHT:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Error processing your request." })
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving your registration." })
    };
  } finally {
    // This will run whether the function succeeded or failed.
    if (client) {
      console.log("6. Closing database connection.");
      await client.close();
    }
  }
};
};
