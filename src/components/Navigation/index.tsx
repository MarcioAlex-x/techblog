import { NavLink } from "react-router-dom"
import { useAuth } from "../../services/useAuth"
import Style from './navigation.module.css'

export const Navigation = () => {
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        await logout()
    }



    return (
        <nav className={Style.nav}>
            <div className={Style['nav-links']}>
                <NavLink className='link nav-link' to='/' >Home</NavLink>
                {user && <NavLink className='link nav-link ' to='/new-article'>Nova Postagem</NavLink>}
                {user && <NavLink className='link nav-link' to={`/my-articles/${user.uid}`}>Meus artigos</NavLink>}

            </div>

            <div className={Style['nav-button']}>
                <p>Que bom ter você de volta {user?.displayName}</p>
                {user ?
                    (<button className="btn btn-danger" onClick={handleLogout}>Sair</button>) :
                    (<button className="btn btn-action">
                        <NavLink
                            className={({isActive})=>isActive?'link nav-link':'link nav-link'}
                            style={{ marginRight: 0 }}
                            to='/login'>
                            Login
                        </NavLink>
                    </button>)
                }
            </div>
        </nav>
    )
}