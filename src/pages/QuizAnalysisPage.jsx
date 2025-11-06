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
const TopPerformerItem = ({ rank, name, score, quizzes, time }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100">
    <div className="flex items-center gap-4">
      <span className="text-lg font-bold text-gray-400">#{rank}</span>
      <div>
        <p className="text-lg font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{quizzes} quizzes completed - {time} avg time</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xl font-bold text-green-600">{score}%</p>
      <span className="text-sm text-gray-500">High Score</span>
    </div>
  </div>
);

// 3. AI Student Insight Item
const StudentInsightItem = ({ name, avgScore, strongTopics, weakTopics, status }) => {
  const statusColor = status === 'Improving' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50';
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-xl font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{avgScore}% average</p>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusColor}`}>{status}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-gray-700 mb-2">Strong Topics</p>
          <div className="flex flex-wrap gap-2">
            {strongTopics.map(topic => (
              <span key={topic} className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">{topic}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-2">Needs Improvement</p>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map(topic => (
              <span key={topic} className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">{topic}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Chart Data (Placeholders) ---
// TODO: Replace with data from your analysis API
const barChartData = {
  labels: ['Aarav', 'Diya', 'Ishan', 'Meera', 'Riya', 'Vivaan'],
  datasets: [
    {
      label: 'Average Score %',
      data: [85, 70, 88, 86, 82, 87],
      backgroundColor: '#4A90E2', // Blue color
      borderRadius: 5,
    },
  ],
};

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
  const [analysisData, setAnalysisData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_BACKEND_URL;
  const LEADERBOARD_API_URL = "https://team-task-leaderboard.onrender.com";
  const JWT_TOKEN = localStorage.getItem('token');
  const apiConfig = { headers: { Authorization: `Bearer ${JWT_TOKEN}` } };

  useEffect(() => {
    const fetchData = async () => {
      if (!JWT_TOKEN) {
        navigate('/login');
        return;
      }
      setLoading(true);
      setError(null);

      try {
        // --- TODO: Confirm this API endpoint ---
        // Fetching main analysis data (for stats, charts)
        const analysisRes = await axios.get(`${API_URL}/api/quiz/${quizId}/analysis`, apiConfig);
        setAnalysisData(analysisRes.data);

        // Fetch Smart Leaderboard data
        // --- TODO: Confirm this endpoint and body ---
        const leaderboardRes = await axios.post(
          `${LEADERBOARD_API_URL}/leaderboard`,
          { quizId: quizId }, // Assuming it needs quizId
          { headers: { Authorization: `Bearer ${JWT_TOKEN}` } }
        );
        setLeaderboard(leaderboardRes.data.leaderboard || []);

      } catch (err) {
        console.error("Failed to load analysis data:", err);
        setError("Failed to load analysis data. Please check the APIs.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quizId, API_URL, JWT_TOKEN, navigate]);

  if (loading) return <p className="p-10 text-center">Loading Analysis...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  // Use dummy data if API fails or is not ready
  const data = analysisData || {}; 
  const topPerformers = leaderboard.length > 0 ? leaderboard : [
    { name: 'Aarav', score: 92.3, quizzes: 6, time: '8s' },
    { name: 'Diya', score: 87.5, quizzes: 6, time: '10s' },
  ];
  const aiInsights = data.aiInsights || [
     { name: 'Aarav', avgScore: 87.5, strongTopics: ['Unit 1', 'Unit 3'], weakTopics: ['Unit 2'], status: 'Improving' },
     { name: 'Diya', avgScore: 75.2, strongTopics: ['Unit 1', 'Unit 5'], weakTopics: ['Unit 3', 'Unit 4'], status: 'Stable' },
  ];

  return (
    <>
      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12" style={{ backgroundColor: '#F0F7FF' }}>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Teachers dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, Mrs. Anjali Singh</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-300 mb-8">
          <Link to="/dashboard" className="py-3 px-5 text-gray-600 font-medium">My Quizzes</Link>
          <span className="py-3 px-5 text-blue-600 font-semibold border-b-2 border-blue-600">Analytics</span>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Performance Analysis</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Students" 
            value={data.totalStudents || 5} 
            icon={<FiUsers className="text-blue-600" />}
            iconBg="bg-blue-100"
          />
          <StatCard 
            title="Class Average" 
            value={`${data.classAverage || 81.0}%`}
            icon={<FiCheckCircle className="text-green-600" />}
            iconBg="bg-green-100"
          />
          <StatCard 
            title="Improving" 
            value={data.improving || 2} 
            icon={<FiTrendingUp className="text-yellow-600" />}
            iconBg="bg-yellow-100"
          />
          <StatCard 
            title="Avg Time/Question" 
            value={`${data.avgTime || 26}s`}
            icon={<FiClock className="text-purple-600" />}
            iconBg="bg-purple-100"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-semibold mb-4">Student Performance Distribution</h3>
            <Bar data={barChartData} options={{ plugins: { legend: { display: false } } }} />
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
            {topPerformers.map((student, index) => (
              <TopPerformerItem 
                key={index}
                rank={index + 1}
                name={student.name}
                score={student.score}
                quizzes={student.quizzes}
                time={student.time}
              />
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <h3 className="font-semibold text-xl mb-4">AI-Powered Student Insights</h3>
          <div className="space-y-6">
            {aiInsights.map((student, index) => (
              <StudentInsightItem 
                key={index}
                name={student.name}
                avgScore={student.avgScore}
                strongTopics={student.strongTopics}
                weakTopics={student.weakTopics}
                status={student.status}
              />
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-gray-300 p-8 md:p-12 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Contact us</h4>
            <p className="text-sm">Email : smartsync@help.in</p>
            <p className="text-sm">Call : 70372XXXXX</p>
            <div className="flex gap-4 mt-4">
              {/* Social Icons Here */}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:text-white">Teachers dashboard</Link></li>
              <li><Link to="/create-quiz" className="hover:text-white">Create a quiz</Link></li>
              <li><Link to="/faqs" className="hover:text-white">FAQs</Link></li>
              <li><Link to="#" className="hover:text-white">Terms and Conditions</Link></li>
              <li><Link to="/register" className="hover:text-white">Signup</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Address</h4>
            <p className="text-sm">
              C/1, SpringField, Corporate Park, Bandra-Kurla Complex, Bandra (East), Mumbai, 400051
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>@ SmartSync</p>
        </div>
      </footer>
    </>
  );
}

export default QuizAnalysisPage;