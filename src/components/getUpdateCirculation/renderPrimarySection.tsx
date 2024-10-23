import {useState, useCallback,useMemo, useEffect} from 'react'
type RenderPrimarySectionProps = {
_id: string;

}


export const RenderPrimarySection = function({id}:{id:string}) {
    const [circulation,setCirculation] = useState({})

    useEffect(() => {
        console.log(id)
        console.log(circulation)
    },[])

    useMemo(() => {
        const fetchData = async function(){
            try {

                const resp = await fetch("/api/v1/"+id)

                const data = await resp.json()

                console.log("data",data)

                setCirculation(data)

                
            } catch (err:any) {
                console.error(err.message)
                throw new Error(err)
            }
        }

        fetchData()
    },[])


    return (
        <>
        <select id="primarySection">

        </select>
        </>
    )
}
