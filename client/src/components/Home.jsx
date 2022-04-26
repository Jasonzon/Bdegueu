import '../styles/Home.css';
import {useState} from "react"

function Home() {

  const [user, setUser] = useState({})
  const handleUser = (user) => {
    setUser(user)
  }

  return (
  <div>
    <h1 className="little-title">Le site non officiel de votre école préférée</h1>
  </div>
  )
}

export default Home;
