
import React from 'react';
import { X, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useHelp } from '../contexts/HelpContext';

interface OnboardingStep {
  title: string;
  content: string;
  target?: string;
  action?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Welcome to Zettelkasten AI Consciousness Explorer",
    content: "This is a powerful knowledge management system that combines traditional Zettelkasten methodology with AI-powered insights. Let's take a quick tour of the main features.",
  },
  {
    title: "Knowledge Trunks",
    content: "Your knowledge is organized into 24 thematic 'trunks' - each containing related entries on topics like consciousness, AI, philosophy, and more. Think of these as your main knowledge categories.",
    target: "sidebar-trunks"
  },
  {
    title: "AI Chat Assistant",
    content: "Engage with an AI assistant that can help you explore ideas, answer questions, and provide insights based on your knowledge base. Perfect for brainstorming and deep thinking.",
    target: "sidebar-ai-chat"
  },
  {
    title: "Zettelkasten Management",
    content: "Create, edit, and manage individual knowledge notes (Zettels). Each Zettel can be linked to others, creating a web of interconnected ideas.",
    target: "sidebar-zettel"
  },
  {
    title: "Cross-Reference Matrix",
    content: "Discover hidden connections between different knowledge areas. This powerful tool helps you find unexpected relationships in your data.",
    target: "sidebar-matrix"
  },
  {
    title: "Oracle Cards & Creative Tools",
    content: "Access creative inspiration tools including Oracle cards, Sacred Clown generator, and other consciousness exploration utilities.",
    target: "sidebar-oracle"
  },
  {
    title: "Google Integration",
    content: "Connect with Google services to enhance your research and knowledge gathering capabilities.",
    target: "sidebar-google"
  },
  {
    title: "You're Ready to Explore!",
    content: "You now have an overview of the main features. Start by exploring the Dashboard or dive into any trunk that interests you. Remember, you can always access help through the '?' icon in the header.",
  }
];

export const OnboardingTour: React.FC = () => {
  const {
    isOnboardingActive,
    currentOnboardingStep,
    nextOnboardingStep,
    prevOnboardingStep,
    completeOnboarding,
    hideOnboarding
  } = useHelp();

  if (!isOnboardingActive) return null;

  const currentStep = onboardingSteps[currentOnboardingStep];
  const isLastStep = currentOnboardingStep === onboardingSteps.length - 1;
  const isFirstStep = currentOnboardingStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      nextOnboardingStep();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {currentOnboardingStep + 1}
              </div>
              <span className="text-sm text-gray-500">
                {currentOnboardingStep + 1} of {onboardingSteps.length}
              </span>
            </div>
            <button
              onClick={hideOnboarding}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {currentStep.title}
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {currentStep.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {!isFirstStep && (
                <button
                  onClick={prevOnboardingStep}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Get Started</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentOnboardingStep + 1) / onboardingSteps.length) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
