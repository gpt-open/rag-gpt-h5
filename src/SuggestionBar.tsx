const SuggestionBar = ({
  wating,
  messages = [],
  sendQuestion,
}: {
  wating: boolean;
  messages?: string[];
  sendQuestion: (content: string) => void;
}) => {
  if (!messages.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto p-3">
      {messages.map((message, idx) => (
        <button
          key={idx}
          disabled={wating}
          className="px-3 py-1 rounded text-sm whitespace-nowrap bg-zinc-200/50 hover:bg-zinc-200"
          onClick={() => sendQuestion(message)}
        >
          {message}
        </button>
      ))}
    </div>
  );
};

export default SuggestionBar;
