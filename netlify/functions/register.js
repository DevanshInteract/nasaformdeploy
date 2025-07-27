exports.handler = async function(event) {
  try {
    // The form data is sent as a string, so we need to parse it
    const data = JSON.parse(event.body);
    const name = data.fullName;

    // Send back a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success! Registration received for " + name })
    };
    
  } catch (error) {
    // Send back an error response
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Error processing your request." })
    };
  }
};