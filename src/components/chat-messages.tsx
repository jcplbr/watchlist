import { MessagesContext } from "@/context/messages";
import { FC, useContext } from "react";
import MarkdownLite from "./markdown-lite";

interface ChatMessagesProps {}

const ChatMessages: FC<ChatMessagesProps> = ({}) => {
  const { messages } = useContext(MessagesContext);
  const inverseMessages = [...messages].reverse();

  return (
    <div className="ai-chat">
      <div style={{ display: "flex", flexGrow: "1" }} />
      {inverseMessages.map((message) => (
        <div key={message.id} className="ai-message">
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: message.isUserMessage ? "flex-end" : "",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                overflowX: "hidden",
                order: message.isUserMessage ? "1" : "2",
                alignItems: message.isUserMessage ? "flex-end" : "flex-start",
              }}
            >
              <p
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: message.isUserMessage
                    ? "var(--blue5)"
                    : "var(--grayA4)",
                }}
              >
                <MarkdownLite text={message.text} />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
