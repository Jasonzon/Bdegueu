import "../styles/Goodies.css"
import {useState, useEffect} from "react"
import Tick from "../assets/tick.png"
import Trash from "../assets/trash.png"
import Pen from "../assets/pen.png"

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

    const [del, setDel] = useState(goodies.map((goodie) => false))

    async function delet(id) {
        const res = await fetch(`http://localhost:5000/goodies/id/${id}`, {
            method: "DELETE"
        })
        const parseRes = await res.json()
        setGoodies(goodies.slice("").filter(({goodies_id}) => goodies_id !== parseRes.goodies_id))
        setDel(goodies.map((goodie) => false))
    }

    return (
        <div>
            <div className="connection">
                <h1>Goodies</h1>
                {!(user && user.polyuser_name) ? null : <> {add ? <button onClick={() => setAdd(false)}>Annuler</button> : <button onClick={() => setAdd(true)}>Ajouter</button>} </> }
            </div>
            <h2 className="goodi">Les goodies seront disponibles à l'achat prochainement</h2>
            {!add ? null : <div className="ade">
                <input placeholder="Nom" value={inputs.name} onChange={(e) => setInputs({name:e.target.value, price:inputs.price})} />
                <input placeholder="Prix" value={inputs.price} onChange={(e) => setInputs({name:inputs.name, price:e.target.value})} />
                <input type="file" accept="image/png" onChange={(e) => setImajo(e.target.files[0])} />
                <img onClick={() => submit()} title="valider" src={Tick} alt="tick" width="50" height="50" />
            </div>}
            <ul className="good">
                {goodies.map(({goodies_name, goodies_pic, goodies_price, goodies_id},index) =>
                    <div className="goodies">
                        {!(user && user.polyuser_name) ? null : <> {del[index] ? <img onClick={() => delet(goodies_id)} className="trash-del" alt="trash" src={Trash} width="25" height="30"/> : <img onClick={() => setDel(goodies.map((tra,ind) => ind === index ? true : false))} className="trash" alt="trash" src={Trash} width="25" height="30"/>} </> }
                        {!(user && user.polyuser_name) ? null : <img className="pen" alt="pen" src={Pen} width="35" height="35"/>}
                        <h1>{goodies_name}</h1>
                        <img className="gooo" src={goodies_pic} alt="goodies_pic" />
                        {goodies_price ? <h2>{goodies_price}€</h2> : null}
                    </div>
                )}
            </ul>
        </div>
    )
}

export default Goodies