// Weighted scoring algorithm for career matching
const calculateWeightedScores = (responses, careers) => {
  const scores = {};
  
  careers.forEach(career => {
    let score = 0;
    let maxScore = 0;
    
    // Interest matching (weight: 30%)
    const interestMatch = responses.interests.filter(i => 
      career.keywords.some(k => k.toLowerCase().includes(i.toLowerCase()) || 
      i.toLowerCase().includes(k.toLowerCase()))
    ).length;
    score += (interestMatch / Math.max(responses.interests.length, 1)) * 30;
    maxScore += 30;
    
    // Skills matching (weight: 35%)
    const skillMatch = responses.skills.filter(s => 
      career.requiredSkills.some(rs => rs.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(rs.toLowerCase()))
    ).length;
    score += (skillMatch / Math.max(responses.skills.length, 1)) * 35;
    maxScore += 35;
    
    // Academic performance bonus (weight: 15%)
    const acadBonus = { excellent: 15, good: 12, average: 8, below_average: 4 };
    score += acadBonus[responses.academicPerformance] || 8;
    maxScore += 15;
    
    // Industry demand factor (weight: 20%)
    score += ((career.industryDemand || 5) / 10) * 20;
    maxScore += 20;
    
    scores[career.title] = {
      rawScore: score,
      percentage: Math.min(Math.round((score / maxScore) * 100), 100),
    };
  });
  
  return scores;
};

module.exports = { calculateWeightedScores };
