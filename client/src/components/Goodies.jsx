import "../styles/Goodies.css"

function Goodies({user, setUser}) {
    return (
        <div>
            <div className="connection">
                <h1 className="title">Goodies</h1>
                {user && user.polyuser_role === "admin" ? <button>Ajouter</button> : null}
            </div>
        </div>
    )
}

export default Goodies