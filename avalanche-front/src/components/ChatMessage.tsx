interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}``

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const tags = message.content
    .split(' ')
    .filter(word => word.startsWith('@'))

  const messageWithoutTags = message.content
    .split(' ')
    .filter(word => !word.startsWith('@'))
    .join(' ');

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-6 py-4 rounded-3xl ${
        message.isUser
          ? 'max-w-xs lg:max-w-md bg-[#18171c] text-white'
          : 'max-w-[70%] text-gray-900 dark:text-white'
      }`}>
        <p className="text-xl">
          <span>
            {tags.length > 0 && (
              <span className="text-blue-500 ">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-[#242427] mr-2 px-2 py-[6px] rounded-md">{tag}</span>
                ))}
              </span>
            )}
          </span>
          {messageWithoutTags}
        </p>
      </div>
    </div>
  );
}
