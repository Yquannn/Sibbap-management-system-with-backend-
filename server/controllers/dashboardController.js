const db = require('../config/db'); // Ensure you import your database connection

// Utility function to wrap db.query in a Promise
const queryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

//get total members
exports.getTotalMembers = async (req, res) => {
  const query = 'SELECT COUNT(*) AS total_members FROM member_information';

  try {
    const results = await queryDatabase(query);
    const totalMembers = results[0]?.total_members || 0; // Use optional chaining and default to 0 if undefined
    res.json({ totalMembers });
    console.log('Total Members:', totalMembers); // Better logging for clarity
  } catch (error) {
    console.error('Error fetching total members from MySQL:', error);
    res.status(500).json({ message: 'Error fetching total members from MySQL' });
  }
};
