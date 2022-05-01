import "../styles/Article.css"
import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import Like from "../assets/like.png"
import Liked from "../assets/liked.png"
import Dislike from "../assets/dislike.png"
import Disliked from "../assets/disliked.png"
import Comments from "./Comments"

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

    const [comments, setComments] = useState([])
    const [indexPage, setIndexPage] = useState(1)

    async function getComments() {
        const res = await fetch(`http://localhost:5000/comment/article/${id}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        setComments(parseRes)
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
                headers: {"Content-Type" : "application/json"},
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
                headers: {"Content-Type" : "application/json"},
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
        const res2 = await fetch(`http://localhost:5000/likes_article/id/${slice[0].likes_id}`, {
            method: "DELETE"
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

    return (
        <div>
            <div className="article">
                <h1 className="title">{article.name}</h1>
                <h2>{article.type}</h2>
                <img src={article.pic} alt="pic"/>
                <p>{article.description}</p>
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
            </div>
            <Comments user={user} setUser={setUser} comment_id={id} />
        </div>
    )
}

export default Article