import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Icons
import { 
  FaChalkboardTeacher, 
  FaChartBar, // <-- 1. YAHAN FIX KIYA (FaAnalytics ki jagah)
  FaUsers, 
  FaArrowRight, 
  FaChevronLeft, 
  FaChevronRight, 
  FaChevronDown, 
  FaChevronUp,
  FaBookReader, 
  FaBrain, 
  FaNetworkWired, 
  FaVideo,
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCheckCircle
} from 'react-icons/fa';

// --- Functional Review Section ---
const reviewsData = [
  { name: 'Mr. A. Kumar', text: 'This platform changed my teaching. The analytics are insightful and easy to use.', img: 'https://api.uifaces.co/faces/twitter/kulkain/128.jpg' },
  { name: 'Mr. Riaz Khan', text: 'SmartSync is brilliant. Managing quizzes and notes in one place is a lifesaver.', img: 'https://api.uifaces.co/faces/twitter/holdenweb/128.jpg' },
  { name: 'Ms. Priya Shah', text: 'My students are more engaged, and I love the seamless classroom integration.', img: 'https://api.uifaces.co/faces/twitter/adellecharles/128.jpg' },
  { name: 'Mr. S. Chen', text: 'The real-time quiz feature is fantastic for immediate feedback.', img: 'https://api.uifaces.co/faces/twitter/IS_Cem/128.jpg' },
];

function ReviewsSection() {
  const [current, setCurrent] = useState(0);

  const nextReview = () => {
    setCurrent(current === reviewsData.length - 1 ? 0 : current + 1);
  };
  const prevReview = () => {
    setCurrent(current === 0 ? reviewsData.length - 1 : current - 1);
  };

  return (
    <div className="w-full max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Reviews from our members</h2>
      <div className="relative">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <img src={reviewsData[current].img} alt={reviewsData[current].name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200" />
          <p className="text-gray-600 mb-4 text-lg">"{reviewsData[current].text}"</p>
          <h4 className="font-bold text-xl text-gray-900">{reviewsData[current].name}</h4>
        </div>
        <button 
          onClick={prevReview} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Previous review"
        >
          <FaChevronLeft />
        </button>
        <button 
          onClick={nextReview} 
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Next review"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

// --- Functional FAQ Section ---
const faqsData = [
  { q: "What is SmartSync and how does it help in classrooms?", a: "SmartSync is an all-in-one platform designed for teachers. It allows you to create quizzes, manage classrooms, track student performance with detailed analytics, and provide notes, all in one place." },
  { q: "Is SmartSync Free to use for teachers and students?", a: "Yes, SmartSync offers a robust free plan for all teachers and students. We also have premium plans with advanced features for larger schools or institutions." },
  { q: "How can I create a classroom on SmartSync?", a: "After logging in, navigate to your Dashboard. You'll see a 'Create Classroom' button. Click it, give your classroom a name, and you'll get a unique code to share with your students." },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">FAQs</h2>
      <div className="space-y-4">
        {faqsData.map((faq, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center py-4 text-left font-semibold text-lg"
            >
              <span>{faq.q}</span>
              {openIndex === index ? <FaChevronUp className="text-blue-600" /> : <FaChevronDown className="text-gray-500" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="pt-2 pb-4 text-gray-600">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// --- MAIN HOMEPAGE COMPONENT ---
function HomePage() {
  const linkTo = "/login"; 

  return (
    <div className="w-full bg-blue-50">
      
      {/* --- 1. Hero Section --- */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-left pr-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Teaching <br /> Smarter Learning
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Deliver learning content smarter, faster, and more connected than ever.
            </p>
            <Link 
              to={linkTo}
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors shadow-md"
            >
              Create a set
            </Link>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
            {/* Make sure 'hero-image.png' is in 'public/photos/' folder */}
            <img src="/photos/hero-image.png" alt="Hero Illustration" className="rounded-lg max-w-md" />
          </div>
        </div>
      </section>

      {/* --- 2. Features Cards Section --- */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform hover:scale-105">
            <FaChalkboardTeacher className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Create Quizzes</h3>
            <p className="text-gray-600">Easily create and share quizzes with your students.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform hover:scale-105">
            {/* --- 2. YAHAN BHI FIX KIYA --- */}
            <FaChartBar className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Detailed Analytics</h3>
            <p className="text-gray-600">Track student performance with in-depth analytics.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform hover:scale-105">
            <FaUsers className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Student Management</h3>
            <p className="text-gray-600">Manage your classes and students all in one place.</p>
          </div>
        </div>
      </section>

      {/* ... baaki saara code (Start Teaching, How to Teach, Reviews, FAQs, etc.) same hai ... */}
      
      {/* --- 3. Start Teaching Section --- */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Start Teaching</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <Link to={linkTo} className="block bg-purple-100 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:bg-purple-200">
            <h3 className="font-bold text-xl text-purple-800">Create a quiz</h3>
          </Link>
          <Link to={linkTo} className="block bg-green-100 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:bg-green-200">
            <h3 className="font-bold text-xl text-green-800">Go to classroom</h3>
          </Link>
          <Link to={linkTo} className="block bg-orange-100 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:bg-orange-200">
            <h3 className="font-bold text-xl text-orange-800">Track progress</h3>
          </Link>
        </div>
      </section>

      {/* --- 4. How to Teach Section --- */}
      <section className="bg-blue-600 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 pr-8">
            <h2 className="text-3xl font-bold mb-6">How to Teach with SmartSync</h2>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center gap-3"><FaCheckCircle className="text-green-400" /> Sign in to your SmartSync account</li>
              <li className="flex items-center gap-3"><FaCheckCircle className="text-green-400" /> Create your classroom</li>
              <li className="flex items-center gap-3"><FaCheckCircle className="text-green-400" /> Provide your code or upload notes</li>
              <li className="flex items-center gap-3"><FaCheckCircle className="text-green-400" /> Start a real-time quiz session</li>
              <li className="flex items-center gap-3"><FaCheckCircle className="text-green-400" /> Track and analyze performance</li>
            </ul>
            <Link 
              to={linkTo}
              className="mt-8 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
            {/* Make sure 'how-to-teach.png' is in 'public/photos/' folder */}
            <img src="/photos/how-to-teach.png" alt="How to Teach" className="rounded-lg max-w-md" />
          </div>
        </div>
      </section>

      {/* --- 5. Reviews Section --- */}
      <section className="py-20 px-6">
        <ReviewsSection />
      </section>

      {/* --- 6. FAQs Section --- */}
      <section className="pb-20 px-6">
        <FaqSection />
      </section>

      {/* --- 7. Benefits Section --- */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">Benefits of Digital Smart Classroom Systems</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center"><FaBookReader className="text-5xl text-blue-600 mb-4" /><p className="font-medium">Courses engaging environment</p></div>
            <div className="flex flex-col items-center"><FaBrain className="text-5xl text-blue-600 mb-4" /><p className="font-medium">Improves knowledge retention</p></div>
            <div className="flex flex-col items-center"><FaNetworkWired className="text-5xl text-blue-600 mb-4" /><p className="font-medium">Eases access to information</p></div>
            <div className="flex flex-col items-center"><FaVideo className="text-5xl text-blue-600 mb-4" /><p className="font-medium">Suits modern teaching needs</p></div>
          </div>
        </div>
      </section>

      {/* --- 8. Stats Section --- */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-5xl font-bold text-blue-600">600+</h3>
            <p className="text-xl text-gray-700">Cities</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-blue-600">15000+</h3>
            <p className="text-xl text-gray-700">Schools</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-blue-600">1.2Million+</h3>
            <p className="text-xl text-gray-700">Teachers</p>
          </div>
        </div>
      </section>

      {/* --- 9. Footer Section --- */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-white text-lg mb-4">Contact Us</h4>
            <p className="flex items-center gap-2 mb-2"><FaEnvelope /> smartsync@gmail.com</p>
            <p className="flex items-center gap-2 mb-2"><FaPhoneAlt /> 123-456-7890</p>
            <p className="flex items-center gap-2"><FaMapMarkerAlt /> 123 Smart St, Ghaziabad, IN</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to={linkTo} className="hover:text-white">Dashboard</Link></li>
              <li><Link to={linkTo} className="hover:text-white">Classroom</Link></li>
              <li><Link to={linkTo} className="hover:text-white">Quiz</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg mb-4">Address</h4>
            <p>SmartSync Solutions Pvt. Ltd.</p>
            <p>123 Innovation Drive, Tech Park,</p>
            <p>Ghaziabad, Uttar Pradesh, 201001</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; 2025 SmartSync. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-white"><FaChalkboardTeacher size={20} /></a>
            <a href="#" className="hover:text-white"><FaBookReader size={20} /></a>
            <a href="#" className="hover:text-white"><FaBrain size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;