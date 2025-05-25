interface SuggestedQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

export default function SuggestedQuestions({ onQuestionSelect }: SuggestedQuestionsProps) {
  const questions = [
    "How do I configure gas fees for my L1 blockchain?",
    "What are the best practices for setting up validator requirements?",
    "How do I enable contract deployer allow lists for my subnet?"
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
