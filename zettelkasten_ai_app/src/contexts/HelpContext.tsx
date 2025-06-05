
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface HelpContextType {
  isOnboardingActive: boolean;
  currentOnboardingStep: number;
  hasSeenOnboarding: boolean;
  showOnboarding: () => void;
  hideOnboarding: () => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  showTooltip: string | null;
  setShowTooltip: (id: string | null) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

interface HelpProviderProps {
  children: ReactNode;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({ children }) => {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('zettelkasten-onboarding-completed');
    if (onboardingCompleted === 'true') {
      setHasSeenOnboarding(true);
    } else {
      // Show onboarding for new users after a short delay
      const timer = setTimeout(() => {
        setIsOnboardingActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const showOnboarding = () => {
    setIsOnboardingActive(true);
    setCurrentOnboardingStep(0);
  };

  const hideOnboarding = () => {
    setIsOnboardingActive(false);
  };

  const nextOnboardingStep = () => {
    setCurrentOnboardingStep(prev => prev + 1);
  };

  const prevOnboardingStep = () => {
    setCurrentOnboardingStep(prev => Math.max(0, prev - 1));
  };

  const setOnboardingStep = (step: number) => {
    setCurrentOnboardingStep(step);
  };

  const completeOnboarding = () => {
    setIsOnboardingActive(false);
    setHasSeenOnboarding(true);
    localStorage.setItem('zettelkasten-onboarding-completed', 'true');
  };

  return (
    <HelpContext.Provider
      value={{
        isOnboardingActive,
        currentOnboardingStep,
        hasSeenOnboarding,
        showOnboarding,
        hideOnboarding,
        nextOnboardingStep,
        prevOnboardingStep,
        setOnboardingStep,
        completeOnboarding,
        showTooltip,
        setShowTooltip,
      }}
    >
      {children}
    </HelpContext.Provider>
  );
};
