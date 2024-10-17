const db = require('../config/db');
// const multer = require('multer');
// const path = require('path');

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

const generateUniqueMemberId = async () => {
  const currentYear = new Date().getFullYear() % 100; 
  let uniqueId = `${currentYear}`; 

  const query = 'SELECT MAX(CAST(memberId AS UNSIGNED)) AS maxId FROM member_information WHERE memberId LIKE ?';
  const queryParams = [`${currentYear}%`]; 

  try {
    const results = await queryDatabase(query, queryParams);
    const maxId = results[0].maxId;
    const newId = maxId ? parseInt(maxId.toString().slice(2)) + 1 : 1;
    uniqueId += String(newId).padStart(4, '0'); 
    return uniqueId;
  } catch (error) {
    console.error('Error generating unique member ID:', error);
    throw new Error('Error generating unique member ID');
  }
};

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
  const id = req.params.id; 

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

  const query = 'SELECT * FROM member_information WHERE id = ?';

  try {
    const results = await queryDatabase(query, [id]); 
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
exports.addMember = [
  async (req, res) => {
    const { fullName, age, contactNumber, gender, address, sharedCapital, email, password, memberSince } = req.body;
    const idPicture = req.file ? req.file.filename : null; // This can be null if no file is uploaded
    const formattedMemberSince = memberSince ? formatDate(new Date(memberSince)) : formatDate(new Date());

    try {
      const memberId = await generateUniqueMemberId(); 
      const query = `
        INSERT INTO member_information 
        (memberId, fullName, age, contactNumber, gender, address, sharedCapital, memberSince, email, password, idPicture) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const queryParams = [
        memberId, fullName, age, contactNumber, gender, address, sharedCapital, formattedMemberSince, email, password, idPicture
      ];

      await queryDatabase(query, queryParams); // Await the insert operation
      res.status(201).json({ message: 'Member added successfully', idPicture });
    } catch (error) {
      console.error('Error inserting data into MySQL:', error);
      res.status(500).json({ message: 'Error inserting data into MySQL' });
    }
  }
];

// Controller to handle PUT requests to update a member
exports.updateMember = async (req, res) => {
  const id = req.params.id;
  const { fullName, age, contactNumber, gender, address, sharedCapital, email, password } = req.body;
  const idPicture = req.file ? req.file.filename : null; // Allow idPicture to be null if no file is uploaded

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

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
      password = ?, 
      idPicture = ?
    WHERE id = ?
  `;

  const queryParams = [fullName, age, contactNumber, gender, address, sharedCapital, email, password, idPicture, id];

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

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid member ID' });
  }

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
