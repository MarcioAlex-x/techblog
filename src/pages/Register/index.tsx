import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState } from "react"
import { auth } from "../../firebaseConfig"
import { Link } from "react-router-dom"

export const Register = () => {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRepassword] = useState('')
    const [checkPassword, setCheckPassword] = useState(false)

    const handleRegister = async (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            if(password !== rePassword){
                alert('Verifique a sua sennha.')
                return
            }
            const credentials = await createUserWithEmailAndPassword(auth, email, password)
            const user = credentials.user

            await updateProfile(user,{
                displayName:nome
            })

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message)
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleRegister} >
                <div className="form-container">
                    <label htmlFor="email">Usuário</label>
                    <input
                        type="text"
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)} />
                </div>
                <div className="form-container">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-container">
                    <label htmlFor="password">Senha</label>
                    <input
                        type={checkPassword ? "text" : "password"} 
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="form-container">
                    <label htmlFor="rePassword">Repita a senha</label>
                    <input 
                        type={checkPassword ? "text":"password"}
                        value={rePassword}
                        name="rePassword"
                        onChange={e=>setRepassword(e.target.value)} />
                </div>
                <input 
                    type="checkbox" 
                    name="checkPassword"
                    checked={checkPassword}
                    onChange={e=>setCheckPassword(e.target.checked)} />
                <label htmlFor="checkPassword">Mostrar Senha</label>
                <br />
                <input 
                    className="btn btn-action" type="submit" value="Registrar" />
            </form>
            <div className="dialog-box">
                <p style={{textAlign:'center', marginTop:'40px'}}>Já tem uma conta? <Link to='/login'>
                <br />
                Faça login</Link> e compartilhe as suas ideias</p>
            </div>
        </div>
    )
}