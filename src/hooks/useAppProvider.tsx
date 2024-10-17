import { useContext } from "react"
import { AppRepo } from "../context/appContext"


const useAppRepo = () => {
    return useContext(AppRepo)
}


export {useAppRepo}
