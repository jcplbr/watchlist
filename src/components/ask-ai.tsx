import { Command } from "cmdk";
import ChatMessages from "./chat-messages";
import Item from "@/helpers/cmdk-item";

export default function AskAI() {
  return (
    <Command.Group>
      <Item className="ai-item">
        <ChatMessages />
      </Item>
    </Command.Group>
  );
}
