import {Navigate, useNavigate, useParams} from "@tanstack/react-router"



export const GetUpdateCirculation = () => {
    const navigation = useNavigate();

    let {_ids = []} = useParams({from: "/update-circulation" })

    console.log(_ids)

    return (
        <>
        <h1>Update Circulation</h1>
        </>
    )
}
