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

    async function getArticle() {
        const res = await fetch(`http://localhost:5000/article/id/${id}`, {
            method: "GET"
        })
        console.log(res)
        const parseRes = await res.json()
        console.log(parseRes)
        setArticle({
            name:parseRes.article_name,
            type:parseRes.article_type,
            pic:parseRes.article_pic,
            description:parseRes.article_description,
            time:parseRes.created_at,
            likes:parseRes.article_likes,
            dislikes:parseRes.article_dislikes
        })
        getLikes()
    }

    async function getLikes() {
        const res = await fetch(`http://localhost:5000/likes_article/id/${id}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        parseRes.filter((like) => user && like.likes_polyuser === user.polyuser_id)
        if (parseRes.length !== 0) {
            if (parseRes[0].likes_liked) {
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

    useEffect(() => {
        getArticle()
    },[])

    return (
        <div>
            <div className="article">
                <h1 className="title">{article.name}</h1>
                <h2>{article.type}</h2>
                <img src={article.pic} alt="pic"/>
                <p>{article.description}</p>
                <span>{article.time}</span>
                <div className="thumbs">
                    <div className="like">
                        <span>J'AIME</span>
                        {liked === 1 ? <img src={Liked} alt="liked" width="20" height="20"/> : <img src={Like} alt="like" width="20" height="20"/> }
                    </div>
                    <div className="dislike">
                        <span>JE N'AIME PAS</span>
                        {liked === -1 ? <img src={Disliked} alt="disliked" width="20" height="20"/> : <img src={Dislike} alt="dislike" width="20" height="20"/> }
                    </div>
                </div>
            </div>
            <Comments user={user} setUser={setUser} comment_id={id} />
        </div>
    )
}

export default Article