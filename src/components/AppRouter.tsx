import { createBrowserRouter } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import App from '../App'
import { NewArticle } from '../pages/NewArticle'
import { Articles } from '../pages/Articles'
import { Article } from '../pages/Article'
import { MyArticles } from '../pages/MyArticles'
import { UpdateArticle } from '../pages/UpdateArticle'

export const AppRouter = createBrowserRouter([
    {
        path: '/', element: <App />, children: [
            { path: '/register', element: <Register /> },
            { path: '/login', element: <Login /> },
            { path: '/new-article', element: <NewArticle /> },
            { index:true , element: <Articles /> },
            { path:'/article/:id', element: <Article /> },
            { path: '/my-articles/:uid', element: <MyArticles /> },
            { path:'/update-article/:id', element: <UpdateArticle /> }
        ]
    }
])
