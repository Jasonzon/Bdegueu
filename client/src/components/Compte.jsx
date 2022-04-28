import "../styles/Compte.css"
import Connection from "./Connection"
import Register from "./Register"
import User from "./User"

function Compte({user, setUser, connection, setConnection}) {

    return (
        <div>
            {!user.polyuser_name ? <> {connection ? 
                <Connection connection={connection} setConnection={setConnection} user={user} setUser={setUser}/> : 
                <Register connection={connection} setConnection={setConnection} user={user} setUser={setUser} /> } </> : 
                <User user={user} setUser={setUser} /> }
        </div>
    )
}

export default Compte