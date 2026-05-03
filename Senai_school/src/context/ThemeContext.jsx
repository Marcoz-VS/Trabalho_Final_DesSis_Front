import { createContext, useState, useEffect, useLayoutEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({children}) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
      });

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
      };

      useLayoutEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }, [theme]);

      useEffect(() => {
        localStorage.setItem("theme", theme);
      }, [theme]);

    return(
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}