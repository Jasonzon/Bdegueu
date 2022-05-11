import "../styles/Rezo.css"
import {useState, useEffect} from "react"
import Tick from "../assets/tick.png"
import Trash from "../assets/trash.png"
import Pen from "../assets/pen.png"
import Cross from "../assets/cross.png"
import Loader from "../assets/gif.gif"

function Rezo({user, setUser}) {

    const [rezos, setRezos] = useState([])

    async function getRezos() {
        const res = await fetch("/rezo", {
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
        date:"",
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
            const res2 = await fetch("/rezo", {
                method: "POST",
                headers: {"Content-Type" : "application/json",token: localStorage.token},
                body:JSON.stringify(body)
            })
            const parseRes2 = await res2.json()
            setRezos([...rezos,parseRes2])
            setImajo({vide:true})
            setInputs({
                name:"",
                date:"",
                description:"",
                city:"",
                adh:"",
                nonadh:""
            })
            setAdd(false)
        }
    }

    const [indexPage, setIndexPage] = useState(1)

    const [del, setDel] = useState(rezos.map((rez) => false))

    async function delet(id) {
        const res = await fetch(`/rezo/id/${id}`, {
            method: "DELETE",
            headers: {token: localStorage.token}
        })
        const parseRes = await res.json()
        setRezos(rezos.slice("").filter(({rezo_id}) => rezo_id !== parseRes.rezo_id))
        setDel(rezos.map((rez) => false))
    }

    const [modif, setModif] = useState(rezos.map((rez) => false))

    const [inputs2, setInputs2] = useState({name:"", date:"", pic:"", id:0, adh:"", nonadh:"", description:"", city:""})

    const [imajo2, setImajo2] = useState({vide:true})

    async function submit2() {
        if (inputs2.name !== "" && inputs2.adh !== "" && inputs2.nonadh != "" && inputs2.id !== 0 && inputs2.description !== "" && inputs2.city !== "" && inputs2.date !== "") {
            if (!imajo2.vide) {
                const formData = new FormData()
                formData.append("file",imajo2)
                formData.append("upload_preset","sfogjxhj")
                const res = await fetch("https://api.cloudinary.com/v1_1/bdegueu/image/upload", {
                    method: "POST",
                    body:formData
                })
                const parseRes = await res.json()
                const body = {name:inputs2.name,adh:inputs2.adh,nonadh:inputs2.nonadh,description:inputs2.description,date:inputs2.date,city:inputs2.city,pic:parseRes.secure_url}
                const res2 = await fetch(`/rezo/id/${inputs2.id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : "application/json",token: localStorage.token},
                    body:JSON.stringify(body)
                })
                const parseRes2 = await res2.json()
                setRezos([...rezos.slice("").filter(({rezo_id}) => rezo_id !== inputs2.id),parseRes2])
                setImajo2({vide:true})
                setInputs2({name:"", date:"", pic:"", id:0, adh:"", nonadh:"", description:"", city:""})
                setModif(rezos.map((rez) => false))
            }
            else {
                const body = {name:inputs2.name,adh:inputs2.adh,nonadh:inputs2.nonadh,description:inputs2.description,date:inputs2.date,city:inputs2.city,pic:inputs2.pic}
                const res2 = await fetch(`/rezo/id/${inputs2.id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : "application/json",token: localStorage.token},
                    body:JSON.stringify(body)
                })
                const parseRes2 = await res2.json()
                setRezos([...rezos.slice("").filter(({rezo_id}) => rezo_id !== inputs2.id),parseRes2])
                setInputs2({name:"", date:"", pic:"", id:0, adh:"", nonadh:"", description:"", city:""})
                setModif(rezos.map((rez) => false))
            }
        }
    }

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (rezos.length !== 0) {
            setLoaded(true)
        }
    },[rezos])

    return (
        <div>
            <div className="connection">
                <h1 className="title">Rezo</h1>
                {!(user && user.polyuser_name) ? null : <> {add ? <button onClick={() => setAdd(false)}>Annuler</button> : <button onClick={() => setAdd(true)}>Ajouter</button>} </> }
            </div>
            <h2 className="goodi2">Retrouve ici les évènements rezo du moment</h2>
            {!add ? null : <div className="ad">
                <div className="ad1">
                    <input maxLength="50" placeholder="Nom" value={inputs.name} onChange={(e) => setInputs({name:e.target.value,date:inputs.date,adh:inputs.adh,nonadh:inputs.nonadh,description:inputs.description,city:inputs.city})} />
                    <input maxLength="50" placeholder="Date" value={inputs.date} onChange={(e) => setInputs({name:inputs.name,date:e.target.value,adh:inputs.adh,nonadh:inputs.nonadh,description:inputs.description,city:inputs.city})} />
                    <input maxLength="50" placeholder="Ville" value={inputs.city} onChange={(e) => setInputs({name:inputs.name,date:inputs.date,adh:inputs.adh,nonadh:inputs.nonadh,description:inputs.description,city:e.target.value})} />
                </div>
                <input className="file" type="file" accept="image/png" onChange={(e) => setImajo(e.target.files[0])} />
                <div className="ad1">
                    <input maxLength="10" placeholder="Prix adhérent" value={inputs.adh} onChange={(e) => setInputs({name:inputs.name,date:inputs.date,adh:e.target.value,nonadh:inputs.nonadh,description:inputs.description,city:inputs.city})} />
                    <input maxLength="10" placeholder="Prix non-adhérent" value={inputs.nonadh} onChange={(e) => setInputs({name:inputs.name,date:inputs.date,adh:inputs.adh,nonadh:e.target.value,description:inputs.description,city:inputs.city})} />
                    <textarea maxLength="5000" placeholder="Description" value={inputs.description} onChange={(e) => setInputs({name:inputs.name,date:inputs.date,adh:inputs.adh,nonadh:inputs.nonadh,description:e.target.value,city:inputs.city})} /><br/>
                </div>
                <img onClick={() => submit()} title="valider" src={Tick} alt="tick" width="50" height="50" />
            </div>}
            {modif.slice("").filter((rez) => rez === true).length === 0 ? null : <div className="ad">
                <div className="ad1">
                    <input maxLength="50" placeholder="Nom" value={inputs2.name} onChange={(e) => setInputs2({name:e.target.value,date:inputs2.date,adh:inputs2.adh,nonadh:inputs2.nonadh,description:inputs2.description,city:inputs2.city,id:inputs2.id,pic:inputs2.pic})} />
                    <input maxLength="50" placeholder="Date" value={inputs2.date} onChange={(e) => setInputs2({name:inputs2.name,date:e.target.value,adh:inputs2.adh,nonadh:inputs2.nonadh,description:inputs2.description,city:inputs2.city,id:inputs2.id,pic:inputs2.pic})} />
                    <input maxLength="50" placeholder="Ville" value={inputs2.city} onChange={(e) => setInputs2({name:inputs2.name,date:inputs2.date,adh:inputs2.adh,nonadh:inputs2.nonadh,description:inputs2.description,city:e.target.value,id:inputs2.id,pic:inputs2.pic})} />
                </div>
                <input className="file" type="file" accept="image/png" onChange={(e) => setImajo2(e.target.files[0])} />
                <div className="ad1">
                    <input maxLength="10" placeholder="Prix adhérent" value={inputs2.adh} onChange={(e) => setInputs2({name:inputs.name,date:inputs2.date,adh:e.target.value,nonadh:inputs2.nonadh,description:inputs2.description,city:inputs2.city,id:inputs2.id,pic:inputs2.pic})} />
                    <input maxLength="10" placeholder="Prix non-adhérent" value={inputs2.nonadh} onChange={(e) => setInputs2({name:inputs2.name,date:inputs2.date,adh:inputs2.adh,nonadh:e.target.value,description:inputs2.description,city:inputs2.city,id:inputs2.id,pic:inputs2.pic})} />
                    <textarea maxLength="5000" placeholder="Description" value={inputs2.description} onChange={(e) => setInputs2({name:inputs2.name,date:inputs2.date,adh:inputs2.adh,nonadh:inputs2.nonadh,description:e.target.value,city:inputs2.city,id:inputs2.id,pic:inputs2.pic})} /><br/>
                </div>
                <img onClick={() => submit2()} title="valider" src={Tick} alt="tick" width="50" height="50" />
            </div>}
            <ul className={`coco ${loaded ? null : "none"}`}>
                {rezos.slice("").reverse().map(({rezo_pic, rezo_name, rezo_city, rezo_date, rezo_adh, rezo_nonadh, rezo_description, created_at, rezo_id},index) => 
                    <div className="rezo">
                        {!(user && user.polyuser_name) ? null : <> {del[index] ? <img onClick={() => delet(rezo_id)} className="trash-del" alt="trash" src={Trash} width="25" height="30"/> : <img onClick={() => setDel(rezos.map((tra,ind) => ind === index ? true : false))} className="trash" alt="trash" src={Trash} width="25" height="30"/>} </> }
                        {!(user && user.polyuser_name) ? null : <> {modif[index] ? <img onClick={() => {setModif(rezos.map((rez) => false));setInputs2({name:"", date:"", pic:"", id:0, adh:"", nonadh:"", description:"", city:""});setImajo2({vide:true})}} className="cross" src={Cross} alt="cross" width="35" height="35"/> : <img onClick={() => {setModif(rezos.map((goodie,ind) => index === ind ? true : false));setAdd(false);setInputs2({name:rezo_name, adh:rezo_adh, nonadh:rezo_nonadh, pic:rezo_pic, id:rezo_id, description:rezo_description, date:rezo_date, city:rezo_city})}} className="pen" alt="pen" src={Pen} width="35" height="35"/>} </> }
                        <h1 className="title">{rezo_name}</h1>
                        <h2 className="flex-rezo">{rezo_city}</h2>
                        <h2>{rezo_date}</h2>
                        <h3>Adhérent : {rezo_adh}€ / Non-adhérent : {rezo_nonadh}€</h3>
                        <div className="flex-article">
                            <a target="_blank" href={rezo_pic}>
                                <img className="artpic" src={rezo_pic} alt="rezo_pic" />
                            </a>
                            <p>{rezo_description}</p>
                        </div>
                        <span className="tim">{created_at.substr(0,10)}</span>
                    </div>
                )}
            </ul>
            {loaded ? null : <img src={Loader} alt="loader" className="loader" />}
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