import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import toast from 'react-hot-toast';

const QUESTIONS = [
  { id: 'interests', label: 'What are your interests?', type: 'multiselect',
    options: ['Technology', 'Science', 'Arts', 'Business', 'Healthcare', 'Education', 'Finance', 'Engineering', 'Sports', 'Music', 'Writing', 'Environment'] },
  { id: 'skills', label: 'What skills do you have?', type: 'multiselect',
    options: ['Programming', 'Communication', 'Leadership', 'Analysis', 'Design', 'Mathematics', 'Research', 'Marketing', 'Problem Solving', 'Creativity', 'Teamwork', 'Public Speaking'] },
  { id: 'strengths', label: 'What are your key strengths?', type: 'multiselect',
    options: ['Critical thinking', 'Attention to detail', 'Fast learner', 'Empathy', 'Organization', 'Adaptability', 'Persistence', 'Innovation'] },
  { id: 'weaknesses', label: 'What are your weaknesses? (be honest)', type: 'multiselect',
    options: ['Public speaking', 'Time management', 'Networking', 'Technical skills', 'Mathematics', 'Writing', 'Patience', 'Confidence'] },
  { id: 'academicPerformance', label: 'How would you rate your academic performance?', type: 'select',
    options: [{ value: 'excellent', label: 'Excellent (A grades)' }, { value: 'good', label: 'Good (B grades)' }, { value: 'average', label: 'Average (C grades)' }, { value: 'below_average', label: 'Below Average' }] },
  { id: 'personalityTraits', label: 'Which personality traits describe you?', type: 'multiselect',
    options: ['Introvert', 'Extrovert', 'Analytical', 'Creative', 'Detail-oriented', 'Big-picture thinker', 'Competitive', 'Collaborative', 'Independent'] },
  { id: 'preferredSubjects', label: 'What are your preferred subjects?', type: 'multiselect',
    options: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Literature', 'Economics', 'Psychology', 'Art & Design', 'Physical Education', 'Languages'] },
  { id: 'workStyle', label: 'What is your preferred work style?', type: 'select',
    options: [{ value: 'collaborative', label: 'Team-oriented / Collaborative' }, { value: 'independent', label: 'Independent / Solo work' }, { value: 'mixed', label: 'Mix of both' }] },
  { id: 'careerGoals', label: 'Describe your career goals or dreams', type: 'textarea',
    placeholder: 'E.g., I want to build impactful products, help people through medicine, become an entrepreneur...' },
];

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({
    interests: [], skills: [], strengths: [], weaknesses: [],
    academicPerformance: '', personalityTraits: [], preferredSubjects: [],
    workStyle: '', careerGoals: '',
  });
  const [loading, setLoading] = useState(false);

  const currentQ = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const toggleMultiselect = (field, value) => {
    setResponses(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const isStepValid = () => {
    const val = responses[currentQ.id];
    if (currentQ.type === 'multiselect') return val.length > 0;
    if (currentQ.type === 'select') return val !== '';
    if (currentQ.type === 'textarea') return val.trim().length > 10;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await assessmentAPI.submit({ responses });
      toast.success('Assessment completed! Generating your recommendations...');
      navigate(`/results/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit assessment');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-600">Question {step + 1} of {QUESTIONS.length}</span>
            <span className="text-sm font-semibold text-primary-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQ.label}</h2>

          {currentQ.type === 'multiselect' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentQ.options.map((opt) => (
                <button key={opt} onClick={() => toggleMultiselect(currentQ.id, opt)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    responses[currentQ.id].includes(opt)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'select' && (
            <div className="space-y-3">
              {currentQ.options.map((opt) => (
                <button key={opt.value} onClick={() => setResponses({...responses, [currentQ.id]: opt.value})}
                  className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${
                    responses[currentQ.id] === opt.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'textarea' && (
            <textarea className="input-field h-32 resize-none" placeholder={currentQ.placeholder}
              value={responses[currentQ.id]}
              onChange={(e) => setResponses({...responses, [currentQ.id]: e.target.value})} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed">
            ← Previous
          </button>
          
          {step < QUESTIONS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!isStepValid()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!isStepValid() || loading}
              className="btn-primary disabled:opacity-40 flex items-center gap-2">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Analyzing...</>
              ) : '🚀 Get My Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
