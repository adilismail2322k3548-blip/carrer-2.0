import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import toast from 'react-hot-toast';

const ResultsPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    assessmentAPI.getById(id)
      .then(({ data }) => setAssessment(data))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">Analyzing your profile...</p>
      </div>
    </div>
  );

  if (!assessment) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-xl">Assessment not found</p>
      <Link to="/dashboard" className="btn-primary mt-4 inline-block">Back to Dashboard</Link>
    </div>
  );

  const { recommendations } = assessment;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Career Recommendations</h1>
          <p className="text-gray-500 text-lg">Powered by AI analysis of your unique profile</p>
        </div>

        {/* Career Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {recommendations.map((rec, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 px-5 py-3 rounded-xl font-semibold transition-all ${
                activeTab === i
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}>
              {i + 1}. {rec.careerTitle}
              <span className={`ml-2 text-sm ${activeTab === i ? 'text-primary-100' : 'text-primary-600'}`}>
                {rec.matchPercentage}%
              </span>
            </button>
          ))}
        </div>

        {/* Active Career Card */}
        {recommendations[activeTab] && (
          <div className="space-y-6">
            {/* Match Score */}
            <div className="card bg-gradient-to-br from-primary-600 to-accent-600 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-sm font-medium text-primary-200 mb-1">#{activeTab + 1} Career Match</div>
                  <h2 className="text-3xl font-bold mb-2">{recommendations[activeTab].careerTitle}</h2>
                  <p className="text-primary-100">{recommendations[activeTab].reasoning}</p>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="10"
                        strokeDasharray={`${recommendations[activeTab].matchPercentage * 2.51} 251`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{recommendations[activeTab].matchPercentage}%</span>
                      <span className="text-xs text-primary-200">Match</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Required Skills */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>💪</span> Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations[activeTab].requiredSkills?.map((skill, i) => (
                    <span key={i} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📈</span> Skill Gap Analysis
                </h3>
                <div className="space-y-2">
                  {recommendations[activeTab].skillGapAnalysis?.map((gap, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-500 mt-0.5">⚠️</span> {gap}
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Roadmap */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🗺️</span> Learning Roadmap
                </h3>
                <ol className="space-y-2">
                  {recommendations[activeTab].learningRoadmap?.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Future Scope */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🔮</span> Future Scope
                </h3>
                <p className="text-gray-700 leading-relaxed">{recommendations[activeTab].futureScope}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Confidence Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${recommendations[activeTab].confidenceScore}%` }}></div>
                      </div>
                      <span className="font-semibold text-emerald-600">
                        {recommendations[activeTab].confidenceScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Link to="/assessment" className="btn-primary">Take New Assessment</Link>
          <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
