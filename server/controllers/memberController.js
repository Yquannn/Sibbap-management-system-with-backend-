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

// Function to generate a unique member ID
const generateUniqueMemberId = async () => {
  const currentYear = new Date().getFullYear() % 100; // Last two digits of the current year
  let uniqueId = `${currentYear}`; // Start with the year

  const query = 'SELECT MAX(CAST(memberId AS UNSIGNED)) AS maxId FROM member_information WHERE memberId LIKE ?';
  const queryParams = [`${currentYear}%`]; // Consider IDs starting with the current year

  try {
    const results = await queryDatabase(query, queryParams);
    const maxId = results[0].maxId;
    const newId = maxId ? parseInt(maxId.toString().slice(2)) + 1 : 1; // Increment ID
    uniqueId += String(newId).padStart(4, '0'); // Ensure it's 4 digits long after the year
    return uniqueId;
  } catch (error) {
    console.error('Error generating unique member ID:', error);
    throw new Error('Error generating unique member ID');
  }
};

// Function to format the date to "YYYY-MM-DD"
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // Returns "YYYY-MM-DD"
};

// Controller to handle GET requests to retrieve all members or filter by name
exports.getMembers = async (req, res) => {
  const memberName = req.query.name; // Query parameter for member's name

  let query = 'SELECT * FROM member_information';
  const queryParams = [];

  // If memberName is provided, filter the results by full name
  if (memberName) {
    query += ' WHERE LOWER(fullName) = ?';
    queryParams.push(memberName.toLowerCase());
  }

  try {
    const results = await queryDatabase(query, queryParams);
    if (results.length > 0) {
      res.json(results); // Send the results back as a JSON response
    } else {
      res.status(404).json({ message: 'No members found' });
    }
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    res.status(500).json({ message: 'Error fetching data from MySQL' });
  }
};

// Controller to handle GET requests to retrieve a member by ID
exports.getMemberById = async (req, res) => {
  const id = req.params.id; // Get the member ID from request parameters

  // Validate id (ensure it's a valid number)
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  const query = 'SELECT * FROM member_information WHERE id = ?'; // Ensure you are querying by the correct field

  try {
    const results = await queryDatabase(query, [id]); // Using the Promise-based query function
    if (results.length > 0) {
      res.json(results[0]); // Send the member data as a JSON response
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    res.status(500).json({ message: 'Error fetching data from MySQL' });
  }
};

// Controller to handle POST requests to add a new member
exports.addMember = async (req, res) => {
  const { fullName, age, contactNumber, gender, address, sharedCapital, email, password, memberSince } = req.body;

  // If memberSince is provided, use it; otherwise, use the current date (formatted)
  const formattedMemberSince = memberSince ? formatDate(new Date(memberSince)) : formatDate(new Date());

  try {
    const memberId = await generateUniqueMemberId(); // Generate a unique member ID
    const query = `
      INSERT INTO member_information 
      (memberId, fullName, age, contactNumber, gender, address, sharedCapital, memberSince, email, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const queryParams = [memberId, fullName, age, contactNumber, gender, address, sharedCapital, formattedMemberSince, email, password];

    await queryDatabase(query, queryParams); // Await the insert operation
    res.status(201).json({ id: memberId, message: 'Member added successfully' });
  } catch (error) {
    console.error('Error inserting data into MySQL:', error);
    res.status(500).json({ message: 'Error inserting data into MySQL' });
  }
};

// Controller to handle PUT requests to update a member
exports.updateMember = async (req, res) => {
  const id = req.params.id;
  const { fullName, age, contactNumber, gender, address, sharedCapital, email, password } = req.body;

  const query = `
    UPDATE member_information
    SET 
      fullName = ?, 
      age = ?, 
      contactNumber = ?, 
      gender = ?, 
      address = ?, 
      sharedCapital = ?, 
      email = ?, 
      password = ?
    WHERE id = ?
  `;
  const queryParams = [fullName, age, contactNumber, gender, address, sharedCapital, email, password, id];

  try {
    const result = await queryDatabase(query, queryParams); // Await the update operation
    if (result.affectedRows > 0) {
      res.json({ message: 'Member updated successfully' });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    console.error('Error updating data in MySQL:', error);
    res.status(500).json({ message: 'Error updating data in MySQL' });
  }
};

// Controller to handle DELETE requests to delete a member
exports.deleteMember = async (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM member_information WHERE id = ?";

  try {
    const result = await queryDatabase(query, [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Member deleted successfully' });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Error deleting member' });
  }
};



