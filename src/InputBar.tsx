import React from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { PaperPlaneIcon, StopIcon } from "@radix-ui/react-icons";

const InputBar = ({
  loading,
  wating,
  placeholder,
  sendQuestion,
}: {
  loading: boolean;
  wating: boolean;
  placeholder?: string;
  sendQuestion: (content: string) => void;
}) => {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!loading && !wating) {
      inputRef.current?.focus();
    }
  }, [loading, wating]);

  const interalSendQuestion = () => {
    sendQuestion(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex w-full items-center p-3">
      <Input
        className="mr-2 focus-visible:ring-transparent"
        type="text"
        ref={inputRef}
        value={inputValue}
        placeholder={placeholder || "Please input your question"}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && interalSendQuestion()}
        disabled={loading || wating}
      />
      <Button
        disabled={loading}
        variant="outline"
        onClick={interalSendQuestion}
      >
        {!wating ? (
          <StopIcon className="w-6 h-6" />
        ) : (
          <PaperPlaneIcon className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default InputBar;
