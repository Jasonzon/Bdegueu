import "../styles/Register.css"
import {useState} from "react"
function Register({connection, setConnection, user, setUser}) {

    const [inputs, setInputs] = useState({
        mail:"",
        pseudo:"",
        password:""
    })

    const [holder, setHolder] = useState("")

    async function submit(e) {
        e.preventDefault()
        const res = await fetch(`/polyuser/mail/${inputs.mail}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        if (parseRes.length === 0) {
            const body = {mail:inputs.mail, name:inputs.pseudo, password:inputs.password}
            const res2 = await fetch("/polyuser", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body:JSON.stringify(body)
            })
            const parseRes2 = await res2.json()
            localStorage.setItem("token",parseRes2.token)
            setUser(parseRes2.rows[0])
        }
        else {
            e.target.form[0].value=""
            setHolder("Mail déjà utilisé")
        }
    }

    return (
        <div className="regg">
            <div className="connection">
                <h1>Enregistrement</h1>
                <button onClick={() => setConnection(true)}>Déjà inscrit ?</button>
            </div>
            <form>
                <label>Mail</label><br/>
                <input placeholder={holder} maxLength="100" required onChange={(e) => {setInputs({mail:e.target.value, pseudo:inputs.pseudo, password:inputs.password});setHolder("")}} value={inputs.mail} type="email" id="email" name="email"/><br/>
                <label>Pseudo</label><br/>
                <input required maxLength="20" onChange={(e) => setInputs({mail:inputs.mail, pseudo:e.target.value.replace(/[^a-zA-Z0-9 ]/g,''), password:inputs.password})} value={inputs.pseudo} type="text" id="epseudo" name="epseudo"/><br/>
                <label>Mot de passe</label><br/>
                <input required maxLength="50" onChange={(e) => setInputs({mail:inputs.mail, pseudo:inputs.pseudo, password:e.target.value})} value={inputs.password} type="password" id="epassword" name="epassword"/><br/>
                <button type="submit" onClick={(e) => submit(e)}>S'enregistrer</button>
            </form>
        </div>
    )
}

export default Register