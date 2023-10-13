import Link from "next/link"
import { GithubIcon } from "./icons"
import Badge from "./badge"

export default function Header() {
  return (
    <header>
      <div className="heading_wrapper">
        <h1>Watchlist</h1>
        <Badge className="badge">Beta</Badge>
      </div>
      <Link href="https://github.com/jcplbr/watchlist" target="_blank">
        <GithubIcon />
      </Link>
    </header>
  )
}
