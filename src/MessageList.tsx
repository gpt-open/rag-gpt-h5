import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {
  CheckIcon,
  ClipboardCopyIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { ScrollArea } from "./components/ui/scroll-area";
import { cn, copyToClipboard } from "./utils/common";
import { Separator } from "./components/ui/separator";

dayjs.extend(relativeTime);

export interface IMessageItem {
  id: string;
  status: string;
  content: string;
  links: string[];
  isRecv: boolean;
  isInitial?: boolean;
  timestamp: number;
}

const MessageItem = ({
  message,
  reverse,
  regenerateAnswer,
}: {
  message: IMessageItem;
  reverse?: boolean;
  regenerateAnswer: (id: string) => void;
}) => {
  const [copyLoading, setCopyLoading] = React.useState(false);
  const isPending = message.status === "pending";
  const showMessageAcitions =
    !isPending && message.isRecv && !message.isInitial;

  const copyAnswer = () => {
    copyToClipboard(message.content);
    setCopyLoading(true);
    setTimeout(() => {
      setCopyLoading(false);
    }, 1500);
  };

  return (
    <div
      id={`msg_${message.id}`}
      style={{ maxWidth: "calc(100vw - 1.5rem)" }}
      className={cn("mb-5 flex flex-col", reverse && "items-end")}
    >
      <div className="max-w-[90%] w-fit overflow-hidden">
        <div
          className={cn(
            "px-3 py-4 mt-1 rounded-md w-full break-all markdown-body",
            reverse
              ? "rounded-tr-none bg-[#6f44fc]"
              : "rounded-tl-none bg-zinc-200/50"
          )}
        >
          <MarkdownPreview
            wrapperElement={{
              "data-color-mode": "light",
            }}
            className={reverse ? "bg-[#6f44fc] text-white" : "bg-[#f1f1f3]"}
            components={{
              a: ({ children, ...props }) => (
                <a {...props} target="_blank">
                  {children}
                </a>
              ),
            }}
            source={message.content}
          />

          {!!message.links.length && (
            <>
              <Separator className="bg-gray-300 my-2" />
              <div className="flex flex-col space-y-1">
                {message.links.map((link) => (
                  <a
                    className="px-2 py-[2px] border rounded border-gray-300 cursor-pointer truncate inline-block max-w-[90%] w-fit"
                    title={link}
                    href={link}
                    key={link}
                    target="_blank"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </>
          )}
          {isPending && (
            <div className="loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          {showMessageAcitions && (
            <div className="flex space-x-3 mt-2">
              {copyLoading ? (
                <CheckIcon className="text-gray-800" />
              ) : (
                <ClipboardCopyIcon
                  className="text-gray-800 hover:text-gray-400 cursor-pointer"
                  onClick={copyAnswer}
                />
              )}

              <UpdateIcon
                className="text-gray-800 hover:text-gray-400 cursor-pointer"
                onClick={() => regenerateAnswer(message.id)}
              />
            </div>
          )}
        </div>
      </div>
      <p
        className={cn(
          "text-sm text-muted-foreground mt-1",
          reverse && "text-right"
        )}
      >
        {dayjs(message.timestamp).fromNow()}
      </p>
    </div>
  );
};

const MessageList = ({
  messages,
  regenerateAnswer,
}: {
  messages: IMessageItem[];
  regenerateAnswer: (id: string) => void;
}) => {
  return (
    <ScrollArea className="flex-1 px-3">
      {messages.map((message) => (
        <MessageItem
          message={message}
          key={message.id}
          reverse={!message.isRecv}
          regenerateAnswer={regenerateAnswer}
        />
      ))}
      <div id="message-list-btm" className="h-px"></div>
    </ScrollArea>
  );
};

export default MessageList;
