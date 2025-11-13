import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { FiUsers, FiCheckCircle, FiAward } from 'react-icons/fi'; 
import { Bar } from 'react-chartjs-2';
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

// --- Skeleton Loader ---
const AnalysisSkeleton = () => (
  // --- 🚀 FIX: Padding mobile ke liye adjust ki ---
  <main className="flex-1 p-6 md:p-10" style={{ backgroundColor: '#E2F1F9' }}>
    <div className="mb-8">
      <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-3 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
    </div>
    <div className="flex border-b border-gray-300 mb-8">
      <div className="py-3 px-5 h-10 bg-gray-200 rounded-t-md w-24 animate-pulse"></div>
      <div className="py-3 px-5 h-10 bg-gray-200 rounded-t-md w-24 ml-2 animate-pulse"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6 animate-pulse"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> 
      <div className="bg-white p-6 rounded-2xl shadow-lg h-32 animate-pulse"></div>
      <div className="bg-white p-6 rounded-2xl shadow-lg h-32 animate-pulse"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6 animate-pulse"></div>
    <div className="bg-white p-6 rounded-2xl shadow-lg h-48 mb-8 animate-pulse"></div>
    <div className="bg-white p-6 rounded-2xl shadow-lg h-96 mb-8 animate-pulse"></div>
    <div className="bg-white p-6 rounded-2xl shadow-lg h-64 animate-pulse"></div>
  </main>
);

// --- (Stat Card is unchanged) ---
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

// --- (LeaderboardItem is unchanged) ---
const LeaderboardItem = ({ rank, student }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center gap-4">
      <span className="text-lg font-bold text-gray-400">#{rank}</span>
      <div>
        <p className="text-lg font-semibold text-gray-900">{student.name}</p>
        <p className="text-sm text-gray-500">Student ID: {student.studentId}</p>
      </div>
    </div>
  </div>
);

// --- 🚀 FIX: SubmissionItem ko responsive banaya ---
const SubmissionItem = ({ submission, rank }) => {
  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <tr className="border-b border-gray-200">
      {/* --- Padding kam kar di mobile ke liye --- */}
      <td className="py-3 px-2 md:px-4 font-bold text-gray-900 w-16 text-center">
        {getRankBadge(rank)}
      </td>
      <td className="py-3 px-2 md:px-4 font-medium text-gray-900">{submission.student.name}</td>
      <td className="py-3 px-2 md:px-4 text-gray-600 hidden md:table-cell">{submission.student.email}</td>
      <td className="py-3 px-2 md:px-4 font-semibold text-green-600">{submission.totalScore} pts</td>
    </tr>
  );
};
// --- End of Fix ---


// --- Main Page Component ---
function QuizAnalysisPage() {
  const { quizId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [quizDetails, setQuizDetails] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setLeaderboardError(null);

      const resultsPromise = api.get(`/api/quiz/${quizId}/results`);
      const leaderboardPromise = api.get(`/api/quiz/${quizId}/leaderboard`);
      const quizDetailsPromise = api.get(`/api/quiz/${quizId}`); 

      const [resultsRes, leaderboardRes, quizDetailsRes] = await Promise.allSettled([
        resultsPromise,
        leaderboardPromise,
        quizDetailsPromise
      ]);

      // 1. Results
      if (resultsRes.status === 'fulfilled' && resultsRes.value.data && Array.isArray(resultsRes.value.data.submissions)) {
        const sortedSubmissions = resultsRes.value.data.submissions.sort((a, b) => {
          return b.totalScore - a.totalScore; 
        });
        setSubmissions(sortedSubmissions);
      } else {
        console.error("Failed to load results:", resultsRes.reason);
        setError("Failed to load submissions.");
      }
      
      // 2. Leaderboard
      if (leaderboardRes.status === 'fulfilled' && leaderboardRes.value.data && Array.isArray(leaderboardRes.value.data.leaderboard)) {
        setLeaderboard(leaderboardRes.value.data.leaderboard);
      } else {
        console.error("Failed to load leaderboard:", leaderboardRes.reason);
        setLeaderboardError("Failed to load leaderboard (API 404 or Error).");
      }
      
      // 3. Quiz Details
      if (quizDetailsRes.status === 'fulfilled' && quizDetailsRes.value.data && quizDetailsRes.value.data.quiz) {
        setQuizDetails(quizDetailsRes.value.data.quiz);
      } else {
        console.error("Failed to load quiz details:", quizDetailsRes.reason);
        setError(prev => prev ? prev + " & Failed to load quiz details." : "Failed to load quiz details.");
      }

      setLoading(false);
    };
    fetchData();
  }, [quizId, navigate]);

  // (getChartData is unchanged)
  const getChartData = () => {
    let totalMarks = 0;
    if (quizDetails && quizDetails.questions) {
      totalMarks = quizDetails.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    }
    if (totalMarks === 0) totalMarks = 1; 

    const labels = submissions.map(sub => sub.student.name);
    const data = submissions.map(sub => (sub.totalScore / totalMarks) * 100); 
    
    return {
      labels,
      datasets: [{
        label: 'Score (%)',
        data,
        backgroundColor: '#4A90E2',
        borderRadius: 5,
      }],
    };
  };

  // (getAverageScore is unchanged)
  const getAverageScore = () => {
    if (submissions.length === 0) return 0;
    const total = submissions.reduce((sum, sub) => sum + sub.totalScore, 0);
    return (total / submissions.length).toFixed(1);
  };
  
  if (loading) return <AnalysisSkeleton />;

  if (error && submissions.length === 0) return <main className="flex-1 p-10 text-center text-red-500"><p>{error}</p></main>;

  return (
    // --- 🚀 FIX: Padding mobile ke liye adjust ki ---
    <main className="flex-1 p-6 md:p-10" style={{ backgroundColor: '#E2F1F9' }}>
      
      <div className="mb-8">
        {/* --- 🚀 FIX: Responsive font size --- */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Teachers dashboard</h1>
        <p className="text-base md:text-lg text-gray-600">Welcome back, {JSON.parse(localStorage.getItem('user'))?.name || 'Teacher'}</p>
      </div>
      <div className="flex border-b border-gray-300 mb-8">
        <Link to="/dashboard" className="py-3 px-5 text-gray-600 font-medium">My Quizzes</Link>
        <span className="py-3 px-5 text-blue-600 font-semibold border-b-2 border-blue-600">Analytics</span>
      </div>

      {/* --- 🚀 FIX: Responsive font size --- */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Performance Analysis</h2>

      {/* --- (Stat Cards 2 columns - unchanged) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
      </div>

      {/* (Smart Leaderboard section is unchanged) */}
      <section className="mb-8">
        {/* --- 🚀 FIX: Responsive font size --- */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Smart Leaderboard (Top 3)</h2>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
           <div className="flex items-center gap-2 mb-4">
             <FiAward className="text-yellow-500" />
             <h3 className="font-semibold text-lg md:text-xl">Top Performers</h3>
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
      
      {/* --- (Chart section is unchanged) --- */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          {/* --- 🚀 FIX: Responsive font size --- */}
          <h3 className="font-semibold text-lg md:text-xl mb-4">Student Performance Distribution (Percentage %)</h3>
          <div className="h-96"> 
            <Bar 
              data={getChartData()} 
              options={{ 
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    min: 0,
                    max: 100, 
                    ticks: {
                      callback: function(value) {
                        return value + '%'
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* --- 🚀 FIX: Table ko responsive banaya --- */}
      <section className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        {/* --- 🚀 FIX: Responsive font size --- */}
        <h3 className="font-semibold text-lg md:text-xl mb-4">Actual Quiz Results</h3>
        {error && !submissions.length && <p className="text-red-500">{error}</p>}
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            {/* --- 🚀 FIX: min-width hata diya --- */}
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-2 md:px-4 font-semibold text-gray-600 w-16 text-center">Rank</th>
                  <th className="py-3 px-2 md:px-4 font-semibold text-gray-600">Student Name</th>
                  <th className="py-3 px-2 md:px-4 font-semibold text-gray-600 hidden md:table-cell">Email</th>
                  <th className="py-3 px-2 md:px-4 font-semibold text-gray-600">Actual Score</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <SubmissionItem 
                    key={submission._id}
                    submission={submission}
                    rank={index + 1} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && !error && <p>No submissions yet for this quiz.</p>
        )}
      </section>
      {/* --- End of Fix --- */}
    </main>
  );
}

export default QuizAnalysisPage;