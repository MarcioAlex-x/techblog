import { useState, } from "react"
import { useAuth } from "../../services/useAuth"
import { Link, useNavigate } from "react-router-dom"

export const Login = () =>{

    const { login } = useAuth()
    const navigate = useNavigate()
    
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    
    const handleLogin = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        try {

            await login(email, password)
            navigate('/')
            
            alert('Login bem sucedido')
        } catch (err) {
            if(err instanceof Error){
                console.error(err.message)
                alert('E-mail e Senha incorretos')
            }   
        }
    }

    return(
        <div>
            <form onSubmit={handleLogin}>

                <div className="form-container">
                    <label htmlFor="email">E-mail</label>
                    <input 
                        type="text"
                        name="email"
                        value={email}
                        onChange={e=>setEmail(e.target.value)} />
                </div>

                <div className="form-container">
                    <label htmlFor="password">Senha</label>
                    <input 
                        type="password"
                        name="password"
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                         />
                </div>

                <input className="btn btn-action" type="submit" value="Entrar" />

            </form>
            <div className="dialog-box">
                Ainda não tem uma conta? <Link to='/register'>Cadastre-se</Link> e compartilhe as suas ideias
            </div>
        </div>
    )
}