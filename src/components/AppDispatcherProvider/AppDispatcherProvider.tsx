import { createContext, useContext, useMemo } from 'react'
import { createAppDispatcher } from '../../data/appDispatcher'
import type { ReactNode } from 'react'
import type { AppDispatcher } from '../../data/appDispatcher'

type AppDispatcherProviderProps = {
  children: ReactNode
}

const AppDispatcherContext = createContext<AppDispatcher | undefined>(undefined)

export const AppDispatcherProvider = ({ children }: AppDispatcherProviderProps) => {
  const dispatcher = useMemo(() => createAppDispatcher(), [])

  return (
    <AppDispatcherContext.Provider value={dispatcher}>
      {children}
    </AppDispatcherContext.Provider>
  )
}

export const useAppDispatcher = () => {
  const dispatcher = useContext(AppDispatcherContext)

  if (!dispatcher) {
    throw new Error('useAppDispatcher must be used within AppDispatcherProvider')
  }

  return dispatcher
}
