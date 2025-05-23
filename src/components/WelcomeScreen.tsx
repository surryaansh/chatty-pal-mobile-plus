
import React from 'react';

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <h1 className="text-3xl font-semibold mb-6 text-white">ChatGPT</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl w-full mb-8">
        {suggestedPrompts.map((prompt, index) => (
          <button
            key={index}
            className="bg-zinc-800 p-3 rounded-md border border-zinc-700 hover:bg-zinc-700 text-left text-gray-200"
          >
            <h3 className="text-sm font-medium mb-2">{prompt.title}</h3>
            <p className="text-xs text-gray-400">{prompt.description}</p>
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500 max-w-md">
        ChatGPT can make mistakes. Consider checking important information.
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
];

export default WelcomeScreen;
