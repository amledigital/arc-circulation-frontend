import {  SetStateAction, useEffect, useMemo,useRef } from "react"
import {Navigate, redirect, useNavigate} from "@tanstack/react-router"
import {useAppRepo} from "../../hooks/useAppProvider.tsx"
import {Route} from "../../routes/index.lazy.tsx"
import {HomeSearchParams} from "../../routes/index.lazy.tsx"
import {RenderCheckbox} from "./renderCheckbox.tsx"
import "./style.scss";

const PROD_BASE_URL:string = "https://www.9and10news.com"
const DEV_BASE_URL:string = "https://910.ledigital.dev"
const PROD_EDIT_URL_BASE:string = "https://910mediagroup.arcpublishing.com/composer/edit/"
const DEV_EDIT_URL_BASE:string = "https://sandbox.910mediagroup.arcpublishing.com/composer/edit/"



export const Home = function() {
    const {appState, setAppState}:any = useAppRepo()
    const inputRef = useRef(null)
    let navigate = useNavigate({from: Route.fullPath})

    const {sectionID ="", from = 0, size = 10}:HomeSearchParams= Route.useSearch()
        
    const updateFilters = (name: keyof HomeSearchParams, value: unknown) => {
        navigate({search: (prev) => ({...prev, [name]: value})})
    }

    useEffect(()=>{
        //console.log(appState)
    },[appState])


    useEffect(() => {
        setAppState(prevState => ({
            ...prevState,
            // this has to be initalized or else you'll get an uncontrolled input checkbox
            checkState: {},
            sectionID: sectionID ? sectionID : "",
            next: from || 0,
            isFull : false,
            size: size || 10,
        }))
    },[])

    useEffect(function(){
        setAppState(prev => ({
            ...prev,
            fetchMore: true,
        }))
    },[])

    useEffect(() => {
        setAppState(prevState => ({
            ...prevState,
            isFull: appState?.articles?.length > 0 && appState?.articles?.length === appState?.totalCount
        }))
    }, [appState?.articles, appState?.isFull])

    
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
            if (appState?.isFull) return
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


            setAppState(prevState => ({
            ...prevState,
            totalCount: data?.articles?.count || null,
            articles: [...(data?.articles?.content_elements.length ? data.articles.content_elements : []),...content_elements],
            articleCount: [...(data?.articles?.content_elements.length ? data.articles.content_elements : []),...content_elements].length,
            isFull: appState?.articles?.length === data?.articles?.count,
            fetchMore: false,
            next: data?.next || null,
        }))
        updateFilters("from", appState?.next)

            } catch (err) {
                console.error(err?.message)
            }
        }

            // either continue building article list, or start fresh
        
            if (appState?.articles?.length > 0 && appState?.articles?.length === appState?.totalCount) return 

        fetchData([...(appState?.articles?.length ? appState.articles : [])],appState?.next || from || 0)


        return () => {

            }
        
    }, [appState?.sectionID, appState?.fetchMore])
    const handleOnClick = (e) => {
        if (appState?.articles?.length === appState?.totalCount) return 
        setAppState(prevState => ({
            ...prevState,
            fetchMore: true,
        }))
    }


    const handleInput = (e:React.FormEvent) => {
        // reset everything except sectionID
        //updateFilters("sectionID", e.target.value)
        setAppState(prevState => {
            return {
                ...prevState,
                articles: [],
                totalCount: 0,
                isFull: false,
                size: 10,
                checkState: {},
                next: 0,
                fetchMore: false,
                sectionID: e.target.value
            }
        })
    }
    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault()

        // could have just used filter, but whatever

        let preparedIDs = Array.from(e.target.ansId).reduce<any[]>((acc,curr) => {
            if (curr.checked<Boolean>) {
                return acc.concat([curr])
            }
            return acc
        },[]).map(el => (el.value))
        console.log(preparedIDs)

        navigate({to: "/update-circulation", search: () => ({
            _id: preparedIDs
        })})

    }


    const handleCheckbox = (e:EventTarget) => {
        setAppState((prevState) => ({
            ...prevState,
            checkState: {
                ...prevState?.checkState,
                [e.target.getAttribute('data-id')]: e.target?.checked
            }
        }))
    }
    return (
        <>
        <form action="" onSubmit={handleSubmit}>
        <label htmlFor="sectionID">Arc Section ID: <input type="text"  value={appState?.sectionID}  onChange={handleInput} /></label>
        </form>
        <label htmlFor="size">Size: <input type="number" name="count" id="count" value={10}  onChange={(e) => updateFilters("size", parseInt(e.target.value))}/>  </label>
        {appState?.next > 0 ? <><br /><button onClick={handleOnClick}>Fetch More Articles</button></> : null}
        {appState?.articleCount ? <p>Total Articles: {appState?.articleCount}</p> : null}
        <form method="PUT" action="#" className="article-list" onSubmit={handleSubmit}>
        <input type="submit" value="submit" ref={inputRef} id="sectionForm" />
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
