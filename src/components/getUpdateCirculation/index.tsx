import {Navigate, useNavigate, useParams} from "@tanstack/react-router"
import { Route } from "../../routes/__root";
import { RenderPrimarySection } from "./renderPrimarySection";



export const GetUpdateCirculation = () => {
    const navigation = useNavigate();

    const searchParams = Route.useSearch()

    console.log(searchParams)

    return (
        <>
        <h1>Update Circulation</h1>
        {searchParams?._ids.map((id) =>{
            return (
                 <RenderPrimarySection id={id} key={id} />
            )
        })}
        </>
    )
}
