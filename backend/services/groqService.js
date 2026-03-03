const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateCareerRecommendations = async (assessmentData, weightedScores) => {
  const prompt = `You are an expert career counselor. Based on the following student assessment data and preliminary scores, provide exactly 3 career recommendations.

Student Assessment:
- Interests: ${assessmentData.interests.join(', ')}
- Skills: ${assessmentData.skills.join(', ')}
- Strengths: ${assessmentData.strengths.join(', ')}
- Weaknesses: ${assessmentData.weaknesses.join(', ')}
- Academic Performance: ${assessmentData.academicPerformance}
- Personality Traits: ${assessmentData.personalityTraits.join(', ')}
- Preferred Subjects: ${assessmentData.preferredSubjects.join(', ')}
- Work Style: ${assessmentData.workStyle}
- Career Goals: ${assessmentData.careerGoals}

Preliminary Weighted Scores:
${JSON.stringify(weightedScores, null, 2)}

Respond with ONLY a valid JSON array containing exactly 3 career objects with this exact structure:
[
  {
    "careerTitle": "string",
    "matchPercentage": number (0-100),
    "confidenceScore": number (0-100),
    "reasoning": "string explaining why this career fits",
    "requiredSkills": ["skill1", "skill2", "skill3"],
    "skillGapAnalysis": ["gap1", "gap2"],
    "learningRoadmap": ["step1", "step2", "step3"],
    "futureScope": "string describing future prospects"
  }
]

Return ONLY the JSON array, no additional text.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No valid JSON array found in response');
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Groq API Error:', error);
    // Return fallback recommendations if AI fails
    return getFallbackRecommendations(assessmentData);
  }
};

const getFallbackRecommendations = (assessmentData) => {
  return [
    {
      careerTitle: 'Software Engineer',
      matchPercentage: 75,
      confidenceScore: 70,
      reasoning: 'Based on your technical interests and analytical skills',
      requiredSkills: ['Programming', 'Problem Solving', 'System Design'],
      skillGapAnalysis: ['Advanced algorithms', 'Cloud computing'],
      learningRoadmap: ['Learn core programming', 'Build projects', 'Get certified'],
      futureScope: 'High demand with excellent growth prospects in the tech industry',
    },
    {
      careerTitle: 'Data Analyst',
      matchPercentage: 68,
      confidenceScore: 65,
      reasoning: 'Your analytical strengths align well with data analysis',
      requiredSkills: ['Statistics', 'SQL', 'Data Visualization'],
      skillGapAnalysis: ['Machine learning basics', 'Python for data science'],
      learningRoadmap: ['Learn SQL', 'Study statistics', 'Master visualization tools'],
      futureScope: 'Growing field with applications across all industries',
    },
    {
      careerTitle: 'Product Manager',
      matchPercentage: 60,
      confidenceScore: 58,
      reasoning: 'Your leadership traits and broad interests suit product management',
      requiredSkills: ['Communication', 'Strategic thinking', 'Technical understanding'],
      skillGapAnalysis: ['Agile methodology', 'Market research'],
      learningRoadmap: ['Study product management frameworks', 'Build portfolio', 'Network'],
      futureScope: 'High-impact role with strong salary and growth potential',
    },
  ];
};

module.exports = { generateCareerRecommendations };
