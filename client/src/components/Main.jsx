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
import { useState } from "react";

function Main() {

    const [user, setUser] = useState({})
    const [connection, setConnection] = useState(true)

    return (
        <Router>
            <Nav />
            <Routes>
                <Route path="*" element={<Error user={user} setUser={setUser} />} />
                <Route exact path="/" element={<Home user={user} setUser={setUser}  />} />
                <Route exact path="/rezo" element={<Rezo user={user} setUser={setUser}  />} />
                <Route exact path="/goodies" element={<Goodies user={user} setUser={setUser} />} />
                <Route exact path="/articles" element={<Articles user={user} setUser={setUser} />} />
                <Route exact path="/comments" element={<Comments user={user} setUser={setUser} comment_id={0} />} />
                <Route exact path="/account" element ={<Compte user={user} setUser={setUser} connection={connection} setConnection={setConnection} />} />
                <Route exact path="/articles/:id" element={<Article user={user} setUser={setUser} />} />
            </Routes>
        </Router>
    )
}

export default Main