import "../styles/Rezo.css"
import {useState, useEffect} from "react"

function Rezo({user, setUser}) {

    const [rezos, setRezos] = useState([])

    async function getRezos() {
        const res = await fetch("http://localhost:5000/rezo", {
            method: "GET"
        })
        const parseRes = await res.json()
        setRezos(parseRes)
    }

    useEffect(() => {
        getRezos()
    })

    return (
        <div>
            <div className="connection">
                <h1 className="title">Rezo</h1>
                {user && user.polyuser_role === "admin" ? <button>Ajouter</button> : null}
            </div>
            <ul className="coco">
                {rezos.slice("").reverse().map(({rezo_pic, rezo_name, rezo_city, rezo_date, rezo_adh, rezo_nonadh, rezo_description, created_at}) => 
                    <div className="rezo">
                        <h1 className="title">{rezo_name}</h1>
                        <h2 className="flex-rezo">{rezo_city}</h2>
                        <h2>{rezo_date}</h2>
                        <h3>Adhérent : {rezo_adh}€ / Non-adhérent : {rezo_nonadh}€</h3>
                        <img src={rezo_pic} alt="rezo_pic" />
                        <p>{rezo_description}</p>
                        <span className="tim">{created_at.substr(0,10)}</span>
                    </div>
                )}
            </ul>
        </div>
    )
}

export default Rezo