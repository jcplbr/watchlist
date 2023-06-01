import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";

const ListButton = ({
  current_list,
  changeListToNone,
  changeListToWatching,
}: {
  current_list: string;
  changeListToNone: () => void;
  changeListToWatching: () => void;
}) => {
  const [list, setList] = useState<string>(current_list);

  useEffect(() => {
    const channel = supabase
      .channel("channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "movies" },
        (payload) => {
          setList(payload.new.current_list);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <p>List: {list}</p>
      {list === "Watching" ? (
        <button onClick={() => changeListToNone()}>Change to None</button>
      ) : (
        <button onClick={() => changeListToWatching()}>
          Change to Watching
        </button>
      )}
    </>
  );
};

export default ListButton;
