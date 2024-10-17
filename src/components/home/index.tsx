import {  useEffect, useMemo } from "react"
import {useAppRepo} from "../../hooks/useAppProvider.tsx"


export const Home = function() {
    const {appState, setAppState}:any = useAppRepo()


    useEffect(() =>{

        async function getToken() {
            try {

         const tokenResp = await fetch("/api/v1/fetch-token",{
        })

         const token:string = await tokenResp.json()

         setAppState(prevState => ({
             ...prevState,
             token: token,
         }))



            } catch (err:any ) {
                console.error(err.message)
                throw new Error(err)
            }
        }

            getToken()

        return () => {


        }
    },[])

    useMemo(() => {

        if (!appState?.token) return

            if (!appState.sectionID) return

        async function fetchData(content_elements,from:number) {
            try {


                let baseURL = "/api/v1/arc-section/910news"

                if (appState?.sectionID) {
                    baseURL += "?sectionID="+encodeURIComponent(appState?.sectionID) || ""
                }

                if (from > 0 ) {
                    baseURL += baseURL.indexOf("?") < 0 ? "?" : "&"

                    baseURL += "from="+encodeURIComponent(from)
                }

                console.log(from)


            const resp = await fetch(baseURL, {
                headers: {
                    "X-CSRF-TOKEN": appState?.token || ""
                }
            })

            const data = await resp.json()

            console.log(data)

            if (data.next) {

                return fetchData([...content_elements, ...data?.articles?.content_elements], data?.next)

            }

            for (let el of content_elements) {
                let matches = 0

                content_elements.forEach((test,index) {
                    if (el._id == test._id) {
                        matches++
                    }
                })

                if (matches > 1) {
                    console.log("repeats")
                }
            }

        setAppState(prevState => ({
            ...prevState,
            articles: content_elements
        }))
            } catch (err) {
                console.error(err?.message)
            }
        }

        fetchData([],0)

        return () => {}



    }, [appState?.sectionID])


    const handleInput = (e) => {
        setAppState(prevState => {
            return {
                ...prevState,
                sectionID: e.target.value
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(e)


    }

    return (
        <>
        <form action="" onSubmit={handleSubmit}>
        <label htmlFor="sectionID">Arc Section ID: <input type="text" value={appState.sectionID} onChange={handleInput}/></label>
        <input type="submit" value="submit" />
        </form>
        {appState?.articles?.length && <p>{appState?.articles?.length}</p>}
        <ul className="article-list">
        {appState?.articles?.length && appState.articles.map((art,idx) => {
            return <li key={art?._id + '-' + idx}>{art?._id}</li>
        })}
        </ul>
        </>
    )
}
