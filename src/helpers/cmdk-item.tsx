import { Command } from "cmdk";

export default function Item({
  children,
  shortcut,
  onSelect = () => {},
  className,
}: {
  children: React.ReactNode;
  shortcut?: string;
  onSelect?: (value: string) => void;
  className?: string;
}) {
  return (
    <Command.Item className={className} onSelect={onSelect}>
      {children}
      {shortcut && (
        <div cmdk-vercel-shortcuts="">
          {shortcut.split(" ").map((key) => {
            return <kbd key={key}>{key}</kbd>;
          })}
        </div>
      )}
    </Command.Item>
  );
}
