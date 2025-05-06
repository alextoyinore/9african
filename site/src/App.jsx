import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import UserAuthForm from './pages/UserAuthForm'
import { createContext, useEffect, useState } from "react";
import { retrieveSession } from "./common/session";
import Editor from "./pages/Editor";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Topics from "./pages/Topics";
import PageNotFound from "./pages/404";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";

export const UserContext = createContext({})

const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        const userSession = retrieveSession('user')
        userSession ? setUserAuth(JSON.parse(userSession)) : setUserAuth({ token: null })
    }, [1])

    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            <Routes>
                <Route path='/editor' element={<Editor />} />
                <Route path='/editor/:blog_id' element={<Editor />} />
                <Route path='/' element={<Navbar />}>
                    <Route index element={<Home />} />
                    <Route path='signin' element={<UserAuthForm type='sign-in' />} />
                    <Route path='signup' element={<UserAuthForm type='sign-up' />} />
                    <Route path='user/:username' element={<Profile />} />
                    <Route path='search/:query' element={<Search />} />
                    <Route path='topics/:topic' element={<Topics />} />
                    <Route path="/blog/:id" element={<Blog />} />
                    <Route path='*' element={<PageNotFound />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

export default App;

