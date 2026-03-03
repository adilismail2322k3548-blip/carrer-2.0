const Career = require('../models/Career');

const getCareers = async (req, res) => {
  try {
    const careers = await Career.find({ isActive: true });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Career not found' });
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCareers, getCareerById };
