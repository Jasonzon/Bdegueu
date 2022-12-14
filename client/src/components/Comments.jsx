import "../styles/Comments.css"
import {useState, useEffect} from "react"
import Comment from "./Comment"
import Tick from "../assets/tick.png"
import Loader from "../assets/gif.gif"

function Comments({user, setUser, comment_id}) {

    const [onDel, setOnDel] = useState(0)

    const [comments, setComments] = useState([])
    const [indexPage, setIndexPage] = useState(1)

    async function getComments() {
        const res = await fetch(`/comment/article/${comment_id}`, {
            method: "GET"
        })
        const parseRes = await res.json()
        setComments(parseRes)
        setSet(true)
        comments.slice("").map(({goodies_id},index) => index === 0 ? setOnDel(goodies_id) : null)
    }

    useEffect(() => {
        if (comments.length === 0) {
            getComments()
        }
    },[])

    const [add, setAdd] = useState(false)
    const [input, setInput] = useState("")

    async function publier() {
        if (input !== "") {
            const body = {description:input,article:comment_id}
            const res = await fetch("/comment", {
                method: "POST",
                headers: {"Content-Type" : "application/json",token: localStorage.token},
                body:JSON.stringify(body)
            })
            const parseRes = await res.json()
            setInput("")
            setAdd(false)
            setComments([...comments,parseRes])
        }
    }

    const [loaded, setLoaded] = useState(0)

    const [set, setSet] = useState(false)

    useEffect(() => {
        setIndexPage(1)
    },[comments])

    return (
        <div>
            <div className="connection">
                <h1>Commentaires</h1>
                {!(user && user.polyuser_name) ? <button title="connectez-vous d'abord" disabled>Ajouter</button> : <> {add ? <button onClick={() => setAdd(false)}>Annuler</button> : <button onClick={() => setAdd(true)}>Ajouter</button>} </> }
            </div>
            {!add ? null : <div className="add">
                <input placeholder="Ajoutez un commentaire" value={input} onChange={(e) => setInput(e.target.value)} maxLength="500" />
                <img onClick={() => publier()} title="valider" src={Tick} alt="tick" width="50" height="50" />
            </div>}
            <ul className={`coco ${comments.length !== 0 ? null : "none"}`}>
                {comments.slice("").reverse().map(({comment_id, comment_description, comment_polyuser, created_at, comment_likes, comment_dislikes},index) => <>
                    {(index < indexPage*10 && index >= (indexPage-1)*10) ?
                    <li key={created_at}>
                        <Comment 
                            comment_description={comment_description} 
                            comment_polyuser={comment_polyuser} 
                            created_at={created_at} 
                            user={user}
                            setUser={setUser}
                            id={comment_id}
                            comments={comments}
                            setComments={setComments}
                            onDel={onDel}
                            setOnDel={setOnDel}
                            loaded={loaded}
                            setLoaded={setLoaded}
                        />
                    </li> : null } </>
                )}
            </ul> 
            {set ? null : <img alt="loader" className="loader" src={Loader} />}
            {!set || comments.length !== 0 ? null : <h1 className="center">Aucun commentaire</h1>}
            {set ?
            <div className="numbers">
                <div className="navigation">
                    <button onClick={() => setIndexPage(1)}>1</button>
                    {comments.length > indexPage*10 ? <button onClick={() => setIndexPage(indexPage+1)}>{">"}</button> : <button disabled>{">"}</button> }
                    <span>{indexPage.toString()}</span>
                    {indexPage === 1 ? <button disabled>{"<"}</button> : <button onClick={() => setIndexPage(indexPage-1)}>{"<"}</button> }
                    <button onClick={() => setIndexPage(((comments.length-comments.length%10)/10)+1)}>{comments.length < 11 ? 1 : ((comments.length-comments.length%10)/10)+1}</button>
                </div>
            </div> : null }
        </div>
    )
}

export default Comments