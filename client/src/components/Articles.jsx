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
            <div className="connection">
                <h1 className="title">Articles</h1>
                {user && user.polyuser_role === "admin" ? <button>Ajouter</button> : null}
            </div>
            <ul>
            {articles.map(({article_name, article_type, article_id, created_at}) => 
                <li className="articles" key={article_id}>
                    <Link to={`/articles/${article_id}`}>
                        <h1>{article_name}</h1><br/>
                        <h3>{article_type}</h3>
                        <span>{created_at.substr(0, 10)}</span>
                    </Link>
                </li>
            )}
            </ul>
        </div>
    )
}

export default Articles