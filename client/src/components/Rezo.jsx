import "../styles/Rezo.css"

function Rezo({user, setUser}) {
    return (
        <div>
            <div className="connection">
                <h1 className="title">Rezo</h1>
                {user && user.polyuser_role === "admin" ? <button>Ajouter</button> : null}
            </div>
        </div>
    )
}

export default Rezo