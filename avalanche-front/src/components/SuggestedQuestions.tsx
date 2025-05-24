interface SuggestedQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

export default function SuggestedQuestions({ onQuestionSelect }: SuggestedQuestionsProps) {
  const questions = [
    "What is the difference between stop loss and take profit?",
    "How do I manage risk in trading?",
    "What are the basic trading strategies for beginners?"
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-3">
        Suggested Questions:
      </h3>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionSelect(question)}
            className="w-full text-left px-5 py-10 text-xl border border-[#242424] rounded-[20px] hover:border-gray-500 transition duration-300"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
