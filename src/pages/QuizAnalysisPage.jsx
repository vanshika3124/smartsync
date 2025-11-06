import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiUsers, FiCheckCircle, FiTrendingUp, FiClock, FiChevronDown, FiExternalLink } from 'react-icons/fi';
// Import chart components
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- Helper Components ---

// 1. Stat Card
const StatCard = ({ title, value, icon, iconBg }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// 2. Top Performer Item
const TopPerformerItem = ({ rank, submission }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100">
    <div className="flex items-center gap-4">
      <span className="text-lg font-bold text-gray-400">#{rank}</span>
      <div>
        <p className="text-lg font-semibold text-gray-900">{submission.student.name}</p>
        <p className="text-sm text-gray-500">Submitted: {new Date(submission.submittedAt).toLocaleTimeString()}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xl font-bold text-green-600">{submission.totalScore} pts</p>
      <span className="text-sm text-gray-500">Score</span>
    </div>
  </div>
);

// --- 🚀🚀 AI INSIGHTS COMPONENT REMOVED ---

// --- Chart Data (Placeholders) ---
const pieChartData = {
  labels: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'],
  datasets: [
    {
      data: [20.8, 16.7, 25.0, 12.5, 25.0],
      backgroundColor: ['#6E56CF', '#D0021B', '#F5A623', '#4A90E2', '#50E3C2'],
      borderWidth: 0,
    },
  ],
};
const chartOptions = { plugins: { legend: { position: 'bottom' } } };


// --- Main Page Component ---
function QuizAnalysisPage() {
  const { quizId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;
  const LEADERBOARD_API_URL = "https://team-task-leaderboard.onrender.com";
  const JWT_TOKEN = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchData = async () => {
      if (!JWT_TOKEN) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setError(null);
      const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };

      try {
        const resultsRes = await axios.get(`${API_URL}/api/quiz/${quizId}/results`, apiConfig);
        if (resultsRes.data && Array.isArray(resultsRes.data.submissions)) {
          const sortedSubmissions = resultsRes.data.submissions.sort((a, b) => b.totalScore - a.totalScore);
          setSubmissions(sortedSubmissions);
        } else {
          setSubmissions([]);
        }
        setLeaderboard([]); 
      } catch (err) {
        console.error("Failed to load analysis data:", err);
        setError("Failed to load analysis data. Please check the APIs.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quizId, API_URL, JWT_TOKEN, navigate]);

  const getChartData = () => {
    const labels = submissions.map(sub => sub.student.name);
    const data = submissions.map(sub => sub.totalScore); 
    return {
      labels,
      datasets: [{
        label: 'Score',
        data,
        backgroundColor: '#4A90E2',
        borderRadius: 5,
      }],
    };
  };

  const getAverageScore = () => {
    if (submissions.length === 0) return 0;
    const total = submissions.reduce((sum, sub) => sum + sub.totalScore, 0);
    return (total / submissions.length).toFixed(1);
  };

  if (loading) return <main className="flex-1 p-10 text-center"><p>Loading Analysis...</p></main>;
  if (error) return <main className="flex-1 p-10 text-center text-red-500"><p>{error}</p></main>;

  const topPerformers = submissions.slice(0, 6); 
  // --- 🚀🚀 AI INSIGHTS DATA ARRAY REMOVED ---

  return (
    <main className="flex-1 p-8 md:p-12" style={{ backgroundColor: '#F0F7FF' }}>
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Teachers dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back, {JSON.parse(localStorage.getItem('user'))?.name || 'Teacher'}</p>
      </div>

      <div className="flex border-b border-gray-300 mb-8">
        <Link to="/dashboard" className="py-3 px-5 text-gray-600 font-medium">My Quizzes</Link>
        <span className="py-3 px-5 text-blue-600 font-semibold border-b-2 border-blue-600">Analytics</span>
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Performance Analysis</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value={submissions.length}
          icon={<FiUsers className="text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCard 
          title="Class Average" 
          value={`${getAverageScore()} pts`}
          icon={<FiCheckCircle className="text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard 
          title="Improving" 
          value={2} // TODO
          icon={<FiTrendingUp className="text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
        <StatCard 
          title="Avg Time/Question" 
          value={"26s"} // TODO
          icon={<FiClock className="text-purple-600" />}
          iconBg="bg-purple-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4">Student Performance Distribution</h3>
          <Bar data={getChartData()} options={{ plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4">Topic Strength Analysis</h3>
          <Pie data={pieChartData} options={chartOptions} />
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="font-semibold text-xl mb-4">Top Performers</h3>
        <div>
          {topPerformers.length > 0 ? (
            topPerformers.map((submission, index) => (
              <TopPerformerItem 
                key={submission._id}
                rank={index + 1}
                submission={submission}
              />
            ))
          ) : (
            <p>No submissions yet for this quiz.</p>
          )}
        </div>
      </div>

      {/* --- 🚀🚀 AI INSIGHTS SECTION REMOVED --- */}

    </main>
  );
}

export default QuizAnalysisPage;