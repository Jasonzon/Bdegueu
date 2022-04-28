import "../styles/User.css"
import {useState} from "react"
import Pen from "../assets/pen.png"
import Cross from "../assets/cross.png"

function User({user, setUser}) {

    function logout() {
        localStorage.removeItem("token")
        setUser({})
    }

    const [modify, setModify] = useState(false)
    const [inputs, setInputs] = useState({mail:user.polyuser_mail,pseudo:user.polyuser_name,description:user.polyuser_description})

    return (
        <div>
            <div className="connection">
                <h1>Mon compte</h1>
                <button onClick={() => logout()}>Se déconnecter</button>
            </div>
            <div className="perso">
                {modify ? <img onClick={() => {setModify(false);setInputs({mail:user.polyuser_mail,pseudo:user.polyuser_name,description:user.polyuser_description})}} src={Cross} alt="cross" width="50" height="50"/> : <img onClick={() => setModify(true)} src={Pen} alt="pen" width="50" height="50" />}
                {modify ? <input className="user1" value={inputs.pseudo} onChange={(e) => setInputs({mail:inputs.mail, pseudo:e.target.value, description:inputs.description})}/> : <h1>{user.polyuser_name}</h1>}
                {modify ? <input className="user2" value={inputs.mail} onChange={(e) => setInputs({mail:e.target.value, pseudo:inputs.pseudo, description:inputs.description})}/> : <h2>{user.polyuser_mail}</h2>}
                <h3>Rôle : {user.polyuser_role}</h3>
                {modify ? <input className="user3" value={inputs.description} onChange={(e) => setInputs({mail:inputs.mail, pseudo:inputs.pseudo, description:e.target.value})}/> : <p>{user.polyuser_description}</p>}
            </div>
        </div>
    )
}

export default User