import { useState } from "react";

const RealEstateQuiz = ({ onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  
  const questions = [
    {
      question: "What is a mortgage?",
      options: ["A type of loan", "A property deed", "A rental agreement", "An insurance policy"],
      correct: 0
    },
    {
      question: "What does LTV stand for in real estate?",
      options: ["Loan-to-Value", "Land-to-Villa", "Lease-to-Vacate", "Legal Title Verification"],
      correct: 0
    },
    {
      question: "What is escrow in real estate?",
      options: ["A neutral third party holding funds", "A type of mortgage", "A property tax", "A real estate agent's commission"],
      correct: 0
    },
    {
      question: "What is a comparative market analysis?",
      options: ["A method to determine a home's value", "A legal document", "A type of inspection", "A mortgage application"],
      correct: 0
    },
    {
      question: "What is earnest money?",
      options: ["A deposit showing buyer's serious intent", "The final payment", "A realtor's fee", "A mortgage insurance payment"],
      correct: 0
    }
  ];
  
  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      onComplete(score);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full mx-4">
        <h2 className="text-lg font-bold mb-4 text-[#113c5e]">
          Real Estate Quiz ({currentQuestion + 1}/{questions.length})
        </h2>
        
        {currentQuestion < questions.length ? (
          <>
            <p className="mb-4 font-medium">{questions[currentQuestion].question}</p>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full bg-gray-100 hover:bg-gray-200 p-3 rounded text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg mb-4">Quiz Completed!</p>
            <p>Your score: {score}/{questions.length}</p>
            <button 
              onClick={() => onComplete(score)}
              className="w-full mt-4 bg-[#113c5e] text-white py-2 rounded-full"
            >
              Claim 5 VTS Reward
            </button>
          </div>
        )}
        
        <button onClick={onClose} className="mt-4 text-gray-500">
          Close Quiz
        </button>
      </div>
    </div>
  );
};

export default RealEstateQuiz;