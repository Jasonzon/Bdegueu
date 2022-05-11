import "../styles/User.css"
import {useState} from "react"
import Pen from "../assets/pen.png"
import Cross from "../assets/cross.png"
import Tick from "../assets/tick.png"

function User({user, setUser}) {

    function logout() {
        localStorage.removeItem("token")
        setUser({})
    }

    const [holder, setHolder] = useState("")
    const [holder2, setHolder2] = useState("")

    const [modify, setModify] = useState(false)
    const [inputs, setInputs] = useState({mail:user.polyuser_mail,pseudo:user.polyuser_name,description:user.polyuser_description})

    async function update() {
        if (inputs.mail === "") {
            setHolder("Entrez une adresse mail")
        }
        if (inputs.pseudo === "") {
            setHolder2("Entrez un pseudo")
        }
        if (inputs.pseudo !== "" && inputs.mail !== "") {
            const res = await fetch(`/polyuser/mail/${inputs.mail}`, {
                method: "GET"
            })
            const parseRes = await res.json()
            if (parseRes.length === 0 || parseRes[0].polyuser_mail === inputs.mail) {
                const body = {name:inputs.pseudo, mail:inputs.mail, description:inputs.description}
                const res2 = await fetch(`/polyuser/id/${parseRes[0].polyuser_id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : "application/json",token: localStorage.token},
                    body:JSON.stringify(body)
                })
                const parseRes2 = await res2.json()
                setUser(parseRes2)
                setModify(false)
            }
            else {
                setInputs({mail:"", pseudo:inputs.pseudo, description:inputs.description})
                setHolder("Mail déjà utilisé")
            }
        }
    }

    return (
        <div className="uze">
            <div className="connection">
                <h1>Mon compte</h1>
                <button onClick={() => logout()}>Se déconnecter</button>
            </div>
            <div className="perso">
                {modify ? <img title="annuler" onClick={() => {setModify(false);setInputs({mail:user.polyuser_mail,pseudo:user.polyuser_name,description:user.polyuser_description})}} src={Cross} alt="cross" width="50" height="50"/> : <img title="modifier" onClick={() => setModify(true)} src={Pen} alt="pen" width="50" height="50" />}
                {modify ? <img title="valider" onClick={() => update()} className="img2" src={Tick} alt="tick" width="40" height="40"/> : null}
                {modify ? <input placeholder={holder2} maxLength="20" className="user1" value={inputs.pseudo} onChange={(e) => setInputs({mail:inputs.mail, pseudo:e.target.value.replace(/[^a-zA-Z0-9]/g,'').replace(/\s+/g, ''), description:inputs.description})}/> : <h1>{user.polyuser_name} {"#"+("000"+user.polyuser_id).slice(-4)}</h1>}
                {modify ? <input placeholder={holder} maxLength="100" type="email" className="user2" value={inputs.mail} onChange={(e) => setInputs({mail:e.target.value, pseudo:inputs.pseudo, description:inputs.description})}/> : <h2>{user.polyuser_mail}</h2>}
                <h3>Rôle : {user.polyuser_role}</h3>
                {modify ? <input className="user3" maxLength="150" value={inputs.description} onChange={(e) => setInputs({mail:inputs.mail, pseudo:inputs.pseudo, description:e.target.value})}/> : <p>{user.polyuser_description}</p>}
            </div>
        </div>
    )
}

export default User