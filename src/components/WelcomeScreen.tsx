
import React from 'react';

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <h1 className="text-4xl font-bold mb-6 text-white">What can I help with?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
        {suggestedPrompts.map((prompt, index) => (
          <button
            key={index}
            className="bg-chatgpt-button p-4 rounded-md hover:bg-zinc-700 text-left text-gray-200"
          >
            <h3 className="font-medium mb-2">{prompt.title}</h3>
            <p className="text-sm text-gray-400">{prompt.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const suggestedPrompts = [
  {
    title: "Explain quantum computing",
    description: "In simple terms, how does quantum computing work?"
  },
  {
    title: "Creative writing",
    description: "Write a short story about a robot learning to love"
  },
  {
    title: "Code explanation",
    description: "Explain how promises work in JavaScript"
  },
  {
    title: "Travel planning",
    description: "Plan a 7-day trip to Japan"
  },
  {
    title: "Recipe ideas",
    description: "Suggest a healthy dinner with ingredients I might have at home"
  },
  {
    title: "Language learning",
    description: "Help me practice basic Spanish conversation"
  },
];

export default WelcomeScreen;
