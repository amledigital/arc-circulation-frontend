import {createContext} from "react"

interface CurrentAppContext {
    appContext: any | null;
    setAppContext: Function | null;
}

const AppRepo = createContext<CurrentAppContext | {}>({})
export {AppRepo}
