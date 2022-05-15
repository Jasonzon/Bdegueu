import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './Home';
import Nav from "./Nav"
import Error from "./Error"
import Rezo from "./Rezo"
import Goodies from "./Goodies"
import Articles from "./Articles"
import Comments from "./Comments"
import Compte from "./Compte"
import Article from "./Article"
import Users from "./Users"
import Footer from "./Footer"
import { useState, useEffect } from "react";

function Main() {

    const [user, setUser] = useState({})
    const [connection, setConnection] = useState(true)

    async function auth() {
        if (localStorage.token) {
            const res = await fetch("/polyuser/auth", {
                method: "GET",
                headers: {token: localStorage.token}
            })
            const parseRes = await res.json()
            const res2 = await fetch(`/polyuser/id/${parseRes.polyuser_id}`, {
                method: "GET"
            })
            const parseRes2 = await res2.json()
            setUser({polyuser_id:parseRes2.polyuser_id,polyuser_role:parseRes2.polyuser_role,polyuser_mail:parseRes.polyuser_mail,polyuser_description:parseRes2.polyuser_description,polyuser_name:parseRes2.polyuser_name})
        }
    }

    useEffect(() => {
        auth()
    },[])

    return (
        <Router>
            <Nav />
            <Routes>
                <Route exact path="/" element={<Home user={user} setUser={setUser}  />} />
                <Route exact path="/rezo" element={<Rezo user={user} setUser={setUser}  />} />
                <Route exact path="/goodiz" element={<Goodies user={user} setUser={setUser} />} />
                <Route exact path="/articles" element={<Articles user={user} setUser={setUser} />} />
                <Route exact path="/comments" element={<Comments user={user} setUser={setUser} comment_id={1} />} />
                <Route exact path="/account" element ={<Compte user={user} setUser={setUser} connection={connection} setConnection={setConnection} />} />
                <Route exact path="/articles/:id" element={<Article user={user} setUser={setUser} />} />
                <Route exact path="/users/:id" element={<Users />} />
                <Route path="*" element={<Error />} />
            </Routes>
            <Footer />
        </Router>
    )
}

export default Main