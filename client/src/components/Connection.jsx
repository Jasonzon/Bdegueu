import "../styles/Connection.css"
import {useState} from "react"
const bcrypt = require("bcryptjs")

function Connection({connection, setConnection, user, setUser}) {

    const [inputs, setInputs] = useState({
        mail:"",
        password:""
    })

    const [holder1, setHolder1] = useState("")
    const [holder2, setHolder2] = useState("")

    async function submit(e) {
        e.preventDefault()
        const res = await fetch(`http://localhost:5000/polyuser/mail/${inputs.mail}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        if (parseRes.rows.length !== 0) {
            const validPassword = await bcrypt.compare(inputs.password,parseRes.rows[0].polyuser_password)
            if (validPassword) {
                localStorage.setItem("token",parseRes.token)
                setUser(parseRes.rows[0])
            }
            else {
                e.target.form[1].value=""
                setHolder2("Mot de passe incorrect")
            }
        }
        else {
            e.target.form[0].value=""
            setHolder1("Mail non trouvé")
        }
    }

    return (
        <div>
            <div className="connection">
                <h1>Connexion</h1>
                <button onClick={() => setConnection(false)}>Pas enregistré ?</button>
            </div>
            <form>
                <label>Mail</label><br/>
                <input maxLength="100" placeholder={holder1} required onChange={(e) => {setInputs({mail:e.target.value, password:inputs.password}); setHolder1("")}} value={inputs.mail} type="email" id="mail" name="mail" /><br/>
                <label>Mot de passe</label><br/>
                <input placeholder={holder2} maxLength="50" required onChange={(e) => {setInputs({mail:inputs.mail, password:e.target.value}); setHolder2("")}} value={inputs.password} type="password" id="password" name="password" /><br/>
                <button type="submit" onClick={(e) => submit(e)}>Se connecter</button>
            </form>
        </div>
    )
}

export default Connection