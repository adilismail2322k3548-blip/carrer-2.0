import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [careerForm, setCareerForm] = useState({ title: '', description: '', category: '', requiredSkills: '', keywords: '', averageSalary: '', growthProspects: '', industryDemand: 5 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminAPI.getStats().then(({ data }) => setStats(data)).catch(console.error);
    adminAPI.getUsers().then(({ data }) => setUsers(data)).catch(console.error);
  }, []);

  const handleSeedCareers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.seedCareers();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to seed careers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCareer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.createCareer({
        ...careerForm,
        requiredSkills: careerForm.requiredSkills.split(',').map(s => s.trim()),
        keywords: careerForm.keywords.split(',').map(k => k.trim()),
        industryDemand: Number(careerForm.industryDemand),
      });
      toast.success('Career added successfully!');
      setCareerForm({ title: '', description: '', category: '', requiredSkills: '', keywords: '', averageSalary: '', growthProspects: '', industryDemand: 5 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add career');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage the CareerAI system</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {['overview', 'users', 'careers'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 font-semibold capitalize transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Students', value: stats.totalUsers, icon: '👥', color: 'from-blue-500 to-blue-600' },
                { label: 'Total Assessments', value: stats.totalAssessments, icon: '📋', color: 'from-purple-500 to-purple-600' },
                { label: 'Completed', value: stats.completedAssessments, icon: '✅', color: 'from-green-500 to-green-600' },
                { label: 'Career Options', value: stats.totalCareers, icon: '💼', color: 'from-orange-500 to-orange-600' },
              ].map((s) => (
                <div key={s.label} className={`card bg-gradient-to-br ${s.color} text-white`}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-3xl font-bold mb-1">{s.value}</div>
                  <div className="text-sm opacity-80">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <button onClick={handleSeedCareers} disabled={loading}
                className="btn-primary mr-4 flex items-center gap-2 inline-flex">
                {loading ? 'Seeding...' : '🌱 Seed Career Data'}
              </button>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Registered Students ({users.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium">{u.name}</td>
                      <td className="py-3 text-gray-600">{u.email}</td>
                      <td className="py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Careers Tab */}
        {tab === 'careers' && (
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-6">Add New Career</h3>
            <form onSubmit={handleAddCareer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Career Title *</label>
                  <input className="input-field" placeholder="e.g., Machine Learning Engineer" required
                    value={careerForm.title} onChange={e => setCareerForm({...careerForm, title: e.target.value})} />
                </div>
                <div>
                  <label className="label">Category</label>
                  <input className="input-field" placeholder="e.g., Technology"
                    value={careerForm.category} onChange={e => setCareerForm({...careerForm, category: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Description</label>
                  <textarea className="input-field h-20 resize-none" placeholder="Brief description"
                    value={careerForm.description} onChange={e => setCareerForm({...careerForm, description: e.target.value})} />
                </div>
                <div>
                  <label className="label">Required Skills (comma-separated)</label>
                  <input className="input-field" placeholder="Python, ML, Statistics"
                    value={careerForm.requiredSkills} onChange={e => setCareerForm({...careerForm, requiredSkills: e.target.value})} />
                </div>
                <div>
                  <label className="label">Keywords (comma-separated)</label>
                  <input className="input-field" placeholder="AI, data, algorithms"
                    value={careerForm.keywords} onChange={e => setCareerForm({...careerForm, keywords: e.target.value})} />
                </div>
                <div>
                  <label className="label">Average Salary</label>
                  <input className="input-field" placeholder="$80,000 - $130,000"
                    value={careerForm.averageSalary} onChange={e => setCareerForm({...careerForm, averageSalary: e.target.value})} />
                </div>
                <div>
                  <label className="label">Industry Demand (1-10): {careerForm.industryDemand}</label>
                  <input type="range" min="1" max="10" className="w-full mt-2"
                    value={careerForm.industryDemand} onChange={e => setCareerForm({...careerForm, industryDemand: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Adding...' : '+ Add Career'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
