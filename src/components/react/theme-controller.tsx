import { useEffect, useState } from "react";

export default function ThemeController() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // 1. Initial theme detection
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    root.style.colorScheme = isDark ? "dark" : "light";

    // 2. Watch for class changes on <html> to keep in sync
    const observer = new MutationObserver(() => {
      const currentTheme = root.classList.contains("dark") ? "dark" : "light";
      setTheme(currentTheme);
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";

    root.classList.toggle("dark", newTheme === "dark");
    root.style.colorScheme = newTheme;

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  // Transparent placeholder to avoid layout shift during hydration
  if (!theme) return <div className="w-12 h-12" />;

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group overflow-hidden"
      aria-label="Toggle Dark Mode"
    >
      <div className="relative w-6 h-6 overflow-hidden">
        {/* Sun Icon */}
        <div
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === "dark" ? "translate-y-10 opacity-0 rotate-90" : "translate-y-0 opacity-100 rotate-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </div>

        {/* Moon Icon */}
        <div
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === "light" ? "-translate-y-10 opacity-0 -rotate-90" : "translate-y-0 opacity-100 rotate-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </div>
      </div>
      
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/0 via-amber-200/0 to-amber-200/20 dark:from-indigo-500/0 dark:via-indigo-500/0 dark:to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
}
