import React from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Loader2, Terminal } from "lucide-react";
import { CornersIcon, Cross1Icon, EraserIcon } from "@radix-ui/react-icons";
import "./App.css";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Separator } from "./components/ui/separator";
import { getBotSettings, getUserToken, requestQA } from "./api";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import {
  clearHistoryMessage,
  getHistoryMessage,
  getUserID,
  saveHistoryMessage,
  saveUserID,
} from "./utils/storage";
import MessageList, { IMessageItem } from "./MessageList";
import InputBar from "./InputBar";
import SuggestionBar from "./SuggestionBar";

const pendingMessage = {
  id: "pending_id",
  status: "pending",
  links: [],
  isRecv: true,
} as unknown as IMessageItem;

const initialMessage = {
  id: uuidv4(),
  status: "success",
  content: "",
  links: [],
  isRecv: true,
  isInitial: true,
  timestamp: Date.now(),
};

const DefaultName = "OpenKF ChatBot";

function App() {
  const [historyMessages, setHistoryMessages] = React.useState(
    [] as IMessageItem[]
  );
  const [loading, setLoading] = React.useState(false);
  const [wating, setWating] = React.useState(false);
  const [isMinScreen, setIsMinScreen] = React.useState(false);
  const [config, setConfig] = React.useState<API.BotSettings>();
  const [withError, setWithError] = React.useState(false);
  const needInitialMessag = React.useRef(true);
  const latestConfig = React.useRef<API.BotSettings | undefined>(config);
  const currentUser = React.useRef(getUserID());
  const authToken = React.useRef("");
  const cancelToken = React.useRef(axios.CancelToken.source());

  latestConfig.current = config;

  React.useEffect(() => {
    if (!currentUser.current) {
      currentUser.current = uuidv4();
      saveUserID(currentUser.current);
    }

    init();

    window.addEventListener("message", (evt) => {
      if (evt.data.event === "openIframe") {
        setIsMinScreen(evt.data.data);
        scrollToBottom("instant");
        if (
          latestConfig.current?.initial_messages.length &&
          needInitialMessag.current
        ) {
          const initialMessages = latestConfig.current.initial_messages.map(
            (message) => {
              initialMessage.content = message;
              return initialMessage;
            }
          );
          setHistoryMessages((prev) => {
            if (prev[prev.length - 1]?.isInitial) {
              return prev;
            }
            return [...prev, ...initialMessages];
          });
        }
        needInitialMessag.current = false;
      }
      if (evt.data.event === "resizeIframe") {
        setIsMinScreen(evt.data.data);
      }
    });
    window.addEventListener("beforeunload", () => {
      setHistoryMessages((msgs) => {
        if (msgs.length) {
          saveHistoryMessage(msgs);
        }
        return msgs;
      });
    });
  }, []);

  const init = async () => {
    setLoading(true);
    try {
      const {
        data: { token },
      } = await getUserToken(currentUser.current!);
      authToken.current = token;
      getConfig();
    } catch (error) {
      setWithError(true);
      return;
    }
    const msgs = getHistoryMessage().filter((msg) => msg.status !== "pending");
    setHistoryMessages(msgs);
    setLoading(false);
  };

  const getConfig = () => {
    getBotSettings().then(({ data }) => {
      setConfig(data.config);
      fireToParent("getConfig", data.config.chat_icon);
    });
  };

  const sendQuestion = async (sendContent: string) => {
    if (wating) {
      cancelToken.current.cancel();
      cancelToken.current = axios.CancelToken.source();
      return;
    }

    if (sendContent) {
      requestQA({
        query: sendContent,
        user_id: currentUser.current!,
        token: authToken.current,
        cancelToken: cancelToken.current.token,
      })
        .then(({ data }) => {
          const newMessage = {
            id: uuidv4(),
            status: "success",
            content: data.answer,
            links: data.source,
            isRecv: true,
            timestamp: Date.now(),
          };
          setHistoryMessages((prev) => {
            prev[prev.length - 1] = newMessage;
            return prev;
          });
          scrollToBottom("smooth");
        })
        .catch((error) => {
          const isCancel = axios.isCancel(error);
          const failedMessage = {
            id: uuidv4(),
            status: "failed",
            content: isCancel
              ? "Cancel to generate answer, please re-ask or request."
              : "Failed to generate answer, please try again later.",
            links: [],
            isRecv: true,
            timestamp: Date.now(),
          };
          setHistoryMessages((prev) => {
            prev[prev.length - 1] = failedMessage;
            return prev;
          });
        })
        .finally(() => setWating(false));
      const sentMessage = {
        id: uuidv4(),
        status: "success",
        content: sendContent,
        links: [],
        isRecv: false,
        timestamp: Date.now(),
      };
      setHistoryMessages((prev) => [...prev, sentMessage, pendingMessage]);
      setWating(true);
      scrollToBottom("smooth");
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior) => {
    setTimeout(() => {
      const lastEl = document.getElementById("message-list-btm");
      if (lastEl) {
        lastEl.scrollIntoView({ behavior });
      }
    }, 50);
  };

  const closeIframe = () => fireToParent("closeIframe");

  const toogleSize = () => fireToParent("toogleSize");

  const fireToParent = (event: string, data?: any) => {
    window.parent.postMessage({ event, data }, "*");
  };

  const clearMessages = () => {
    clearHistoryMessage();
    setHistoryMessages([]);
  };

  const regenerateAnswer = (id: string) => {
    const idx = historyMessages.findIndex((msg) => msg.id === id);
    const question = historyMessages[idx - 1]?.content;
    if (question) {
      requestQA({
        query: question,
        user_id: currentUser.current!,
        token: authToken.current,
        cancelToken: cancelToken.current.token,
      })
        .then(({ data }) => {
          const newMessage = {
            id: uuidv4(),
            status: "success",
            content: data.answer,
            links: data.source,
            isRecv: true,
            timestamp: Date.now(),
          };
          setHistoryMessages((prev) => {
            prev[idx] = newMessage;
            return prev;
          });
          scrollToBottom("smooth");
        })
        .catch((error) => {
          const isCancel = axios.isCancel(error);
          const failedMessage = {
            id: uuidv4(),
            status: "failed",
            content: isCancel
              ? "Cancel to generate answer, please re-ask or request."
              : "Failed to generate answer, please try again later.",
            links: [],
            isRecv: true,
            timestamp: Date.now(),
          };
          setHistoryMessages((prev) => {
            prev[idx] = failedMessage;
            return prev;
          });
        })
        .finally(() => setWating(false));
      setHistoryMessages((prev) => {
        prev[idx] = { ...prev[idx], status: "pending", content: "", links: [] };
        return prev;
      });
      setWating(true);
    }
  };

  const botName = config?.bot_name || DefaultName;

  return (
    <div className="h-screen flex flex-col">
      {/* header */}
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="mr-3">
            <AvatarImage src={config?.bot_avatar} alt={botName} />
            <AvatarFallback>{botName}</AvatarFallback>
          </Avatar>
          <div>{botName}</div>
        </div>
        <div className="flex space-x-2">
          <EraserIcon
            className="w-5 h-5 cursor-pointer"
            onClick={clearMessages}
          />
          {!isMinScreen && (
            <CornersIcon
              className="w-5 h-5 cursor-pointer"
              onClick={toogleSize}
            />
          )}
          <Cross1Icon
            className="w-5 h-5 cursor-pointer"
            onClick={closeIframe}
          />
        </div>
      </div>
      <Separator />

      {/* main content */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          {withError ? (
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Connection failed</AlertTitle>
              <AlertDescription>
                Failed to connect to the server, please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-gray-400">loading...</span>
            </>
          )}
        </div>
      ) : (
        <MessageList
          messages={historyMessages}
          regenerateAnswer={regenerateAnswer}
        />
      )}
      <SuggestionBar
        wating={wating}
        messages={config?.suggested_messages}
        sendQuestion={sendQuestion}
      />
      <Separator />
      <InputBar
        loading={loading}
        wating={wating}
        placeholder={config?.placeholder}
        sendQuestion={sendQuestion}
      />
    </div>
  );
}

export default App;
