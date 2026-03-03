import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentAPI } from '../services/api';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentAPI.getMyAssessments()
      .then(({ data }) => setAssessments(data))
      .catch(() => toast.error('Failed to load assessments'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, <span className="text-primary-600">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Track your career journey and explore new paths</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <div className="text-4xl font-bold mb-1">{assessments.length}</div>
            <div className="text-primary-200">Assessments Taken</div>
          </div>
          <div className="card bg-gradient-to-br from-accent-500 to-accent-600 text-white">
            <div className="text-4xl font-bold mb-1">
              {assessments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-purple-200">Completed</div>
          </div>
          <div className="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="text-4xl font-bold mb-1">
              {assessments[0]?.recommendations?.[0]?.matchPercentage || 0}%
            </div>
            <div className="text-emerald-200">Best Match</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link to="/assessment" className="card hover:shadow-lg transition-all group border-2 border-dashed border-primary-200 hover:border-primary-400 text-center py-10">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600">Start New Assessment</h3>
            <p className="text-gray-500">Take our AI-powered questionnaire to discover career recommendations</p>
          </Link>
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Recent Activity</h3>
            {loading ? (
              <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
            ) : assessments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No assessments yet. Take your first one!</div>
            ) : (
              <div className="space-y-3">
                {assessments.slice(0, 3).map((a) => (
                  <Link key={a._id} to={`/results/${a._id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors group">
                    <div>
                      <div className="font-semibold text-gray-800 group-hover:text-primary-700">
                        {a.recommendations?.[0]?.careerTitle || 'Assessment'}
                      </div>
                      <div className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {a.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Assessments */}
        {assessments.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">All Assessments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Top Career</th>
                    <th className="pb-3 font-semibold">Match %</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {assessments.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-600">{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 font-medium">{a.recommendations?.[0]?.careerTitle || '-'}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                            <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${a.recommendations?.[0]?.matchPercentage || 0}%` }}></div>
                          </div>
                          <span className="text-primary-600 font-semibold">{a.recommendations?.[0]?.matchPercentage || 0}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link to={`/results/${a._id}`} className="text-primary-600 hover:underline font-medium">View Results</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
