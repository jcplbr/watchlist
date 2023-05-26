import Link from "next/link";
import { GithubIcon } from "./icons";

export default function Header() {
  return (
    <header>
      <h1>Watchlist</h1>
      <Link
        href="https://github.com/jcplbr/watchlist"
        target="_blank"
        rel="no-referrer"
      >
        <GithubIcon />
      </Link>
    </header>
  );
}
