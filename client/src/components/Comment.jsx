import "../styles/Comment.css"
import Like from "../assets/like.png"
import Liked from "../assets/liked.png"
import Dislike from "../assets/dislike.png"
import Disliked from "../assets/disliked.png"
import {useState, useEffect} from "react"

function Comment({comment_polyuser, comment_description, created_at, user, setUser, id}) {

    const [liked, setLiked] = useState(0)
    const [name, setName] = useState("")

    async function getLikes() {
        const res = await fetch(`http://localhost:5000/likes_comment/id/${id}`, {
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

    async function getUser() {
        const res = await fetch(`http://localhost:5000/polyuser/id/${comment_polyuser}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        setName(parseRes.polyuser_name)
    }

    useEffect(() => {
        getUser()
    },[])

    useEffect(() => {
        if (user && user.polyuser_name) {
            getLikes()
        }
    },[user])

    const [nbLikes, setNbLikes] = useState(0)
    const [nbDislikes, setNbDislikes] = useState(0)

    async function getLikes() {
        const res = await fetch(`http://localhost:5000/likes_comment/comment/${id}`, {
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
        const res = await fetch(`http://localhost:5000/likes_comment/comment/${id}`, {
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
            const body = {liked:int === -1 ? false : true,polyuser:user.polyuser_id,comment:id}
            const res2 = await fetch(`http://localhost:5000/likes_comment/id/${slice[0].likes_id}`, {
                method: "PUT",
                headers: {"Content-Type" : "application/json"},
                body:JSON.stringify(body)
            })
        }
        else {
            if (int === 1) {
                setNbLikes(nbLikes+1)
            }
            else {
                setNbDislikes(nbDislikes+1)
            }
            const body = {liked:int === -1 ? false : true,polyuser:user.polyuser_id,comment:id}
            const res2 = await fetch("http://localhost:5000/likes_comment", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body:JSON.stringify(body)
            })
        }
    }

    async function deleteLike(int) {
        if (int === 1) {
            setNbLikes(nbLikes-1)
        }
        else {
            setNbDislikes(nbDislikes-1)
        }
        const res = await fetch(`http://localhost:5000/likes_comment/comment/${id}`, {
            method: "GET"
        })
        const parseRes = await res.json() 
        const slice = parseRes.slice("").filter(({likes_polyuser}) => user && user.polyuser_id === likes_polyuser)
        const res2 = await fetch(`http://localhost:5000/likes_comment/id/${slice[0].likes_id}`, {
            method: "DELETE"
        })
    }

    return (
        <div className="comment">
            <span className="nam">{name}</span>
            <p>{comment_description}</p>
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
            <span className="tim">{created_at.substr(0,10)}</span>
        </div>
    )
}

export default Comment