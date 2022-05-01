import "../styles/Goodies.css"
import {useState, useEffect} from "react"
import Tick from "../assets/tick.png"

function Goodies({user, setUser}) {

    const [goodies, setGoodies] = useState([])

    const [inputs, setInputs] = useState({name:"", price:""})

    const [imajo, setImajo] = useState({vide:true})

    const [add, setAdd] = useState(false)

    async function getGoodies() {
        const res = await fetch("http://localhost:5000/goodies", {
            method: "GET"
        })
        const parseRes = await res.json()
        setGoodies(parseRes)
    }

    useEffect(() => {
        getGoodies()
    },[])

    async function submit() {
        if (inputs.name !== "" && inputs.price !== "" && !imajo.vide) {
            const formData = new FormData()
            formData.append("file",imajo)
            formData.append("upload_preset","sfogjxhj")
            const res = await fetch("https://api.cloudinary.com/v1_1/bdegueu/image/upload", {
                method: "POST",
                body:formData
            })
            const parseRes = await res.json()
            const body = {name:inputs.name,price:inputs.price,pic:parseRes.secure_url}
            const res2 = await fetch("http://localhost:5000/goodies", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body:JSON.stringify(body)
            })
            const parseRes2 = await res2.json()
            goodies.push(parseRes2)
            setImajo({vide:true})
            setInputs({name:"", price:""})
            setAdd(false)
        }
    }

    return (
        <div>
            <div className="connection">
                <h1>Goodies</h1>
                {!(user && user.polyuser_name) ? null : <> {add ? <button onClick={() => setAdd(false)}>Annuler</button> : <button onClick={() => setAdd(true)}>Ajouter</button>} </> }
            </div>
            {!add ? null : <div className="addd">
                <input placeholder="Nom" value={inputs.name} onChange={(e) => setInputs({name:e.target.value, price:inputs.price})} />
                <input placeholder="Prix" value={inputs.price} onChange={(e) => setInputs({name:inputs.name, price:e.target.value})} />
                <input className="file" type="file" accept="image/png" onChange={(e) => setImajo(e.target.files[0])} />
                <img onClick={() => submit()} title="valider" src={Tick} alt="tick" width="50" height="50" />
            </div>}
            <ul className="good">
                {goodies.map(({goodies_name, goodies_pic, goodies_price}) =>
                    <div className="goodies">
                        <h1>{goodies_name}</h1>
                        <img src={goodies_pic} alt="goodies_pic" />
                        {goodies_price ? <h2>{goodies_price}€</h2> : null}
                    </div>
                )}
            </ul>
        </div>
    )
}

export default Goodies