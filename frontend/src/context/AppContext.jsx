import { createContext, useContext, useState } from 'react'
const AppContext = createContext(null)
export function AppProvider({ children }) { const [location, setLocation] = useState('Delhi'); return <AppContext.Provider value={{ location, setLocation }}>{children}</AppContext.Provider> }
export function useApp() { return useContext(AppContext) }
