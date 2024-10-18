const db = require('../config/db'); // Using mysql2/promise

const queryDatabase = async (query, params = []) => {
  try {
    const [results] = await db.execute(query, params); 
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw new Error('Error executing query');
  }
};

// Get total members controller function
exports.getTotalMembers = async (req, res) => {
  const query = 'SELECT COUNT(*) AS total_members FROM member_information';

  try {
    const results = await queryDatabase(query);

    // Check if results contain valid data
    if (!results || results.length === 0) {
      throw new Error('No data returned from the database');
    }

    // Extract total members count
    const totalMembers = results[0].total_members || 0;
    res.json({ totalMembers });

    // Log the count for debugging purposes
    console.log(`Total Members fetched: ${totalMembers}`);
  } catch (error) {
    console.error('Error fetching total members from MySQL:', error.message);
    res.status(500).json({ message: 'Error fetching total members from MySQL' });
  }
};
