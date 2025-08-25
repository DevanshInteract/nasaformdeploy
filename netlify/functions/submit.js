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
    
    // Check if this is an IPL double delegation
    if (data.committee === 'ipl' && data.delegationType === 'double') {
      // Create a team ID for the double delegation
      const teamId = `IPL_TEAM_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Insert the main delegate data with team information
      await collection.insertOne({
        ...data,
        isTeamMember: true,
        teamId: teamId,
        registrationDate: new Date(),
        committee: data.committee,
        delegationType: data.delegationType
      });
      
      // Also create a record for the partner (if partner information exists)
      if (data.partnerName && data.partnerEmail) {
        await collection.insertOne({
          fullName: data.partnerName,
          email: data.partnerEmail,
          phone: data.partnerPhone || '',
          institute: data.institute,
          year: data.year,
          committee: data.committee,
          delegationType: 'double-partner',
          isTeamMember: true,
          teamId: teamId,
          registrationDate: new Date(),
          // Copy portfolio preferences since they're part of the same team
          portfolio1: data.portfolio1,
          portfolio2: data.portfolio2,
          portfolio3: data.portfolio3
        });
      }
    } else {
      // Regular single registration
      await collection.insertOne({
        ...data,
        isTeamMember: data.committee === 'ipl' && data.delegationType === 'double',
        teamId: data.committee === 'ipl' && data.delegationType === 'double' ? 
                `IPL_TEAM_${Date.now()}_${Math.floor(Math.random() * 1000)}` : null,
        registrationDate: new Date()
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Success! Your registration has been saved.",
        teamRegistration: data.committee === 'ipl' && data.delegationType === 'double'
      })
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
