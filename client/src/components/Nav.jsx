import "../styles/Nav.css"
import {Link} from "react-router-dom"
import Logo from "../assets/bdegueu.png"

function Nav() {

    return (
        <div className="nav">
            <nav>
                <img src={Logo} width="55" height="55" alt="bdegueu"/>
                <ul className="navbar">
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/rezo">Rezo</Link></li>
                    <li><Link to="/articles">Articles</Link></li>
                    <li><Link to="/goodies">Goodies</Link></li>
                    <li><Link to="/comments">Commentaires</Link></li>
                    <li><Link to="/account">Compte</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav