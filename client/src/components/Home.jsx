import '../styles/Home.css';
import {useState, useEffect} from "react"
import {Link} from "react-router-dom"

function Home() {

  const [user, setUser] = useState({})
  const handleUser = (user) => {
    setUser(user)
  }

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
    <h1 className="little-title">Le site non officiel de votre école préférée</h1>
    <div>
      <h1 className="little-title">Derniers articles</h1>
      <ul>
      {articles.slice("").filter((article,index) => index !== 0).reverse().map(({article_name, article_type, article_id, created_at},index) => <> {index > 2 ? null :
          <li className="articles" key={index}>
              <Link to={`/articles/${article_id}`}>
                  <h1>{article_name}</h1><br/>
              <h3>{article_type}</h3>
              <span>{created_at.substr(0, 10)}</span>
              </Link>
          </li> } </>
      )}
      </ul>
    </div>
  </div>
  )
}

export default Home;
