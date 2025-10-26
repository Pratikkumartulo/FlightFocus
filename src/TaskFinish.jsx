import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TaskFinish() {
    const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700 backdrop-blur-sm">
          {/* Animated Check Circle */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-6 shadow-lg">
                <Check className="w-16 h-16 md:w-20 md:h-20 text-white stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Congratulations!
            </h1>
            <p className="text-gray-400 text-base md:text-lg">
              Your task has been completed successfully. Great work!
            </p>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-green-500 to-transparent w-full"></div>
          </div>

          {/* Button */}
          <button
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Go to Home
          </button>
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-300 rounded-full opacity-30 animate-pulse delay-75"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-green-500 rounded-full opacity-25 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}