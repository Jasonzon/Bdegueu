import "../styles/Goodies.css"
import {useState, useEffect} from "react"
import Tick from "../assets/tick.png"
import Trash from "../assets/trash.png"
import Pen from "../assets/pen.png"
import Cross from "../assets/cross.png"
import Loader from "../assets/gif.gif"

function Goodies({user, setUser}) {

    const [goodies, setGoodies] = useState([])

    const [inputs, setInputs] = useState({name:"", price:""})

    const [imajo, setImajo] = useState({vide:true})

    const [add, setAdd] = useState(false)

    async function getGoodies() {
        const res = await fetch("/goodies", {
            method: "GET"
        })
        const parseRes = await res.json()
        setGoodies(parseRes)
        setSet(true)
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
            const res2 = await fetch("/goodies", {
                method: "POST",
                headers: {"Content-Type" : "application/json",token: localStorage.token},
                body:JSON.stringify(body)
            })
            const parseRes2 = await res2.json()
            setGoodies([...goodies, parseRes2])
            setImajo({vide:true})
            setInputs({name:"", price:""})
            setAdd(false)
        }
    }

    const [del, setDel] = useState(goodies.map((goodie) => false))

    async function delet(id) {
        const res = await fetch(`/goodies/id/${id}`, {
            method: "DELETE",
            headers: {token: localStorage.token}
        })
        const parseRes = await res.json()
        setGoodies(goodies.slice("").filter(({goodies_id}) => goodies_id !== parseRes.goodies_id))
        setDel(goodies.map((goodie) => false))
    }

    const [modif, setModif] = useState(goodies.map((goodie) => false))

    const [inputs2, setInputs2] = useState({name:"", price:"", pic:"", id:0})

    const [imajo2, setImajo2] = useState({vide:true})

    async function submit2() {
        if (inputs2.name !== "" && inputs2.price !== "" && inputs2.id !== 0) {
            if (!imajo2.vide) {
                const formData = new FormData()
                formData.append("file",imajo2)
                formData.append("upload_preset","sfogjxhj")
                const res = await fetch("https://api.cloudinary.com/v1_1/bdegueu/image/upload", {
                    method: "POST",
                    body:formData
                })
                const parseRes = await res.json()
                const body = {name:inputs2.name,price:inputs2.price,pic:parseRes.secure_url}
                const res2 = await fetch(`/goodies/id/${inputs2.id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : "application/json",token: localStorage.token},
                    body:JSON.stringify(body)
                })
                const parseRes2 = await res2.json()
                setGoodies([...goodies.slice("").filter(({goodies_id}) => goodies_id !== inputs2.id),parseRes2])
                setImajo2({vide:true})
                setInputs2({name:"", price:"", pic:"", id:0})
                setModif(goodies.map((goodie) => false))
            }
            else {
                const body = {name:inputs2.name,price:inputs2.price,pic:inputs2.pic}
                const res2 = await fetch(`/goodies/id/${inputs2.id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : "application/json",token: localStorage.token},
                    body:JSON.stringify(body)
                })
                const parseRes2 = await res2.json()
                setGoodies([...goodies.slice("").filter(({goodies_id}) => goodies_id !== inputs2.id),parseRes2])
                setInputs2({name:"", price:"", pic:"", id:0})
                setModif(goodies.map((goodie) => false))
            }
        }
    }

    const [set, setSet] = useState(false)

    return (
        <div className="goodhies">
            <div className="connection">
                <h1>Goodies</h1>
                {!(user && user.polyuser_name) ? null : <> {add ? <button onClick={() => setAdd(false)}>Annuler</button> : <button onClick={() => {setAdd(true);setModif(goodies.map((goodie) => false));setInputs2({name:"", price:"", pic:""});setImajo2({vide:true})}}>Ajouter</button>} </> }
            </div>
            <h2 className="goodi">Les goodies seront disponibles à l'achat prochainement</h2>
            {!add ? null : <div className="ade">
                <input maxLength="30" placeholder="Nom" value={inputs.name} onChange={(e) => setInputs({name:e.target.value, price:inputs.price})} />
                <input maxLength="10" placeholder="Prix" value={inputs.price} onChange={(e) => setInputs({name:inputs.name, price:e.target.value})} />
                <input type="file" accept="image/png" onChange={(e) => setImajo(e.target.files[0])} />
                <img onClick={() => submit()} title="valider" src={Tick} alt="tick" width="50" height="50" />
            </div>}
            {modif.slice("").filter((goodie) => goodie === true).length === 0 ? null : <div className="ade">
                <input maxLength="30" placeholder="Nom" value={inputs2.name} onChange={(e) => setInputs2({name:e.target.value, price:inputs2.price,id:inputs2.id,pic:inputs2.pic})} />
                <input maxLength="10" placeholder="Prix" value={inputs2.price} onChange={(e) => setInputs2({name:inputs2.name, price:e.target.value,id:inputs2.id,pic:inputs2.pic})} />
                <input type="file" accept="image/png" onChange={(e) => setImajo2(e.target.files[0])} />
                <img onClick={() => submit2()} title="valider" src={Tick} alt="tick" width="50" height="50" />
            </div>}
            <ul className={`good ${goodies.length !== 0 ? null : "none"}`}>
                {goodies.map(({goodies_name, goodies_pic, goodies_price, goodies_id},index) =>
                    <div className="goodies">
                        {!(user && user.polyuser_name) ? null : <> {del[index] ? <img onClick={() => delet(goodies_id)} className="trash-del" alt="trash" src={Trash} width="25" height="30"/> : <img onClick={() => setDel(goodies.map((tra,ind) => ind === index ? true : false))} className="trash" alt="trash" src={Trash} width="25" height="30"/>} </> }
                        {!(user && user.polyuser_name) ? null : <> {modif[index] ? <img onClick={() => {setModif(goodies.map((goodie) => false));setInputs2({name:"", price:"", pic:"", id:0});setImajo2({vide:true})}} className="cross" src={Cross} alt="cross" width="35" height="35"/> : <img onClick={() => {setModif(goodies.map((goodie,ind) => index === ind ? true : false));setAdd(false);setInputs2({name:goodies_name, price:goodies_price, pic:goodies_pic, id:goodies_id})}} className="pen" alt="pen" src={Pen} width="35" height="35"/>} </> }
                        <h1>{goodies_name}</h1>
                        <a target="_blank" href={goodies_pic}>
                        <img className="gooo" src={goodies_pic} alt="goodies_pic" />
                        </a>
                        {goodies_price ? <h2>{goodies_price}€</h2> : null}
                    </div>
                )}
            </ul>
            {set ? null : <img alt="loader" className="loader" src={Loader} />}
            {set && goodies.length === 0 ? <h1 className="center">Aucun goodies</h1> : null}
        </div>
    )
}

export default Goodies