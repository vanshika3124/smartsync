import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
// --- 🚀 FIX: FiTrendingUp (Improving) icon hata diya hai ---
import { FiUsers, FiCheckCircle, FiClock, FiAward } from 'react-icons/fi'; 
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

// --- (Skeleton Loader is unchanged) ---
const AnalysisSkeleton = () => (
  <main className="flex-1 p-8 md:p-12" style={{ backgroundColor: '#F0F7FF' }}>
    <div className="mb-8">
      <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-3 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
    </div>
    <div className="flex border-b border-gray-300 mb-8">
      <div className="py-3 px-5 h-10 bg-gray-200 rounded-t-md w-24 animate-pulse"></div>
      <div className="py-3 px-5 h-10 bg-gray-200 rounded-t-md w-24 ml-2 animate-pulse"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6 animate-pulse"></div>
    {/* --- 🚀 FIX: Grid 4 se 3 columns ka kar diya --- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> 
      <div className="bg-white p-6 rounded-2xl shadow-lg h-32 animate-pulse"></div>
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

// --- 🚀 FIX: Leaderboard se 'Predicted Score' hata diya ---
// (Backend se 'timeTaken' yahan nahi aata, toh hum N/A dikha rahe hain)
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
      <p className="text-xl font-bold text-gray-400">N/A</p>
      <span className="text-sm text-gray-500">Prediction</span>
    </div>
  </div>
);

// --- 🚀 FIX: Submission table mein 'Time Taken' add kiya ---
const SubmissionItem = ({ submission, rank }) => {
  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  // Time Taken ko format karte hain (assuming seconds)
  const timeTaken = submission.timeTaken;
  const displayTime = (typeof timeTaken === 'number') 
    ? `${timeTaken.toFixed(0)}s` // e.g., "30s"
    : 'N/A';

  return (
    <tr className="border-b border-gray-200">
      <td className="py-3 px-4 font-bold text-gray-900 w-20 text-center">
        {getRankBadge(rank)}
      </td>
      <td className="py-3 px-4 font-medium text-gray-900">{submission.student.name}</td>
      <td className="py-3 px-4 text-gray-600">{submission.student.email}</td>
      <td className="py-3 px-4 font-semibold text-green-600">{submission.totalScore} pts</td>
      {/* 'Predicted Score' ki jagah 'Time Taken' */}
      <td className="py-3 px-4 font-semibold text-blue-600">
        {displayTime}
      </td>
    </tr>
  );
};


// --- Main Page Component ---
function QuizAnalysisPage() {
  const { quizId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizDetails, setQuizDetails] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardError, setLeaderboardError] = useState(null);
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
        // --- 🚀 FIX: Ab hum 'timeTaken' ke saath sort kar rahe hain (pehle score, fir time) ---
        const sortedSubmissions = resultsRes.value.data.submissions.sort((a, b) => {
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore; // Pehle high score
          }
          return (a.timeTaken || 999) - (b.timeTaken || 999); // Fir low time
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

  // Graph data function (unchanged)
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

  // Avg Score function (unchanged)
  const getAverageScore = () => {
    if (submissions.length === 0) return 0;
    const total = submissions.reduce((sum, sub) => sum + sub.totalScore, 0);
    return (total / submissions.length).toFixed(1);
  };
  
  // --- 🚀 NAYA FUNCTION: 'Avg Time' calculate karne ke liye ---
  const getAverageTime = () => {
    if (submissions.length === 0) return 'N/A';
    const totalTime = submissions.reduce((sum, sub) => sum + (sub.timeTaken || 0), 0);
    if (totalTime === 0) return 'N/A'; // Agar kisi ne bhi time nahi diya
    const avg = totalTime / submissions.length;
    return `${avg.toFixed(1)}s`; // e.g., "45.2s"
  };
  // --- End of Fix ---

  if (loading) return <AnalysisSkeleton />;

  if (error && submissions.length === 0) return <main className="flex-1 p-10 text-center text-red-500"><p>{error}</p></main>;

  return (
    <main className="flex-1 p-8 md:p-12" style={{ backgroundColor: '#F0F7FF' }}>
      
      {/* ... (Header and Tabs unchanged) ... */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Teachers dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back, {JSON.parse(localStorage.getItem('user'))?.name || 'Teacher'}</p>
      </div>
      <div className="flex border-b border-gray-300 mb-8">
        <Link to="/dashboard" className="py-3 px-5 text-gray-600 font-medium">My Quizzes</Link>
        <span className="py-3 px-5 text-blue-600 font-semibold border-b-2 border-blue-600">Analytics</span>
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Performance Analysis</h2>

      {/* --- 🚀 FIX: Stat Cards (3 columns) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        {/* "Improving" card hata diya */}
        <StatCard 
          title="Avg Time/Question" 
          value={getAverageTime()} // <-- Naya function call kiya
          icon={<FiClock className="text-purple-600" />}
          iconBg="bg-purple-100"
        />
      </div>
      {/* --- End of Fix --- */}

      {/* --- 🚀 FIX: 'Smart Leaderboard' se 'Predicted Score' hata diya --- */}
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
      {/* --- End of Fix --- */}
      
      {/* --- (Chart section is unchanged) --- */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4">Student Performance Distribution (Percentage %)</h3>
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

      {/* --- 🚀 FIX: Table header change kiya --- */}
      <section className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="font-semibold text-xl mb-4">Actual Quiz Results</h3>
        {error && !submissions.length && <p className="text-red-500">{error}</p>}
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-600 w-20 text-center">Rank</th>
                  <th className="py-3 px-4 font-semibold text-gray-600">Student Name</th>
                  <th className="py-3 px-4 font-semibold text-gray-600">Email</th>
                  <th className="py-3 px-4 font-semibold text-gray-600">Actual Score</th>
                  <th className="py-3 px-4 font-semibold text-gray-600">Time Taken</th> {/* <-- Change kiya */}
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