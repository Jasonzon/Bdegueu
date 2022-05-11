import "../styles/Articles.css"
import {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import Tick from "../assets/tick.png"

function Articles({user, setUser}) {

    const [articles, setArticles] = useState([])

    async function getArticles() {
        const res = await fetch("http://localhost:5000/article", {
            method: "GET"
        })
        const parseRes = await res.json()
        setArticles(parseRes)
    }

    useEffect(() => {
        getArticles()
    },[])

    const [inputs, setInputs] = useState({
        name:"",
        type:"",
        description:""
    })

    const [imajo, setImajo] = useState({vide:true})

    const [add, setAdd] = useState(false)

    async function submit() {
        if (inputs.name !== "" && inputs.type !== "" && !imajo.vide && inputs.description !== "") {
            const formData = new FormData()
            formData.append("file",imajo)
            formData.append("upload_preset","sfogjxhj")
            const res = await fetch("https://api.cloudinary.com/v1_1/bdegueu/image/upload", {
                method: "POST",
                body:formData
            })
            const parseRes = await res.json()
            const body = {name:inputs.name,type:inputs.type,pic:parseRes.secure_url,description:inputs.description}
            const res2 = await fetch("http://localhost:5000/article", {
                method: "POST",
                headers: {"Content-Type" : "application/json",token: localStorage.token},
                body:JSON.stringify(body)
            })
            const parseRes2 = await res2.json()
            setArticles([...articles,parseRes2])
            setImajo({vide:true})
            setInputs({name:"", type:"", description:""})
            setAdd(false)
        }
    }

    const [indexPage, setIndexPage] = useState(1)

    return (
        <div>
            <div className="connection">
                <h1 className="title">Articles</h1>
                {!(user && user.polyuser_name) ? null : <> {add ? <button onClick={() => setAdd(false)}>Annuler</button> : <button onClick={() => setAdd(true)}>Ajouter</button>} </> }
            </div>
            {!add ? null : <div className="ade">
                <input maxLength="50" placeholder="Nom" value={inputs.name} onChange={(e) => setInputs({name:e.target.value,type:inputs.type,description:inputs.description})} />
                <input maxLength="50" placeholder="Type" value={inputs.type} onChange={(e) => setInputs({name:inputs.name, type:e.target.value,description:inputs.description})} />
                <input type="file" accept="image/png" onChange={(e) => setImajo(e.target.files[0])} />
                <textarea maxLength="5000" placeholder="Description" value={inputs.description} onChange={(e) => setInputs({name:inputs.name, type:inputs.type,description:e.target.value})} />
                <img onClick={() => submit()} title="valider" src={Tick} alt="tick" width="50" height="50" />
            </div>}
            <ul className="coco">
            {articles.slice("").filter((article,index) => index !== 0).reverse().map(({article_name, article_type, article_id, created_at},index) => <>
                {(index < indexPage*10 && index >= (indexPage-1)*10) ?
                <Link to={`/articles/${article_id}`}>
                <li className="articles" key={article_id}>
                        <h1>{article_name}</h1><br/>
                        <h2>{article_type}</h2>
                        <span>{created_at.substr(0, 10)}</span>
                </li>
                </Link> : null } </>
            )} 
            </ul>
            <div className="numbers">
                <div className="navigation">
                    <button onClick={() => setIndexPage(1)}>1</button>
                    {articles.length-1 > indexPage*10 ? <button onClick={() => setIndexPage(indexPage+1)}>{">"}</button> : <button disabled>{">"}</button> }
                    <span>{indexPage.toString()}</span>
                    {indexPage === 1 ? <button disabled>{"<"}</button> : <button onClick={() => setIndexPage(indexPage-1)}>{"<"}</button> }
                    <button onClick={() => setIndexPage(((articles.length-1-(articles.length-1)%10)/10)+1)}>{articles.length-1 < 11 ? 1 : ((articles.length-1-(articles.length-1)%10)/10)+1}</button>
                </div>
            </div>
        </div>
    )
}

export default Articles