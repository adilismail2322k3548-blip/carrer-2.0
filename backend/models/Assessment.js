const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: {
    interests: [String],
    skills: [String],
    strengths: [String],
    weaknesses: [String],
    academicPerformance: { type: String, enum: ['excellent', 'good', 'average', 'below_average'] },
    personalityTraits: [String],
    preferredSubjects: [String],
    workStyle: { type: String, enum: ['collaborative', 'independent', 'mixed'] },
    careerGoals: String,
  },
  recommendations: [{
    careerTitle: String,
    matchPercentage: Number,
    confidenceScore: Number,
    reasoning: String,
    requiredSkills: [String],
    skillGapAnalysis: [String],
    learningRoadmap: [String],
    futureScope: String,
  }],
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
