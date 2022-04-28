import "../styles/Register.css"
import {useState} from "react"
const bcrypt = require('bcryptjs')

function Register({connection, setConnection, user, setUser}) {

    const [inputs, setInputs] = useState({
        mail:"",
        pseudo:"",
        password:""
    })

    const [holder, setHolder] = useState("")

    async function submit(e) {
        e.preventDefault()
        const res = await fetch(`http://localhost:5000/polyuser/mail/${inputs.mail}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        if (parseRes.rows.length === 0) {
            const saltRound = 10
            const salt = await bcrypt.genSaltSync(saltRound)
            const bcryptPassword = await bcrypt.hashSync(inputs.password, salt)
            const body = {mail:inputs.mail, name:inputs.pseudo, password:bcryptPassword}
            const res2 = await fetch("http://localhost:5000/polyuser", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body:JSON.stringify(body)
            })
            const parseRes2 = await res2.json()
            localStorage.setItem("token",parseRes2.token)
            setUser(parseRes2.user)
        }
        else {
            e.target.form[0].value=""
            setHolder("Mail déjà utilisé")
        }
    }

    return (
        <div>
            <div className="connection">
                <h1>Enregistrement</h1>
                <button onClick={() => setConnection(true)}>Déjà inscrit ?</button>
            </div>
            <form>
                <label>Mail</label><br/>
                <input placeholder={holder} required onChange={(e) => {setInputs({mail:e.target.value, pseudo:inputs.pseudo, password:inputs.password});setHolder("")}} value={inputs.mail} type="email" id="email" name="email"/><br/>
                <label>Pseudo</label><br/>
                <input required onChange={(e) => setInputs({mail:inputs.mail, pseudo:e.target.value, password:inputs.password})} value={inputs.pseudo} type="text" id="epseudo" name="epseudo"/><br/>
                <label>Mot de passe</label><br/>
                <input required onChange={(e) => setInputs({mail:inputs.mail, pseudo:inputs.pseudo, password:e.target.value})} value={inputs.password} type="password" id="epassword" name="epassword"/><br/>
                <button type="submit" onClick={(e) => submit(e)}>S'enregistrer</button>
            </form>
        </div>
    )
}

export default Register