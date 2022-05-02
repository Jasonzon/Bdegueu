import "../styles/Rezo.css"
import {useState, useEffect} from "react"
import Tick from "../assets/tick.png"
import Trash from "../assets/trash.png"

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
    },[])

    const [inputs, setInputs] = useState({
        name:"",
        data:"",
        description:"",
        city:"",
        adh:"",
        nonadh:""
    })

    const [imajo, setImajo] = useState({vide:true})

    const [add, setAdd] = useState(false)

    async function submit() {
        if (inputs.name !== "" && inputs.city !== "" && inputs.date !== "" && !imajo.vide && inputs.description !== "" && inputs.adh !== "" && inputs.nonadh !== "") {
            const formData = new FormData()
            formData.append("file",imajo)
            formData.append("upload_preset","sfogjxhj")
            const res = await fetch("https://api.cloudinary.com/v1_1/bdegueu/image/upload", {
                method: "POST",
                body:formData
            })
            const parseRes = await res.json()
            const body = {name:inputs.name,date:inputs.date,pic:parseRes.secure_url,description:inputs.description,adh:inputs.adh,nonadh:inputs.nonadh,city:inputs.city}
            const res2 = await fetch("http://localhost:5000/rezo", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body:JSON.stringify(body)
            })
            const parseRes2 = await res2.json()
            rezos.push(parseRes2)
            setImajo({vide:true})
            setInputs({
                name:"",
                data:"",
                description:"",
                city:"",
                adh:"",
                nonadh:""
            })
            setAdd(false)
        }
    }

    const [indexPage, setIndexPage] = useState(1)

    return (
        <div>
            <div className="connection">
                <h1 className="title">Rezo</h1>
                {!(user && user.polyuser_name) ? null : <> {add ? <button onClick={() => setAdd(false)}>Annuler</button> : <button onClick={() => setAdd(true)}>Ajouter</button>} </> }
            </div>
            {!add ? null : <div className="ad">
                <div className="ad1">
                    <input placeholder="Nom" value={inputs.name} onChange={(e) => setInputs({name:e.target.value,date:inputs.date,adh:inputs.adh,nonadh:inputs.nonadh,description:inputs.description,city:inputs.city})} />
                    <input placeholder="Date" value={inputs.date} onChange={(e) => setInputs({name:inputs.name,date:e.target.value,adh:inputs.adh,nonadh:inputs.nonadh,description:inputs.description,city:inputs.city})} />
                    <input placeholder="Ville" value={inputs.city} onChange={(e) => setInputs({name:inputs.name,date:inputs.date,adh:inputs.adh,nonadh:inputs.nonadh,description:inputs.description,city:e.target.value})} />
                    <input className="file" type="file" accept="image/png" onChange={(e) => setImajo(e.target.files[0])} />
                </div>
                <div className="ad1">
                    <input placeholder="Prix adhérent" value={inputs.adh} onChange={(e) => setInputs({name:inputs.name,date:inputs.date,adh:e.target.value,nonadh:inputs.nonadh,description:inputs.description,city:inputs.city})} />
                    <input placeholder="Prix non-adhérent" value={inputs.nonadh} onChange={(e) => setInputs({name:inputs.name,date:inputs.date,adh:inputs.adh,nonadh:e.target.value,description:inputs.description,city:inputs.city})} />
                    <input placeholder="Description" value={inputs.description} onChange={(e) => setInputs({name:inputs.name,date:inputs.date,adh:inputs.adh,nonadh:inputs.nonadh,description:e.target.value,city:inputs.city})} /><br/>
                </div>
                <img onClick={() => submit()} title="valider" src={Tick} alt="tick" width="50" height="50" />
            </div>}
            <ul className="coco">
                {rezos.slice("").reverse().map(({rezo_pic, rezo_name, rezo_city, rezo_date, rezo_adh, rezo_nonadh, rezo_description, created_at}) => 
                    <div className="rezo">
                        {!(user && user.polyuser_name) ? null : <img className="trash" alt="trash" src={Trash} width="30" height="40"/>}
                        <h1 className="title">{rezo_name}</h1>
                        <h2 className="flex-rezo">{rezo_city}</h2>
                        <h2>{rezo_date}</h2>
                        <h3>Adhérent : {rezo_adh}€ / Non-adhérent : {rezo_nonadh}€</h3>
                        <img className="artpic" src={rezo_pic} alt="rezo_pic" />
                        <p>{rezo_description}</p>
                        <span className="tim">{created_at.substr(0,10)}</span>
                    </div>
                )}
            </ul>
            <div className="numbers">
                <div className="navigation">
                    <button onClick={() => setIndexPage(1)}>1</button>
                    {rezos.length > indexPage*10 ? <button onClick={() => setIndexPage(indexPage+1)}>{">"}</button> : <button disabled>{">"}</button> }
                    <span>{indexPage.toString()}</span>
                    {indexPage === 1 ? <button disabled>{"<"}</button> : <button onClick={() => setIndexPage(indexPage-1)}>{"<"}</button> }
                    <button onClick={() => setIndexPage(((rezos.length-rezos.length%10)/10)+1)}>{rezos.length < 11 ? 1 : ((rezos.length-rezos.length%10)/10)+1}</button>
                </div>
            </div>
        </div>
    )
}

export default Rezo