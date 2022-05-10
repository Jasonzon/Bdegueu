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
import { useState, useEffect } from "react";

function Main() {

    const [user, setUser] = useState({})
    const [connection, setConnection] = useState(true)

    async function auth() {
        if (localStorage.token) {
            const res = await fetch("http://localhost:5000/polyuser/auth", {
                method: "GET",
                headers: {token: localStorage.token}
            })
            const parseRes = await res.json()
            const res2 = await fetch(`http://localhost:5000/polyuser/id/${parseRes.polyuser_id}`, {
                method: "GET"
            })
            const parseRes2 = await res2.json()
            setUser(parseRes2)
        }
    }

    useEffect(() => {
        auth()
    },[])

    return (
        <Router>
            <Nav />
            <Routes>
                <Route path="*" element={<Error user={user} setUser={setUser} />} />
                <Route exact path="/" element={<Home user={user} setUser={setUser}  />} />
                <Route exact path="/rezo" element={<Rezo user={user} setUser={setUser}  />} />
                <Route exact path="/goodies" element={<Goodies user={user} setUser={setUser} />} />
                <Route exact path="/articles" element={<Articles user={user} setUser={setUser} />} />
                <Route exact path="/comments" element={<Comments user={user} setUser={setUser} comment_id={1} />} />
                <Route exact path="/account" element ={<Compte user={user} setUser={setUser} connection={connection} setConnection={setConnection} />} />
                <Route exact path="/articles/:id" element={<Article user={user} setUser={setUser} />} />
                <Route exact path="/users/:id" element={<Users />} />
            </Routes>
        </Router>
    )
}

export default Main