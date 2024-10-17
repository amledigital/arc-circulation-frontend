import  * as React from 'react'
import {useState} from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { AppRepo } from '../context/appContext'


export const Route = createRootRoute({
  component: () => {
      const [appState, setAppState] = useState({})

      React.useEffect(() =>{
          setAppState(prevState => {
              return {
                  ...prevState,
                  sectionID: "",
              }
          })
      },[])

      return (
    <React.Fragment>
      <section className="main-nav">
      <div className="main-nav__inner">
      <nav id="mainNav">
      <Link to="/">Home</Link>
      </nav>
      </div>
      </section>
      <AppRepo.Provider value={{appState,setAppState}}>
      <Outlet />
      </AppRepo.Provider>
    </React.Fragment>
  )},
})
