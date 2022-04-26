import "../styles/Register.css"

function Register({connection, setConnection}) {

    return (
        <div>
            <div className="connection">
                <h1>Enregistrement</h1>
                <button onClick={() => setConnection(true)}>Déjà inscrit ?</button>
            </div>
            <form>
                <label>Mail</label><br/>
                <input type="text" id="mail" name="mail" autocomplete="off"/><br/>
                <label>Pseudo</label><br/>
                <input type="text" id="pseudo" name="pseudo" autocomplete="off"/><br/>
                <label>Mot de passe</label><br/>
                <input type="password" id="password" name="password" autocomplete="off"/><br/>
                <button type="button">Se connecter</button>
            </form>
        </div>
    )
}

export default Register