interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-6 py-4 rounded-3xl ${
        message.isUser
          ? 'max-w-xs lg:max-w-md bg-[#18171c] text-white'
          : 'max-w-[70%] text-gray-900 dark:text-white'
      }`}>
        <p className="text-xl">{message.content}</p>
      </div>
    </div>
  );
}
