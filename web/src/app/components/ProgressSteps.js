import React, { useState, useEffect } from "react";

const steps = [
  "Uploading Resume...",
  "Analyzing with AI...",
  "Calculating Match Score...",
  "Generating Tailoring Suggestions...",
  "Ready!",
];

export default function ProgressSteps({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      setTimeout(onComplete, 1000);
    }
  }, [currentStep, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        <ul className="space-y-3">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 ${
                index <= currentStep ? "text-green-600" : "text-gray-400"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 ${
                  index < currentStep
                    ? "bg-green-600 border-green-600"
                    : index === currentStep
                    ? "border-green-600"
                    : "border-gray-400"
                }`}
              ></span>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
