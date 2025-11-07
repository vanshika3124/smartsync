import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { FiUsers, FiCheckCircle, FiTrendingUp, FiClock, FiAward, FiBarChart2, FiPieChart } from 'react-icons/fi';
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

// --- 🚀🚀 YEH NAYA COMPONENT HAI 🚀🚀 ---
// 2. Smart Leaderboard Item (for predicted scores)
const LeaderboardItem = ({ rank, student }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100">
    <div className="flex items-center gap-4">
      <span className="text-lg font-bold text-gray-400">#{rank}</span>
      <div>
        <p className="text-lg font-semibold text-gray-900">{student.name}</p>
        <p className="text-sm text-gray-500">Student ID: {student.studentId}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xl font-bold text-blue-600">{student.predictedScore.toFixed(2)}%</p>
      <span className="text-sm text-gray-500">Predicted Score</span>
    </div>
  </div>
);
// --- End of New Component ---

// --- 🚀🚀 YEH UPDATED COMPONENT HAI 🚀🚀 ---
// 3. Full Submission Item (for actual results)
const SubmissionItem = ({ submission }) => (
  <tr className="border-b border-gray-200">
    <td className="py-3 px-4 font-medium text-gray-900">{submission.student.name}</td>
    <td className="py-3 px-4 text-gray-600">{submission.student.email}</td>
    <td className="py-3 px-4 font-semibold text-green-600">{submission.totalScore} pts</td>
    {/* Check if predictedScore exists before showing */}
    <td className="py-3 px-4 font-semibold text-blue-600">
      {submission.predictedScore ? `${submission.predictedScore.toFixed(1)} pts` : 'N/A'}
    </td>
  </tr>
);
// --- End of Update ---


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
  const [leaderboardError, setLeaderboardError] = useState(null);
  const navigate = useNavigate();

  // --- 🚀🚀 YEH HAI ASLI FIX 🚀🚀 ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setLeaderboardError(null);

      // Dono APIs ko ek saath call karo
      const resultsPromise = api.get(`/api/quiz/${quizId}/results`);
      const leaderboardPromise = api.get(`/api/quiz/${quizId}/leaderboard`);

      const [resultsRes, leaderboardRes] = await Promise.allSettled([
        resultsPromise,
        leaderboardPromise
      ]);

      // 1. Handle Results
      if (resultsRes.status === 'fulfilled' && resultsRes.value.data && Array.isArray(resultsRes.value.data.submissions)) {
        const sortedSubmissions = resultsRes.value.data.submissions.sort((a, b) => b.totalScore - a.totalScore);
        setSubmissions(sortedSubmissions);
      } else {
        console.error("Failed to load results:", resultsRes.reason);
        setError("Failed to load submissions.");
      }
      
      // 2. Handle Leaderboard
      if (leaderboardRes.status === 'fulfilled' && leaderboardRes.value.data && Array.isArray(leaderboardRes.value.data.leaderboard)) {
        setLeaderboard(leaderboardRes.value.data.leaderboard);
      } else {
        console.error("Failed to load leaderboard:", leaderboardRes.reason);
        setLeaderboardError("Failed to load leaderboard (API 404 or Error).");
      }

      setLoading(false);
    };
    fetchData();
  }, [quizId, navigate]);
  // --- End of Fix ---

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
  if (error && submissions.length === 0) return <main className="flex-1 p-10 text-center text-red-500"><p>{error}</p></main>;

  const topPerformers = submissions.slice(0, 6); 

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Submissions" 
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
          value={"N/A"} 
          icon={<FiTrendingUp className="text-yellow-600" />}
          iconBg="bg-yellow-100"
        />
        <StatCard 
          title="Avg Time/Question" 
          value={"N/A"} 
          icon={<FiClock className="text-purple-600" />}
          iconBg="bg-purple-100"
        />
      </div>

      {/* --- 🚀🚀 ML LEADERBOARD SECTION ADDED 🚀🚀 --- */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Smart Leaderboard (Top 3 Predictions)</h2>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
           <div className="flex items-center gap-2 mb-4">
              <FiAward className="text-yellow-500" />
              <h3 className="font-semibold text-xl">Top Predicted Performers</h3>
           </div>
           {loading && <p>Loading leaderboard...</p>}
           {leaderboardError && <p className="text-red-500">{leaderboardError}</p>}
           {!loading && !leaderboardError && (
             <ol className="space-y-2">
               {leaderboard.length > 0 ? (
                 leaderboard.map((student, index) => (
                   <LeaderboardItem key={student.studentId || index} student={student} rank={index + 1} />
                 ))
               ) : (
                 <p className="text-gray-500">No leaderboard data available yet.</p>
               )}
             </ol>
           )}
        </div>
      </section>
      {/* --- End of Section --- */}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4">Student Performance Distribution (Actual Scores)</h3>
          <Bar data={getChartData()} options={{ plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4">Topic Strength Analysis (Placeholder)</h3>
          <Pie data={pieChartData} options={chartOptions} />
        </div>
      </div>

      {/* --- 🚀🚀 FULL RESULTS TABLE UPDATED 🚀🚀 --- */}
      <section className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="font-semibold text-xl mb-4">All Submissions</h3>
        {error && !submissions.length && <p className="text-red-500">{error}</p>}
        {submissions.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4 font-semibold text-gray-600">Student Name</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Email</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Actual Score</th>
                <th className="py-3 px-4 font-semibold text-gray-600">Predicted Score</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <SubmissionItem 
                  key={submission._id}
                  submission={submission}
                />
              ))}
            </tbody>
          </table>
        ) : (
          !loading && !error && <p>No submissions yet for this quiz.</p>
        )}
      </section>

    </main>
  );
}

export default QuizAnalysisPage;