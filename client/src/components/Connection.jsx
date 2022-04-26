import "../styles/Connection.css"

function Connection({connection, setConnection}) {
    return (
        <div>
            <div className="connection">
                <h1>Connexion</h1>
                <button onClick={() => setConnection(false)}>Pas enregistré ?</button>
            </div>
            <form>
                <label>Mail</label><br/>
                <input type="text" id="mail" name="mail" /><br/>
                <label>Mot de passe</label><br/>
                <input type="password" id="password" name="password" /><br/>
                <button type="button">Se connecter</button>
            </form>
        </div>
    )
}

export default Connection