import "../styles/Nav.css"
import {Link} from "react-router-dom"
import Logo from "../assets/bdegueu.png"

function Nav() {

    return (
        <div className="nav">
            <nav>
                <img src={Logo} width="55" height="55" alt="bdegueu"/>
                <ul className="navbar">
                    <li><Link className="link" to="/">Accueil</Link></li>
                    <li><Link className="link" to="/rezo">Rezo</Link></li>
                    <li><Link className="link" to="/articles">Articles</Link></li>
                    <li><Link className="link" to="/goodiz">Goodies</Link></li>
                    <li><Link className="link" to="/comments">Commentaires</Link></li>
                    <li><Link className="link" to="/account">Compte</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav