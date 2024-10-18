const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route to get total members
router.get('/total', dashboardController.getTotalMembers);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Error:', err.stack);  // Log the full error stack for better debugging
  res.status(err.status || 500).json({
    message: err.message || 'An error occurred while processing your request.',
  });
});

module.exports = router;
