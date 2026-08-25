import { Link } from "react-router";

export function loader() {
  throw new Response("Not Found", { status: 404, statusText: "Not Found" });
}

export default function NotFound() {
  return <main className="error-page"><p className="kicker">/404</p><h1>Not found.</h1><p>That page does not exist.</p><Link className="button button-dark" to="/">Back home ↗</Link></main>;
}
