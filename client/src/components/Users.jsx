import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import "../styles/Users.css"
import Loader from "../assets/gif.gif"

function Users() {
    const {id} = useParams()
    const [user, setUser] = useState({
        polyuser_id:"",
        polyuser_description:"",
        polyuser_mail:"",
        polyuser_name:"",
        polyuser_role:""
    })

    async function getUser() {
        const res = await fetch(`http://localhost:5000/polyuser/id/${id}`,{
            method: "GET"
        })
        const parseRes = await res.json()
        setUser(parseRes)
    }

    useEffect(() => {
        getUser()
    },[])

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (user.polyuser_id !== "") {
            setLoaded(true)
        }
    },[user])

    return (
        <div>
            {loaded ?
            <div className="perso users">
                <h1>{user.polyuser_name} {"#"+("000"+user.polyuser_id).slice(-4)}</h1>
                <h3>Rôle : {user.polyuser_role}</h3>
                <p>{user.polyuser_description}</p>
            </div> : <img alt="loader" className="loader" src={Loader} />}
        </div>
    )
}

export default Users