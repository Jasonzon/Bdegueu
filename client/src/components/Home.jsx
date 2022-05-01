import '../styles/Home.css';
import {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import Logo from "../assets/bdegueu2.png"

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
    <h1 className="little-title">BDEgueu</h1>
    <p className="hom">A chaque BDE son BDEgueu ! Ici tu trouveras des infos sur les activités bédéhiques de ton école mais aussi :<br/>
      - Des goodies inédits <br/>
      - Du rézo <br/>
      Et bien-sûr tu peux donner ton avis
    </p>
    <img className="log" src={Logo} alt="logo" />
    <div>
      <h1 className="little-title">Derniers articles</h1>
      <ul className="coco">
      {articles.slice("").filter((article,index) => index !== 0).reverse().map(({article_name, article_type, article_id, created_at},index) => <> {index > 2 ? null :
          <Link to={`/articles/${article_id}`}>
          <li className="articles" key={index}>
              <h1>{article_name}</h1><br/>
              <h2>{article_type}</h2>
              <span>{created_at.substr(0, 10)}</span>
          </li></Link> } </>
      )}
      </ul>
    </div>
  </div>
  )
}

export default Home;
