import "../styles/Comments.css"
import {useState, useEffect} from "react"
import Comment from "./Comment"

function Comments({user, setUser, comment_id}) {

    const [comments, setComments] = useState([])
    const [indexPage, setIndexPage] = useState(1)

    async function getComments() {
        const res = await fetch(`http://localhost:5000/comment/article/${comment_id}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        setComments(parseRes)
    }

    useEffect(() => {
        getComments()
    },[])

    return (
        <div>
            <h1 className="title">Commentaires</h1>
            <ul>
                {comments.map(({comment_id, comment_description, comment_polyuser, created_at, comment_likes, comment_dislikes},index) => <>
                    {index < indexPage*10 ?
                    <li key={created_at}>
                        <Comment 
                            comment_description={comment_description} 
                            comment_polyuser={comment_polyuser} 
                            created_at={created_at} 
                            comment_likes={comment_likes}
                            comment_dislikes={comment_dislikes}
                            user={user}
                            setUser={setUser}
                            id={comment_id}
                        />
                    </li> : null } </>
                )}
            </ul>
            <div className="navigation">
                <button>1</button>
                {comments.length/10 > indexPage ? <button onClick={setIndexPage(indexPage+1)}>{">"}</button> : <button disabled>{">"}</button> }
                <span>{indexPage}</span>
                {indexPage === 1 ? <button disabled>{"<"}</button> : <button onClick={setIndexPage(indexPage-1)}>{"<"}</button> }
                <button>{comments.length < 11 ? 1 : parseInt(comments.length/10)}</button>
            </div>
        </div>
    )
}

export default Comments