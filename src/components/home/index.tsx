import {  useEffect, useMemo,useRef } from "react"
import {useAppRepo} from "../../hooks/useAppProvider.tsx"
import "./style.scss";

const PROD_BASE_URL = "https://www.9and10news.com"
const DEV_BASE_URL = "https://910.ledigital.dev"
const PROD_EDIT_URL_BASE = "https://910mediagroup.arcpublishing.com/composer/edit/"
const DEV_EDIT_URL_BASE = "https://sandbox.910mediagroup.arcpublishing.com/composer/edit/"

export function RenderCheckbox({_id, toggleState, handleCheckAction}:{_id:string,toggleState:boolean,handleCheckAction:any}) {
    return (
    <input type="checkbox" data-id={_id} checked={toggleState} name={`ansId`} value={_id} onChange={handleCheckAction} />
    )
}

export function ConstructLink({_id, title,url}:{_id:string, title:string,url:string}) {
    let base = import.meta.env.PROD ? 'https://www.9and10news.com' : 'https://910.ledigital.dev'
        let editBase = import.meta.env.PROD ? 'https://910mediagroup.arcpublishing.com/composer/edit/' : 'https://sandbox.910mediagroup.arcpublishing.com/composer/edit/'
    return (
        <>
        <a href={base.concat(url)} title={title} aria-label={title} target="_blank" rel="nofollow noreferrer noopener">{title}</a> &nbsp;&mdash;&nbsp;
        <a href={editBase + _id } title={"Edit: "+title} aria-label={"Edit: "+title} rel="nofollow noreferrer noopener" target="_blank">Edit</a>
        </>
    )
}

export const Home = function() {
    const {appState, setAppState}:any = useAppRepo()
    useEffect(() => {
        setAppState(prevState => ({
            ...prevState,
            // this has to be initalized or else you'll get an uncontrolled input checkbox
            checkState: {},
        }))
    },[])

    useEffect(()=>{
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

    useMemo(() => {
        if (!inputRef.current) return
        if (!appState?.token) return
        if (!appState.sectionID) return
        if (appState?.next > 0 && !appState?.fetchMore) return 
        async function fetchData(content_elements:any,from:number) {
            try {
                let baseURL = "/api/v1/arc-section/910news"
                if (appState?.sectionID) {
                    baseURL += "?sectionID="+encodeURIComponent(appState?.sectionID) || ""
                }
                if (from > 0 ) {
                    baseURL += baseURL.indexOf("?") < 0 ? "?" : "&"
                    baseURL += "from="+encodeURIComponent(from)
                }
            const resp = await fetch(baseURL, {
                headers: {
                    "X-CSRF-TOKEN": appState?.token || ""
                }
            })
            const data = await resp.json()

            if (data.next) {
                setAppState(prevState => ({
                    ...prevState,
                    next: data.next
                }))
                //return fetchData([...content_elements, ...data?.articles?.content_elements], data?.next)
            } else {
                setAppState(prevState => ({
                    ...prevState,
                    next: 0,
                }))
            }
        setAppState(prevState => ({
            ...prevState,
            articles: [...(data?.articles?.content_elements.length ? data.articles.content_elements : []),...content_elements],
            articleCount: [...(data?.articles?.content_elements.length ? data.articles.content_elements : []),...content_elements].length,
            fetchMore: false,
        }))
            } catch (err) {
                console.error(err?.message)
            }
        }
        fetchData([...(appState?.articles?.length ? appState.articles : [])],appState?.next ?? 0)
        return () => {}
    }, [appState?.sectionID, appState?.fetchMore])
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
                fetchMore: false,
                articles: [],
                next: 0,
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
        {appState?.articleCount ? <p>{appState?.articleCount}</p> : null}
        {appState?.next > 0 ? <button onClick={handleOnClick}>Fetch More Articles</button> : null}
        <form method="PUT" action="#" className="article-list">
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
        {appState?.articles?.length ?  appState.articles.map((art,idx) => {
            return (
                <tr key={art?._id}>
                <td data-id={art?._id}><RenderCheckbox _id={art?._id} handleCheckAction={handleCheckbox} toggleState={ appState?.checkState[art?._id] ?? false} /> </td>
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
        </form>
        </>
    )
}
