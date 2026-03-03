const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, createCareer, updateCareer, deleteCareer, seedCareers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.post('/careers', protect, adminOnly, createCareer);
router.put('/careers/:id', protect, adminOnly, updateCareer);
router.delete('/careers/:id', protect, adminOnly, deleteCareer);
router.post('/seed-careers', protect, adminOnly, seedCareers);

module.exports = router;
