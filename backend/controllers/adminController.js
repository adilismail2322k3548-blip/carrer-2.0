const Career = require('../models/Career');
const User = require('../models/User');
const Assessment = require('../models/Assessment');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalAssessments = await Assessment.countDocuments();
    const completedAssessments = await Assessment.countDocuments({ status: 'completed' });
    const totalCareers = await Career.countDocuments();
    
    res.json({ totalUsers, totalAssessments, completedAssessments, totalCareers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCareer = async (req, res) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json(career);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!career) return res.status(404).json({ message: 'Career not found' });
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCareer = async (req, res) => {
  try {
    await Career.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Career deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const seedCareers = async (req, res) => {
  try {
    const count = await Career.countDocuments();
    if (count > 0) return res.json({ message: 'Careers already seeded' });
    
    const careers = [
      { title: 'Software Engineer', description: 'Develop software applications', category: 'Technology', requiredSkills: ['Programming', 'Problem Solving', 'Algorithms', 'Data Structures'], keywords: ['coding', 'programming', 'technology', 'software', 'development', 'computers'], averageSalary: '$95,000 - $150,000', growthProspects: 'Excellent', educationPath: ['Computer Science degree', 'Coding bootcamp', 'Self-learning'], industryDemand: 9 },
      { title: 'Data Scientist', description: 'Analyze complex data to derive insights', category: 'Technology', requiredSkills: ['Statistics', 'Machine Learning', 'Python', 'SQL', 'Data Visualization'], keywords: ['data', 'analytics', 'statistics', 'mathematics', 'research', 'AI'], averageSalary: '$100,000 - $160,000', growthProspects: 'Excellent', educationPath: ['Statistics degree', 'Data Science bootcamp', 'Online courses'], industryDemand: 9 },
      { title: 'UX/UI Designer', description: 'Design user-friendly digital interfaces', category: 'Design', requiredSkills: ['Design thinking', 'Prototyping', 'User research', 'Visual design'], keywords: ['design', 'creativity', 'art', 'visual', 'user experience', 'interface'], averageSalary: '$70,000 - $120,000', growthProspects: 'Good', educationPath: ['Design degree', 'UX certification', 'Portfolio building'], industryDemand: 8 },
      { title: 'Cybersecurity Analyst', description: 'Protect digital systems from threats', category: 'Technology', requiredSkills: ['Network security', 'Ethical hacking', 'Risk assessment', 'Cryptography'], keywords: ['security', 'hacking', 'networks', 'protection', 'cyber', 'technology'], averageSalary: '$85,000 - $140,000', growthProspects: 'Excellent', educationPath: ['IT Security degree', 'Security certifications', 'Practical labs'], industryDemand: 10 },
      { title: 'Product Manager', description: 'Lead product development and strategy', category: 'Business', requiredSkills: ['Strategic thinking', 'Communication', 'Leadership', 'Market research'], keywords: ['leadership', 'strategy', 'business', 'management', 'products', 'planning'], averageSalary: '$90,000 - $150,000', growthProspects: 'Good', educationPath: ['Business degree', 'MBA', 'PM certifications'], industryDemand: 8 },
      { title: 'Digital Marketing Specialist', description: 'Drive digital marketing campaigns', category: 'Marketing', requiredSkills: ['SEO/SEM', 'Social media', 'Content creation', 'Analytics'], keywords: ['marketing', 'social media', 'content', 'advertising', 'communication', 'creative'], averageSalary: '$55,000 - $90,000', growthProspects: 'Good', educationPath: ['Marketing degree', 'Digital marketing courses', 'Certifications'], industryDemand: 7 },
      { title: 'Financial Analyst', description: 'Analyze financial data and trends', category: 'Finance', requiredSkills: ['Financial modeling', 'Excel', 'Accounting', 'Economic analysis'], keywords: ['finance', 'economics', 'numbers', 'analysis', 'banking', 'investment'], averageSalary: '$70,000 - $120,000', growthProspects: 'Good', educationPath: ['Finance degree', 'CFA certification', 'MBA'], industryDemand: 7 },
      { title: 'Healthcare Administrator', description: 'Manage healthcare facilities and services', category: 'Healthcare', requiredSkills: ['Healthcare management', 'Leadership', 'Compliance', 'Budgeting'], keywords: ['healthcare', 'medical', 'management', 'helping', 'administration', 'hospital'], averageSalary: '$65,000 - $110,000', growthProspects: 'Excellent', educationPath: ['Healthcare Administration degree', 'MHA degree', 'Certifications'], industryDemand: 8 },
    ];
    
    await Career.insertMany(careers);
    res.json({ message: 'Careers seeded successfully', count: careers.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getAllUsers, createCareer, updateCareer, deleteCareer, seedCareers };
