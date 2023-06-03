import { Command } from "cmdk";
import { Item } from "./command-menu";
import ChatMessages from "./chat-messages";

export default function AskAI() {
  return (
    <Command.Group>
      <Item className="ai-item">
        <ChatMessages />
      </Item>
    </Command.Group>
  );
}
