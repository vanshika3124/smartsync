import React, { useState } from 'react';
// --- ICONS IMPORT KIYE ---
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

// --- Data (Saare 17 Questions Screenshot se) ---
const faqsData = [
  { 
    q: "What is SmartSync and how does it help in classrooms?", 
    a: "SmartSync is a smart classroom platform that connects teachers and students in real time. It helps teachers create quizzes, share notes, and analyze student performance — all in one place." 
  },
  { 
    q: "Is SmartSync free to use for teachers and students?", 
    a: "Yes, SmartSync offers a robust free plan for all teachers and students. We also have premium plans with advanced features for larger schools or institutions." 
  },
  { 
    q: "How do students join my classroom or quiz session?", 
    a: "Students can join using a unique classroom code provided by the teacher. For quizzes, a separate quiz code can be shared for real-time sessions." 
  },
  { 
    q: "What kind of analytics does SmartSync provide to teachers?", 
    a: "Teachers get detailed analytics on student performance, including individual scores, common mistakes, time taken, and overall class understanding of different topics." 
  },
  { 
    q: "Can I conduct live quizzes and track results in real time?", 
    a: "Yes! This is one of SmartSync's core features. You can launch a live quiz and watch as students submit answers, seeing the results update instantly on your dashboard." 
  },
  { 
    q: "How can I create a classroom on SmartSync?", 
    a: "After logging in to your teacher dashboard, click on 'Create New Classroom'. Give it a name, and you'll instantly get a unique shareable code for your students." 
  },
  { 
    q: "Can I upload and share notes or study materials with my students?", 
    a: "Absolutely. Each classroom has a dedicated section where you can upload PDFs, documents, presentations, and other study materials for your students to access anytime." 
  },
  { 
    q: "Is SmartSync free to use for teachers and students?", 
    a: "Yes, the basic features of SmartSync are completely free for individual teachers and their students. We offer optional paid plans for schools needing advanced features." 
  },
  { 
    q: "Is SmartSync compatible with mobile devices and tablets?", 
    a: "Yes, SmartSync is fully responsive and works on all devices, including desktops, laptops, tablets, and smartphones, through any modern web browser." 
  },
  { 
    q: "How do I create or customize a quiz?", 
    a: "From your dashboard, go to the 'Quiz' section and click 'Create New Quiz'. You can add various question types (MCQ, True/False, etc.), set marks, and add time limits." 
  },
  { 
    q: "Can multiple teachers collaborate in the same classroom?", 
    a: "Currently, each classroom is managed by a single teacher. However, you can share quiz materials with other teachers." 
  },
  { 
    q: "How secure is my data and student information on SmartSync?", 
    a: "We take data security very seriously. All data is encrypted, and we follow strict privacy policies to ensure student and teacher information is always protected." 
  },
  { 
    q: "Do I need an internet connection to use SmartSync features?", 
    a: "Yes, as a real-time web platform, SmartSync requires an active internet connection for both teachers and students to access classrooms, quizzes, and analytics." 
  },
  { 
    q: "How can I reset my password or recover my account?", 
    a: "On the login page, click the 'Forgot Password?' link. You can enter your registered email address to receive instructions on how to reset your password." 
  },
  { 
    q: "Who can I contact for technical support or feedback?", 
    a: "You can reach our support team directly via the 'Contact Us' section in the footer or by emailing us at Smartsync@help.in." 
  },
  { 
    q: "What makes SmartSync different from other classroom management apps?", 
    a: "SmartSync focuses on seamless, real-time quiz integration and powerful, easy-to-understand analytics, helping teachers instantly identify learning gaps." 
  },
  { 
    q: "How do students join my classroom or quiz session?", 
    a: "Students go to the SmartSync website, click 'Join Classroom', and enter the unique code you provide them. It's that simple!" 
  },
];

// --- Reusable FAQ Item Component ---
const FaqItem = ({ faq, index, openIndex, toggleFAQ }) => {
  const isOpen = index === openIndex;
  
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleFAQ(index)}
        className="w-full flex justify-between items-center py-6 text-left"
      >
        <span className="font-semibold text-lg text-gray-900">{faq.q}</span>
        {/* --- YAHAN ICON UPDATE KIYA --- */}
        {isOpen ? 
          <FaChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0 ml-4" /> : 
          <FaChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
        }
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-600 leading-relaxed pr-8">{faq.a}</p>
      </div>
    </div>
  );
};

// --- Main FAQ Page Component ---
function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0); // Pehla waala by default khula rahega

  const toggleFAQ = (index) => {
    // Agar pehle se khula hai toh band karo, varna naya waala kholo
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // Navbar aur Footer aapki App.jsx file se aa rahe hain
    // Yeh sirf page ka content hai
    <div className="w-full bg-[#F0F5FF] py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Title */}
        <h2 className="text-5xl font-bold text-blue-600 mb-12">FAQs</h2>
        
        {/* White container */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg text-left">
          {faqsData.map((faq, index) => (
            <FaqItem 
              key={index}
              faq={faq}
              index={index}
              openIndex={openIndex}
              toggleFAQ={toggleFAQ}
            />
          ))}
        </div>
        
        {/* Screenshot mein "See all FAQs" button nahi hai, isliye yahan nahi daala */}

      </div>
    </div>
  );
}

export default FaqPage;
