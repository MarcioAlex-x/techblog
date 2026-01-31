import Style from './header.module.css'
export const Header = () =>{

    return(
        <header>
            <h1 className={Style['title-header']}>Tech Blog</h1>
            <img className={Style['image-header']} src="/techblog.png" alt="Hero Tech Blog - O seu blog diário sobre tecnologia da informação." />
        </header>
    )
}