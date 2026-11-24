import { createRoot } from "react-dom/client";
import App from "./App";
import { BASE_PATH } from "./lib/sitePath";
import "./index.css";

// Static hosts (e.g. GitHub Pages) redirect /profile to /profile/. Drop the trailing
// slash so client routes match, keeping any #section or ?query intact.
{
  const { pathname, search, hash } = window.location;
  if (pathname.length > 1 && pathname.endsWith("/") && pathname !== `${BASE_PATH}/`) {
    window.history.replaceState(null, "", `${pathname.replace(/\/+$/, "")}${search}${hash}`);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
