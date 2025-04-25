import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import UserAuthForm from './pages/UserAuthForm'
import { createContext, useEffect, useState } from "react";
import { retrieveSession } from "./common/session";
import Editor from "./pages/Editor";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Topics from "./pages/Topics";

export const UserContext = createContext({})

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        const userSession = retrieveSession('user')
        userSession ? setUserAuth(JSON.parse(userSession)) : setUserAuth({ token: null })
    }, [])

    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            <Routes>
                <Route path='editor' element={<Editor />} />
                <Route path='/' element={<Navbar />}>
                    <Route index element={<Home />} />
                    <Route path='signin' element={<UserAuthForm type='sign-in' />} />
                    <Route path='signup' element={<UserAuthForm type='sign-up' />} />
                    <Route path='search/:query' element={<Search />} />
                    <Route path='topics/:topic' element={<Topics />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App;

