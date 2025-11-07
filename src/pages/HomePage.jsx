import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- 1. IMPORT useAuth
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaChevronDown,
  FaArrowRight,
} from 'react-icons/fa';

// --- 2. Hero Section Component (UPDATED) ---
const HeroSection = () => {
  const { isLoggedIn } = useAuth(); // <-- 2. Get login state
  // 3. Set links based on login state
  const linkTo = isLoggedIn ? "/dashboard" : "/login"; 

  return (
    <section className="bg-[#F0F5FF] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Teaching <br /> Smarter Learning
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-10">
              Making Learning Smarter, Faster, and More Connected Than Ever Before
            </p>
            <Link 
              to={linkTo} // <-- 4. Use dynamic link
              className="bg-teal-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-teal-600 transition-colors shadow-lg"
            >
              {isLoggedIn ? "Go to Dashboard" : "Go to classroom"}
            </Link>
          </div>
          {/* ... (rest of the component) ... */}
          <div className="flex justify-center">
            <img 
              src="/photos/hero-image.png" 
              alt="Hero Illustration" 
              className="max-w-lg w-full" 
            />
          </div>
        </div>
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-left transition-transform hover:scale-105 border border-gray-100">
            <img src="/photos/hero-1.png" alt="Real time quizzes" className="w-16 h-16 mb-5" />
            <h3 className="font-bold text-xl text-gray-900 mb-3">Real time quizzes</h3>
            <p className="text-gray-600 text-sm">
              Live quiz sessions with instant feedback and timer-based questions.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-left transition-transform hover:scale-105 border border-gray-100">
            <img src="/photos/hero-2.png" alt="ML Analytics" className="w-16 h-16 mb-5" />
            <h3 className="font-bold text-xl text-gray-900 mb-3">ML Analytics</h3>
            <p className="text-gray-600 text-sm">
              Insights into student performance and learning patterns.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-left transition-transform hover:scale-105 border border-gray-100">
            <img src="/photos/hero-3.png" alt="Easy Management" className="w-16 h-16 mb-5" />
            <h3 className="font-bold text-xl text-gray-900 mb-3">Easy Management</h3>
            <p className="text-gray-600 text-sm">
              Simple quiz creation and student participation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 3. Start Teaching Section Component (UPDATED) ---
const StartTeachingSection = () => {
  const { isLoggedIn } = useAuth(); // <-- 2. Get login state
  // 3. Set links based on login state
  const quizLink = isLoggedIn ? "/create-quiz" : "/login";
  const classroomLink = isLoggedIn ? "/create-classroom" : "/login";
  const trackLink = isLoggedIn ? "/dashboard" : "/login"; // Go to dashboard to track progress

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Start <span className="text-blue-600">Teaching</span></h2>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* 4. Use dynamic links */}
          <Link to={quizLink} className="block bg-[#E6EAFE] p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow text-[#334D99]">
            <img src="/photos/start-quiz.png" alt="Create a quiz" className="w-14 h-14 mx-auto mb-4" />
            <h3 className="font-semibold text-xl">create a quiz</h3>
          </Link>
          <Link to={classroomLink} className="block bg-[#E5F8EE] p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow text-[#00664F]">
            <img src="/photos/start-classroom.png" alt="Go to classroom" className="w-14 h-14 mx-auto mb-4" />
            <h3 className="font-semibold text-xl">Create classroom</h3>
          </Link>
          <Link to={trackLink} className="block bg-[#FFF0E7] p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow text-[#994A1A]">
            <img src="/photos/start-track.png" alt="Track progress" className="w-14 h-14 mx-auto mb-4" />
            <h3 className="font-semibold text-xl">Track progress</h3>
          </Link>
        </div>
      </div>
    </section>
  );
};

// --- 4. How to Teach Section Component (UPDATED) ---
const HowToTeachSection = () => {
  const { isLoggedIn } = useAuth(); // <-- 2. Get login state
  const linkTo = isLoggedIn ? "/dashboard" : "/login"; // <-- 3. Set link
  
  const steps = [
    "Sign in to your SmartSync account",
    "Create your classroom",
    "Design your quiz or upload notes",
    "Start a real-time session",
    "Track and analyze performance"
  ];

  return (
    <section className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto bg-[#4A6FFF] text-white p-12 md:p-20 rounded-3xl">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-10">How to Teach with SmartSync?</h2>
            <ol className="relative border-l border-dashed border-white/30">
              {steps.map((step, index) => (
                <li key={index} className="mb-8 ml-8">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full -left-3 ring-4 ring-[#4A6FFF]">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                  </span>
                  <p className="text-xl font-medium">{step}</p>
                </li>
              ))}
            </ol>
            <Link 
              to={linkTo} // <-- 4. Use dynamic link
              className="mt-8 inline-block bg-teal-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-teal-600 transition-colors shadow-lg"
            >
              {isLoggedIn ? "Go to Dashboard" : "Go to classroom"}
            </Link>
          </div>
          <div className="flex justify-center">
            <img 
              src="/photos/teach.png" 
              alt="How to Teach Illustration" 
              className="max-w-md w-full" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- (ReviewsSection, FaqSection, BenefitsAndStatsSection components are unchanged) ---
// ... (Copy-paste them from your original file) ...
const reviewsData = [
  { name: 'Ms. A. Kumar', title: 'Mathematics Teacher', text: "SmartSync has truly revolutionised the way I run my classroom. I can roll out a quiz in seconds, track student responses live, and instantly recognise who needs help. The analytics dashboard is a god-send — no more guessing which topic needs revisiting.", img: 'https://api.uifaces.co/faces/twitter/kulkain/128.jpg', time: "3 months ago", stars: 4 },
  { name: 'Mr. Sunil Rao', title: 'Senior Secondary School', text: "As a senior educator, I value tools that just work. SmartSync impressed me with how intuitive it was to set up, how quickly my students picked it up, and how it seamlessly fits in both online and in-class use. Highly recommended!", img: 'https://api.uifaces.co/faces/twitter/holdenweb/128.jpg', time: "2 weeks ago", stars: 5 },
  { name: 'Ms. Priya Shah', title: 'English Department', text: "My students actually look forward to using SmartSync now — the quizzes are engaging, the feedback is instantaneous, and I love how I can upload my own notes and course material in one place. It’s made teaching more efficient and interactive.", img: 'https://api.uifaces.co/faces/twitter/adellecharles/128.jpg', time: "1 month ago", stars: 5 },
  { name: 'Mr. S. Chen', title: 'Physics Department', text: 'The real-time quiz feature is fantastic for immediate feedback. Lifesaver for my classroom.', img: 'https_://api.uifaces.co/faces/twitter/IS_Cem/128.jpg', time: "2 months ago", stars: 4 },
];
const Stars = ({ count = 5 }) => {
  return (
    <div className="flex text-yellow-400 text-xl">
      {Array(count).fill(0).map((_, i) => (
        <span key={i}>★</span>
      ))}
      {Array(5 - count).fill(0).map((_, i) => (
        <span key={i} className="text-gray-300">★</span>
      ))}
    </div>
  );
};
const ReviewCard = ({ name, title, text, img, time, stars, borderColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg min-w-[350px] max-w-sm mx-4 flex-shrink-0"> 
    <div className="flex items-center mb-4">
      <img src={img} alt={name} className={`w-16 h-16 rounded-full border-4 ${borderColor}`} />
      <div className="ml-4">
        <h3 className="font-bold text-lg text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
    <Stars count={stars} />
    <p className="text-gray-600 my-4 text-sm leading-relaxed">{text}</p>
    <p className="text-right text-xs text-gray-400">{time}</p>
  </div>
);
function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const cardOffset = 350 + 32; 
  const nextReview = () => { setCurrent(prev => (prev === reviewsData.length - 1 ? 0 : prev + 1)); };
  const prevReview = () => { setCurrent(prev => (prev === 0 ? reviewsData.length - 1 : prev - 1)); };
  const borderColors = ['border-blue-400', 'border-yellow-400', 'border-red-400', 'border-purple-400'];
  return (
    <section className="py-20 px-6 bg-[#F0F5FF]"> 
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/3 hidden md:block">
          <img src="/photos/woman.png" alt="Teacher pointing to reviews" className="max-w-xs mx-auto" />
        </div>
        <div className="w-full md:w-2/3">
          <h2 className="text-4xl font-bold mb-12 text-gray-800 text-center md:text-left">Reviews from our members</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${current * cardOffset}px)` }}>
                {reviewsData.map((review, index) => (
                  <ReviewCard key={index} {...review} borderColor={borderColors[index % borderColors.length]} />
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-8 gap-4">
              <button onClick={prevReview} className="bg-white rounded-full p-4 shadow-md hover:bg-gray-100 transition-colors" aria-label="Previous review">
                <FaChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button onClick={nextReview} className="bg-white rounded-full p-4 shadow-md hover:bg-gray-100 transition-colors" aria-label="Next review">
                <FaChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
const faqsData = [
  { q: "What is SmartSync and how does it help in classrooms?", a: "SmartSync is a smart classroom platform that connects teachers and students in real time. It helps teachers create quizzes, share notes, and analyze student performance — all in one place." },
  { q: "Is SmartSync free to use for teachers and students?", a: "Yes, SmartSync offers a robust free plan for all teachers and students. We also have premium plans with advanced features for larger schools or institutions." },
  { q: "How can I create a classroom on SmartSync?", a: "After logging in, navigate to your Dashboard. You'll see a 'Create Classroom' button. Click it, give your classroom a name, and you'll get a unique code to share with your students." },
];
const FaqItem = ({ faq, index, openIndex, toggleFAQ }) => {
  const isOpen = index === openIndex;
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button onClick={() => toggleFAQ(index)} className="w-full flex justify-between items-center py-6 text-left">
        <span className="font-semibold text-lg text-gray-900">{faq.q}</span>
        {isOpen ? <FaChevronUp className="w-5 h-5 text-blue-600" /> : <FaChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
      </div>
    </div>
  );
};
function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0); 
  const toggleFAQ = (index) => { setOpenIndex(openIndex === index ? null : index); };
  return (
    <section className="py-20 px-6 bg-[#F0F5FF]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-12">FAQs</h2>
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg text-left">
          {faqsData.map((faq, index) => (
            <FaqItem key={index} faq={faq} index={index} openIndex={openIndex} toggleFAQ={toggleFAQ} />
          ))}
        </div>
       <Link to="/faqs" className="mt-12 inline-block bg-teal-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-teal-600 transition-colors shadow-lg">
          See all FAQs
          <FaArrowRight className="inline-block w-4 h-4 ml-2" />
        </Link>
      </div>
    </section>
  );
}
const BenefitsAndStatsSection = () => {
  const benefits = [
    { title: "Creates engaging environment", icon: "/photos/benefit-1.png" },
    { title: "Improves knowledge retention", icon: "/photos/benefit-2.png" },
    { title: "Boosts teaching skills", icon: "/photos/benefit-3.png" },
    { title: "Makes learning fun", icon: "/photos/benefit-4.png" },
    { title: "Eases access to information", icon: "/photos/benefit-5.png" },
    { title: "Suits students with distinct learning needs", icon: "/photos/benefit-6.png" },
  ];
  const stats = [
    { title: "Cities", value: "400+", icon: "/photos/stat-1.png" },
    { title: "Schools", value: "8500+", icon: "/photos/stat-2.png" },
    { title: "Teachers", value: "1.2million+", icon: "/photos/stat-3.png" },
  ];
  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-16">
          Benefits of Digital Smart Classroom Systems
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12">
          {benefits.map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              <img src={item.icon} alt="" className="w-16 h-16 mb-4" />
              <p className="font-medium text-blue-900 max-w-[200px]">{item.title}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-24 pt-16 border-t border-gray-200">
          {stats.map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              <img src={item.icon} alt="" className="w-16 h-16 mb-4" />
              <h3 className="text-5xl font-bold text-teal-600 mb-2">{item.value}</h3>
              <p className="text-2xl text-gray-700">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


// --- Main Homepage Component ---
function HomePage() {
  return (
    <div className="w-full bg-white">
      <HeroSection />
      <StartTeachingSection />
      <HowToTeachSection />
      <ReviewsSection />
      <FaqSection />
      <BenefitsAndStatsSection />
    </div>
  );
}

export default HomePage;