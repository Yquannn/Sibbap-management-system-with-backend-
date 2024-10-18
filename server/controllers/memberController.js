const db = require('../config/db'); // Ensure this is configured for mysql2 with a pool
const bcrypt = require('bcrypt');

// Function to execute a query on the database
const queryDatabase = async (query, params) => {
  const connection = await db.getConnection(); // Get a connection from the pool
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } finally {
    connection.release(); // Always release the connection back to the pool
  }
};

// Function to generate a unique member ID
const generateUniqueMemberId = async () => {
  const currentYear = new Date().getFullYear() % 100; 
  let uniqueId = `${currentYear}`; 

  const query = 'SELECT MAX(CAST(memberCode AS UNSIGNED)) AS maxId FROM member_information WHERE memberCode LIKE ?';
  const queryParams = [`${currentYear}%`]; 

  try {
    const results = await queryDatabase(query, queryParams);
    const maxId = results[0]?.maxId; // Use optional chaining for safety
    const newId = maxId ? parseInt(maxId.toString().slice(2)) + 1 : 1;
    uniqueId += String(newId).padStart(4, '0'); 
    return uniqueId;
  } catch (error) {
    console.error('Error generating unique member ID:', error);
    throw new Error('Error generating unique member ID');
  }
};

// Function to format dates to "YYYY-MM-DD"
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

  if (memberName) {
    query += ' WHERE LOWER(fullName) = ?';
    queryParams.push(memberName.toLowerCase());
  }

  try {
    const results = await queryDatabase(query, queryParams);
    if (results.length > 0) {
      res.json(results); 
    } else {
      res.status(404).json({ message: 'No members found' });
    }
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    res.status(500).json({ message: 'Error fetching data from MySQL' });
  }
};

exports.getMemberById = async (req, res) => {
  const id = req.params.id; // Use id from request parameters
  console.log('Requested ID:', id); // Log the requested ID

  // Validate the ID
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  const query = `
    SELECT m.*, ma.email, ma.password, ma.accountStatus 
    FROM member_information m
    LEFT JOIN member_account ma ON m.id = ma.memberId  -- Use id for join condition
    WHERE m.id = ?
  `;

  try {
    const results = await queryDatabase(query, [id]); 
    console.log('Query results:', results); // Log query results

    if (results.length > 0) {
      res.json(results[0]); 
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    res.status(500).json({ message: 'Error fetching data from MySQL' });
  }
};



// Controller to handle POST requests to add a member
exports.addMember = async (req, res) => {
  const { fullName, age, contactNumber, gender, address, sharedCapital, email, password, memberSince } = req.body;
  const idPicture = req.file ? req.file.filename : null; 
  const formattedMemberSince = memberSince ? formatDate(new Date(memberSince)) : formatDate(new Date());

  const connection = await db.getConnection(); // Get a connection from the pool

  try {
    await connection.beginTransaction(); // Start a transaction

    // Generate unique member ID
    const memberCode = await generateUniqueMemberId();

    // Insert into `member_information` table
    const memberQuery = ` 
      INSERT INTO member_information 
      (memberCode, fullName, age, contactNumber, gender, address, sharedCapital, memberSince, idPicture) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
    `;
    const memberParams = [memberCode, fullName, age, contactNumber, gender, address, sharedCapital, formattedMemberSince, idPicture];
    
    // Execute the insert query
    const memberResult = await connection.execute(memberQuery, memberParams);

    // Check if the member was inserted successfully
    if (memberResult.affectedRows === 0) {
      throw new Error('Failed to insert member information');
    }

    // Get the last inserted member id
    const memberId = memberResult[0].insertId; // This gives you the auto-generated id

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert into `member_account` table using the memberId
    const accountQuery = ` 
      INSERT INTO member_account 
      (memberId, email, password, accountStatus)  
      VALUES (?, ?, ?, 'ACTIVE') 
    `;
    const accountParams = [memberId, email, hashedPassword]; 
    await connection.execute(accountQuery, accountParams);

    await connection.commit(); // Commit the transaction

    res.status(201).json({ message: 'Member added successfully', idPicture });
  } catch (error) {
    console.error('Error inserting data into MySQL:', error);
    await connection.rollback(); // Rollback in case of an error
    res.status(500).json({ message: 'Error inserting data into MySQL' });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};


// Controller to handle PUT requests to update a member
// Update Member Function
exports.updateMember = async (req, res) => {
  const id = req.params.id; // Get the member ID from the request parameters
  const { fullName, age, contactNumber, gender, address, sharedCapital, email, password } = req.body;
  const idPicture = req.file ? req.file.filename : null;

  // Validate ID
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  // Validate required fields
  if (!fullName || !contactNumber || !gender || !address || !sharedCapital || !email) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Update `member_information` table
    const memberQuery = `
      UPDATE member_information
      SET 
        fullName = ?, 
        age = ?, 
        contactNumber = ?, 
        gender = ?, 
        address = ?, 
        sharedCapital = ?, 
        idPicture = ?
      WHERE id = ?  -- Use id instead of memberCode
    `;
    const memberParams = [fullName, age, contactNumber, gender, address, sharedCapital, idPicture, id];
    await connection.execute(memberQuery, memberParams);

    // Only update the password if it is provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      // Update `member_account` table
      const accountQuery = `
        UPDATE member_account
        SET email = ?, password = ?
        WHERE memberId = ?  -- Ensure to use memberId for the account table
      `;
      const accountParams = [email, hashedPassword, id]; // Use hashed password and memberId
      await connection.execute(accountQuery, accountParams);
    } else {
      // Update `member_account` table without changing the password
      const accountQuery = `
        UPDATE member_account
        SET email = ?
        WHERE memberId = ?  -- Ensure to use memberId for the account table
      `;
      const accountParams = [email, id]; // Just update the email
      await connection.execute(accountQuery, accountParams);
    }

    // Commit the transaction
    await connection.commit();

    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    console.error('Error updating data in MySQL:', error);
    await connection.rollback();
    res.status(500).json({ message: 'Error updating member information' });
  } finally {
    await connection.release();
  }
};

// Delete Member Function
exports.deleteMember = async (req, res) => {
  const id = req.params.id; // Get the member ID from the request parameters

  // Validate ID
  if (!id || typeof id !== 'string' || id.trim() === '') {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Delete from `member_account` table first
    const accountQuery = "DELETE FROM member_account WHERE memberId = ?";  // Ensure to use memberId
    const accountResult = await connection.execute(accountQuery, [id]);

    // Delete from `member_information` table
    const memberQuery = "DELETE FROM member_information WHERE id = ?"; // Use id instead of memberCode
    const memberResult = await connection.execute(memberQuery, [id]);

    // Commit the transaction
    await connection.commit();

    if (memberResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting data from MySQL:', error);
    await connection.rollback();
    res.status(500).json({ message: 'Error deleting member information' });
  } finally {
    await connection.release();
  }
};
