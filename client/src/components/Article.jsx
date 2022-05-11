import "../styles/Article.css"
import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import Like from "../assets/like.png"
import Liked from "../assets/liked.png"
import Dislike from "../assets/dislike.png"
import Disliked from "../assets/disliked.png"
import Comments from "./Comments"
import Trash from "../assets/trash.png"
import Pen from "../assets/pen.png"
import {Link} from "react-router-dom"
import Tick from "../assets/tick.png"
import Cross from "../assets/cross.png"
import Loader from "../assets/gif.gif"

function Article({user, setUser}) {

    const {id} = useParams()
    const [article, setArticle] = useState({
        name:"",
        type:"",
        pic:"",
        description:"",
        time:"",
        likes:0,
        dislikes:0
    })

    const [loaded, setLoaded] = useState(false)

    const [liked, setLiked] = useState(0)
    const [nbLikes, setNbLikes] = useState(0)
    const [nbDislikes, setNbDislikes] = useState(0)

    async function getArticle() {
        const res = await fetch(`http://localhost:5000/article/id/${id}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        setArticle({
            name:parseRes.article_name,
            type:parseRes.article_type,
            pic:parseRes.article_pic,
            description:parseRes.article_description,
            time:parseRes.created_at,
            likes:parseRes.article_likes,
            dislikes:parseRes.article_dislikes
        })
        setInputs({
            name:parseRes.article_name,
            type:parseRes.article_type,
            pic:parseRes.article_pic,
            description:parseRes.article_description   
        })
    }

    async function getLikes() {
        const res = await fetch(`http://localhost:5000/likes_article/article/${id}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        parseRes.map(({likes_liked}) => likes_liked ? setNbLikes(nbLikes+1) : setNbDislikes(nbDislikes+1))
        const slice = parseRes.slice("").filter(({likes_polyuser}) => user && user.polyuser_id === likes_polyuser)
        if (slice.length !== 0) {
            if (slice[0].likes_liked) {
                setLiked(1)
            }
            else {
                setLiked(-1)
            }
        }
    }

    async function addLike(int) {
        setLiked(int)
        const res = await fetch(`http://localhost:5000/likes_article/article/${id}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        const slice = parseRes.slice("").filter(({likes_polyuser}) => user && user.polyuser_id === likes_polyuser)
        if (slice.length !== 0) {
            if (int === 1) {
                setNbLikes(nbLikes+1)
                setNbDislikes(nbDislikes-1)
            }
            else {
                setNbDislikes(nbDislikes+1)
                setNbLikes(nbLikes-1)
            }
            const body = {liked:int === -1 ? false : true,polyuser:user.polyuser_id,article:id}
            const res2 = await fetch(`http://localhost:5000/likes_article/id/${slice[0].likes_id}`, {
                method: "PUT",
                headers: {"Content-Type" : "application/json",token: localStorage.token},
                body:JSON.stringify(body)
            })
            const parseRes2 = await res2.json()
        }
        else {
            if (int === 1) {
                setNbLikes(nbLikes+1)
            }
            else {
                setNbDislikes(nbDislikes+1)
            }
            const body = {liked:int === -1 ? false : true,polyuser:user.polyuser_id,article:id}
            const res2 = await fetch("http://localhost:5000/likes_article", {
                method: "POST",
                headers: {"Content-Type" : "application/json",token: localStorage.token},
                body:JSON.stringify(body)
            })
            const parseRes2 = await res2.json()
            console.log(parseRes2)  
        }
    }

    async function deleteLike(int) {
        if (int === 1) {
            setNbLikes(nbLikes-1)
        }
        else {
            setNbDislikes(nbDislikes-1)
        }
        const res = await fetch(`http://localhost:5000/likes_article/article/${id}`, {
            method: "GET"
        })
        const parseRes = await res.json() 
        const slice = parseRes.slice("").filter(({likes_polyuser}) => user && user.polyuser_id === likes_polyuser)
        const body = {polyuser:user.polyuser_id}
        const res2 = await fetch(`http://localhost:5000/likes_article/id/${slice[0].likes_id}`, {
            method: "DELETE",
            headers: {token: localStorage.token},
            body:JSON.stringify(body)
        })
    }

    useEffect(() => {
        getArticle()
    },[])

    useEffect(() => {
        if (user && user.polyuser_name) {
            getLikes()
        }
    },[user])

    const [del, setDel] = useState(false)

    async function delet(id) {
        const res = await fetch(`http://localhost:5000/article/id/${id}`, {
            method: "DELETE",
            headers: {token: localStorage.token}
        })
    }

    const [modif, setModif] = useState(false)
    const [inputs, setInputs] = useState({
        name:"",
        type:"",
        description:""
    })

    const [imajo, setImajo] = useState({vide:true})

    async function submit() {
        if (inputs.name !== "" && inputs.type !== "" && inputs.description !== "") {
            if (!imajo.vide) {
                const formData = new FormData()
                formData.append("file",imajo)
                formData.append("upload_preset","sfogjxhj")
                const res = await fetch("https://api.cloudinary.com/v1_1/bdegueu/image/upload", {
                    method: "POST",
                    body:formData
                })
                const parseRes = await res.json()
                const body = {name:inputs.name,type:inputs.type,pic:parseRes.secure_url,description:inputs.description}
                const res2 = await fetch(`http://localhost:5000/article/id/${id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : "application/json",token: localStorage.token},
                    body:JSON.stringify(body)
                })
                const parseRes2 = await res2.json()
                setArticle({
                    name:parseRes2.article_name,
                    type:parseRes2.article_type,
                    pic:parseRes2.article_pic,
                    description:parseRes2.article_description,
                    time:article.time,
                    likes:article.article_likes,
                    dislikes:article.article_dislikes
                })
            }
            else {
                const body = {name:inputs.name,type:inputs.type,pic:article.pic,description:inputs.description}
                const res2 = await fetch(`http://localhost:5000/article/id/${id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : "application/json",token: localStorage.token},
                    body:JSON.stringify(body)
                })
                const parseRes2 = await res2.json()
                setArticle({
                    name:parseRes2.article_name,
                    type:parseRes2.article_type,
                    pic:parseRes2.article_pic,
                    description:parseRes2.article_description,
                    time:article.time,
                    likes:article.article_likes,
                    dislikes:article.article_dislikes
                })
            }
            setModif(false)
        }
    }

    useEffect(() => {
        if (article.name !== "") {
            setLoaded(true)
        }
    },[article])

    return (
        <div>
            {!modif ? null : <div className="ade padding">
                <input maxLength="50" placeholder="Nom" value={inputs.name} onChange={(e) => setInputs({name:e.target.value,type:inputs.type,description:inputs.description})} />
                <input maxLength="50" placeholder="Type" value={inputs.type} onChange={(e) => setInputs({name:inputs.name, type:e.target.value,description:inputs.description})} />
                <input type="file" accept="image/png" onChange={(e) => setImajo(e.target.files[0])} />
                <textarea maxLength="5000" placeholder="Description" value={inputs.description} onChange={(e) => setInputs({name:inputs.name, type:inputs.type,description:e.target.value})} />
                <img onClick={() => submit()} title="valider" src={Tick} alt="tick" width="50" height="50" />
            </div>}
            {loaded ?
            <div className="article">
                <h1 className="title">{article.name}</h1>
                {!(user && user.polyuser_name) ? null : <> {del ? <Link to="/"><img onClick={() => delet(id)} className="trash-del" alt="trash" src={Trash} width="25" height="30"/></Link> : <img onClick={() => setDel(true)} className="trash" alt="trash" src={Trash} width="25" height="30"/>} </> }
                {!(user && user.polyuser_name) ? null : <> {modif ? <img onClick={() => {setModif(false);setImajo({vide:true})}} className="cross" src={Cross} alt="cross" width="35" height="35"/> : <img onClick={() => setModif(true)} className="pen" alt="pen" src={Pen} width="35" height="35"/>} </> }
                <h2>{article.type}</h2>
                <div className="flex-article">
                <a target="_blank" href={article.pic}>
                <img className="artpic" src={article.pic} alt="pic"/>
                </a>
                <p className="descc">{article.description}</p>
                </div>
                {user && user.polyuser_name ?
                <div className="thumbs">
                    <div className="like">
                        <span>J'AIME</span>
                        {liked === 1 ? <img onClick={() => {setLiked(0);deleteLike(1)}} src={Liked} alt="liked" width="20" height="20"/> : <img onClick={() => {addLike(1)}} src={Like} alt="like" width="20" height="20"/> }
                        <span>{nbLikes}</span>
                    </div>
                    <div className="dislike">
                        <span>JE N'AIME PAS</span>
                        {liked === -1 ? <img onClick={() => {setLiked(0);deleteLike(-1)}} src={Disliked} alt="disliked" width="20" height="20"/> : <img onClick={() => {addLike(-1)}} src={Dislike} alt="dislike" width="20" height="20"/> }
                        <span>{nbDislikes}</span>
                    </div>
                </div> : <span className="connect">Connectez vous pour donner votre avis</span> }
                <span className="tim">{article.time.substr(0, 10)}</span>
            </div> : <img className="loader" alt="loader" src={Loader} />}
            <Comments user={user} setUser={setUser} comment_id={id} />
        </div>
    )
}

export default Article