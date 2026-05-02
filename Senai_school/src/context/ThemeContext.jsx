import { createContext, useState, useEffect }  from  'react'

export const ThemeContext = createContext();

export function ThemeProvider({children}) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
      });

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
      };

      useEffect(() => {
        document.body.style.backgroundColor = theme === 'light' ? '#f5f5f5' : '#222';
        document.body.style.color = theme === 'light' ? '#000' : '#fff';
        localStorage.setItem('theme', theme);
      }, [theme]);

    return(
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}