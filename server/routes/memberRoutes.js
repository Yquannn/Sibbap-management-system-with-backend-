const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const dashboardController = require('../controllers/dashboardController');

// routes 
router.get('/total', dashboardController.getTotalMembers);

router.get('/members', memberController.getMembers);        
router.get('/members/:id', memberController.getMemberById); 
router.post('/members', memberController.addMember);       
router.put('/members/:id', memberController.updateMember); 
router.delete('/members/:id', memberController.deleteMember); 



router.use((err, req, res, next) => {
  console.error('Error:', err); 
  res.status(err.status || 500).json({ message: err.message || 'An error occurred while processing your request.' });
});


module.exports = router;
