const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  requiredSkills: [String],
  keywords: [String],
  averageSalary: String,
  growthProspects: String,
  educationPath: [String],
  industryDemand: { type: Number, min: 1, max: 10 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
