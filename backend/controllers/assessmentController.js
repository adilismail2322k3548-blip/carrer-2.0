const Assessment = require('../models/Assessment');
const Career = require('../models/Career');
const { generateCareerRecommendations } = require('../services/groqService');
const { calculateWeightedScores } = require('../services/scoringService');

const submitAssessment = async (req, res) => {
  try {
    const { responses } = req.body;
    
    // Get all active careers for scoring
    const careers = await Career.find({ isActive: true });
    
    // Calculate weighted scores
    const weightedScores = calculateWeightedScores(responses, careers);
    
    // Generate AI recommendations
    const recommendations = await generateCareerRecommendations(responses, weightedScores);
    
    // Save assessment
    const assessment = await Assessment.create({
      userId: req.user._id,
      responses,
      recommendations,
      status: 'completed',
    });
    
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitAssessment, getMyAssessments, getAssessmentById };
