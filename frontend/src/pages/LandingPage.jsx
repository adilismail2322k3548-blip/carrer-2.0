import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium">AI-Powered Career Guidance</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Dream Career
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-10 leading-relaxed">
              Get personalized career recommendations powered by advanced AI. 
              Answer a few questions and unlock your professional potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={user ? "/assessment" : "/register"}
                className="bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Free Assessment →
              </Link>
              <Link
                to="/login"
                className="bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-500">Three simple steps to your ideal career path</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '📝', step: '01', title: 'Take Assessment', desc: 'Complete our comprehensive questionnaire about your interests, skills, and academic background.' },
            { icon: '🤖', step: '02', title: 'AI Analysis', desc: 'Our AI engine analyzes your responses using advanced algorithms to find the best career matches.' },
            { icon: '🚀', step: '03', title: 'Get Recommendations', desc: 'Receive detailed career recommendations with roadmaps, skill gaps, and future scope analysis.' },
          ].map((item) => (
            <div key={item.step} className="card text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-xs font-bold text-primary-500 tracking-widest uppercase mb-2">Step {item.step}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50+', label: 'Career Paths' },
              { value: '95%', label: 'Satisfaction Rate' },
              { value: 'AI', label: 'Powered by Groq' },
              { value: '24/7', label: 'Available' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
                <div className="text-primary-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Find Your Path?</h2>
        <p className="text-xl text-gray-500 mb-8">Join thousands of students who've discovered their perfect career</p>
        <Link to={user ? "/assessment" : "/register"} className="btn-primary text-lg px-10 py-4">
          Get Started for Free
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © 2024 CareerAI. Built with React & Groq AI.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
