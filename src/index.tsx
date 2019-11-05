import * as React from 'react'

export interface Message {
  [key: string]: any
}

export interface Messages {
  [locale: string]: Message
}

export interface LocaleContextType<T> {
  locale: keyof T
  messages: T
  toggleLocale: React.Dispatch<React.SetStateAction<keyof T>>
}

export function create<T extends Messages>(messages: T, initialLocale: keyof T) {
  const LocaleContext = React.createContext<LocaleContextType<T>>({
    initialLocale,
    messages,
  } as any)

  function useLocale() {
    return React.useContext(LocaleContext).locale
  }

  function useMessages<L extends keyof T>(): T[L]
  function useMessages<K extends keyof S, L extends keyof T, S = T[L]>(key: K): S[K]
  function useMessages(key?: string) {
    const { locale, messages } = React.useContext(LocaleContext)
    if (key) {
      return messages[locale][key]
    }
    return messages[locale]
  }

  function useToggleLocale() {
    return React.useContext(LocaleContext).toggleLocale
  }

  const LocaleProvider: React.FC = props => {
    const [locale, setLocale] = React.useState(initialLocale)

    const value = React.useMemo(() => {
      return {
        locale,
        messages,
        toggleLocale: setLocale,
      }
    }, [locale])
    return (
      <LocaleContext.Provider value={value}>
        {props.children}
      </LocaleContext.Provider>
    )
  }

  return {
    LocaleProvider,
    useLocale,
    useMessages,
    useToggleLocale,
  }
}