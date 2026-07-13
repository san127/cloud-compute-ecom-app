import React, { useState, useEffect } from 'react';

export const Step = ({ children }) => {
  return <div className="step-content-pane">{children}</div>;
};

const Stepper = ({
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = "Previous",
  nextButtonText = "Next",
  disableStepIndicators = false,
  children
}) => {
  const steps = React.Children.toArray(children).filter(child => child.type === Step);
  const totalSteps = steps.length;
  const [currentStep, setCurrentStep] = useState(initialStep);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (onFinalStepCompleted) {
        onFinalStepCompleted();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const activeStepChild = steps[currentStep - 1];

  return (
    <div className="glass-stepper-container">
      {!disableStepIndicators && (
        <div className="stepper-header">
          {steps.map((_, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <React.Fragment key={index}>
                <div className={`step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <div className="step-indicator-bubble">
                    {isCompleted ? '✓' : stepNum}
                  </div>
                  <span className="step-indicator-label">Step {stepNum}</span>
                </div>
                {index < totalSteps - 1 && (
                  <div className={`step-connector-line ${isCompleted ? 'completed' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      <div className="stepper-body">
        {activeStepChild}
      </div>

      <div className="stepper-actions">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="stepper-btn-back"
        >
          {backButtonText}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="stepper-btn-next"
        >
          {currentStep === totalSteps ? "Place Order" : nextButtonText}
        </button>
      </div>
    </div>
  );
};

export default Stepper;
