import {  useEffect, useMemo,useRef } from "react"
import { RenderCheckbox } from "./children/RenderCheckbox.tsx";
import {useAppRepo} from "../../hooks/useAppProvider.tsx"
import "./style.scss";

const PROD_BASE_URL:string = "https://www.9and10news.com"
const DEV_BASE_URL:string = "https://910.ledigital.dev"
const PROD_EDIT_URL_BASE:string = "https://910mediagroup.arcpublishing.com/composer/edit/"
const DEV_EDIT_URL_BASE:string = "https://sandbox.910mediagroup.arcpublishing.com/composer/edit/"



export const Home = function() {
    const {appState, setAppState}:any = useAppRepo()

    // set defaults
    useEffect(() => {
        setAppState(prevState => ({
            ...prevState,
            content_elements: [],
            next: 0,
            // this has to be initalized or else you'll get an uncontrolled input checkbox
            checkState: {},
        loading: true,
        fetchMore: true,
        }))
    },[])

    useEffect(()=>{
        //console.log(appState)
    },[appState])

    const inputRef = useRef(null)
    useEffect(() =>{
        if (!inputRef.current) return 
        async function getToken() {
            try {
         const tokenResp = await fetch("/api/v1/fetch-token",{
        })
         const token:string = await tokenResp.json()
         setAppState((prevState: Object) => ({
             ...prevState,
             token: token,
         }))
            } catch (err:any ) {
                console.error(err.message)
                throw new Error(err)
            }
        }
            getToken()
        return () => {}
    },[])

    useEffect(() => {
       if (!inputRef.current || !appState.token || !appState.sectionID) return
        if (!appState?.fetchMore) return

            setAppState(prevState => ({
                ...prevState,
                loading: true,
            }))
            
            async function fetchData(from:number = 0) {
            try {
                let baseURL = "/api/v1/arc-section/910news"
                if (appState?.sectionID) {
                    baseURL += "?sectionID="+encodeURIComponent(appState?.sectionID) || ""
                }
                if (from > 0 ) {
                    console.log(from)
                    baseURL += baseURL.indexOf("?") < 0 ? "?" : "&"
                    baseURL += "from="+encodeURIComponent(from)
                }
            const resp = await fetch(baseURL, {
                headers: {
                    "X-CSRF-TOKEN": appState?.token || ""
                }
            })
            const data = await resp.json()
                
            setAppState(prevState => ({
                    ...prevState,
                    content_elements: [...(prevState.content_elements || []), ...(data?.articles?.content_elements || [])],
                    articleCount: [...(prevState.content_elements || []), ...(data?.articles?.content_elements || [])].length,
                    fetchMore: data?.next > 0,
                    loading: data?.next > 0,
                    next: data.next,
                }))


            } catch (err) {
                console.error(err?.message)
            }
        }



        {appState.fetchMore && fetchData(appState.next)}
        return () => {

            }
        
    }, [appState?.sectionID, appState?.fetchMore,appState.next])
    const handleOnClick = (e) => {
        setAppState(prevState => ({
            ...prevState,
            fetchMore: true,
        }))
    }
    const handleInput = (e) => {

        // reset everything except sectionID
        setAppState(prevState => {
            return {
                ...prevState,
                articleCount: 0,
                fetchMore: true,
                next: 0,
                content_elements: [],
                sectionID: e.target.value
            }
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleCheckbox = (e) => {
        setAppState(prevState => ({
            ...prevState,
            checkState: {
                ...prevState?.checkState,
                [e.target.getAttribute('data-id')]: e.target.checked
            }
        }))
    }
    return (
        <>
        <form action="" onSubmit={handleSubmit}>
        <label htmlFor="sectionID">Arc Section ID: <input type="text" value={appState.sectionID} onChange={handleInput} /></label>
        <input type="submit" value="submit" ref={inputRef} />
        </form>
        {appState.loading && <p>Loading...</p>}
        {appState?.articleCount ? <p>{appState?.articleCount}</p> : null}
        {appState?.next > 0 ? <button onClick={handleOnClick}>Fetch More Articles</button> : null}
        {!appState.loading && <form method="PUT" action="#" className="article-list">
                <table>
                <thead>
                <tr>
                <td>select</td>
                <td>_id</td>
                <td>URL</td>
                <td>Edit</td>
                <td>Primary Section</td>
                <td>All  Sections</td>
                </tr>
                </thead>
                <tbody>
        {appState?.content_elements?.length ?  appState.content_elements.map((art,idx) => {
            return (
                <tr key={idx}>
                <td data-id={art?._id}>{idx+1}<RenderCheckbox _id={art?._id} handleCheckAction={handleCheckbox} toggleState={ appState?.checkState[art?._id] ?? false} /> </td>
                <td>{art?._id}</td>
                <td><a 
                    href={import.meta.env.PROD ? PROD_BASE_URL : DEV_BASE_URL + art?.website_url} 
                    rel="nofollow noreferrer noopener" 
                    target="_blank" 
                    title={art?.headlines?.basic} 
                    aria-label={art?.headlines?.basic}>
                    {art?.headlines?.basic} (new tab)
                    </a></td>
                <td><a 
                    href={import.meta.env.PROD ? PROD_EDIT_URL_BASE + art?._id : DEV_EDIT_URL_BASE + art?._id } 
                    target="_blank">Edit (new tab)</a></td>
                <td>{art?.taxonomy?.primary_section?._id}</td>
                <td>{art?.taxonomy?.sections?.length && (
                    <ul>
                    {art?.taxonomy.sections.map((section, idx) => {
                    return (
                        <li key={section + '-' + idx}>{section?._id}</li>
                    )
                })}
                </ul>
                )}</td>
                </tr>
            )
        }) : null}
                </tbody>
                </table>
               <div className="form-control">
                <input type="submit" value="Recirculate Checked" />
               </div> 
        </form>}
        </>
    )
}
