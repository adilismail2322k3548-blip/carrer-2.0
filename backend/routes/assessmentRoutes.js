const express = require('express');
const router = express.Router();
const { submitAssessment, getMyAssessments, getAssessmentById } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', protect, submitAssessment);
router.get('/my', protect, getMyAssessments);
router.get('/:id', protect, getAssessmentById);

module.exports = router;
