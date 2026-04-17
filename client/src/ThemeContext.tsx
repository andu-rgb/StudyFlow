import { createContext, useContext, useEffect, useState } from "react";

type Theme =
  | "pink-light"
  | "pink-dark"
  | "purple-light"
  | "purple-dark"
  | "matcha-light"
  | "matcha-dark";

const pairs: Record<Theme, Theme> = {
  "pink-light": "pink-dark",
  "pink-dark": "pink-light",

  "purple-light": "purple-dark",
  "purple-dark": "purple-light",

  "matcha-light": "matcha-dark",
  "matcha-dark": "matcha-light",
};

const ThemeContext = createContext({
  theme: "pink-light" as Theme,
  setTheme: (_: Theme) => {},
  toggleDark: () => {},
  isDark: false,
});

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] =
    useState<Theme>("pink-light");

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("sf-theme", t);
    document.documentElement.setAttribute(
      "data-theme",
      t
    );
  };

  const toggleDark = () =>
    setThemeState((prev) => {
      const next = pairs[prev];

      localStorage.setItem("sf-theme", next);
      document.documentElement.setAttribute(
        "data-theme",
        next
      );

      return next;
    });

  useEffect(() => {
    const saved = localStorage.getItem(
      "sf-theme"
    ) as Theme;

    setTheme(saved || "pink-light");
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleDark,
        isDark: theme.endsWith("-dark"),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () =>
  useContext(ThemeContext);