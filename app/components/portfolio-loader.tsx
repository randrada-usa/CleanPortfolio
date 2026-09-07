import { useEffect, useState } from "react";

export function PortfolioLoader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pageLoaded = document.readyState === "complete";
    let minimumElapsed = reducedMotion;

    const finish = () => {
      if (pageLoaded && minimumElapsed) setExiting(true);
    };
    const onLoad = () => {
      pageLoaded = true;
      finish();
    };
    const timer = window.setTimeout(() => {
      minimumElapsed = true;
      finish();
    }, reducedMotion ? 0 : 1550);

    window.addEventListener("load", onLoad);
    finish();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`portfolio-loader ${exiting ? "is-exiting" : ""}`}
      role="status"
      aria-label="Loading portfolio"
      onAnimationEnd={(event) => {
        if (event.currentTarget === event.target && exiting) setVisible(false);
      }}
    >
      <div className="portfolio-loader-word" aria-hidden="true">
        <span>Loading /RJ</span>
      </div>
      <span className="sr-only">Loading portfolio</span>
    </div>
  );
}
