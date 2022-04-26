import "../styles/Comment.css"
import Like from "../assets/like.png"
import Liked from "../assets/liked.png"
import Dislike from "../assets/dislike.png"
import Disliked from "../assets/disliked.png"
import {useState, useEffect} from "react"

function Comment({comment_polyuser, comment_description, created_at, comment_likes, comment_dislikes, user, setUser, id}) {

    const [liked, setLiked] = useState(0)

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

    useEffect(() => {
        getLikes()
    },[])

    return (
        <div className="comment">
            <span>{comment_polyuser}</span>
            <p>{comment_description}</p>
            <span>{created_at}</span>
            <div className="thumbs">
                <div className="like">
                    <span>J'AIME</span>
                    {liked === 1 ? <img src={Liked} alt="liked" width="20" height="20"/> : <img src={Like} alt="like" width="20" height="20"/> }
                    <span>{comment_likes}</span>
                </div>
                <div className="dislike">
                    <span>JE N'AIME PAS</span>
                    {liked === -1 ? <img src={Disliked} alt="disliked" width="20" height="20"/> : <img src={Dislike} alt="dislike" width="20" height="20"/> }
                    <span>{comment_dislikes}</span>
                </div>
            </div>
        </div>
    )
}

export default Comment