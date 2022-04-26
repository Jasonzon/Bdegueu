import "../styles/Articles.css"
import {useState, useEffect} from "react"
import {Link} from "react-router-dom"

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
    return (
        <div>
            <h1 className="title">Articles</h1>
            {user && user.polyuser_role === "admin" ? <button>AJOUTER</button> : null }
            <ul>
            {articles.map(({article_name, article_type, article_id, created_at}) => 
                <li className="article" key={article_id}>
                    <Link to={`/articles/${article_id}`}>
                        <h1>{article_name}</h1>
                    </Link>
                    <h3>{article_type}</h3>
                    <span>{created_at.substr(0, 10)}</span>
                </li>
            )}
            </ul>
        </div>
    )
}

export default Articles