const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/members/total', dashboardController.getTotalMembers);

router.use((err, req, res, next) => {
  console.error('Error:', err); 
  res.status(err.status || 500).json({ message: err.message || 'An error occurred while processing your request.' });
});


module.exports = router;