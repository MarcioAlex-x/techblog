import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { collection, getDocs, Timestamp } from "firebase/firestore"
import { Link } from "react-router-dom"
import Style from './style.module.css'
import { Header } from "../../components/Header"

type Artigo = {
    id: string
    nome: string
    titulo: string
    texto: string
    imagem?: string
    criadoEm: Timestamp
}


export const Articles = () => {
    const [artigos, setArtigos] = useState<Artigo[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await getDocs(collection(db, 'artigos'))
            const artigosSnap = snapshot.docs.map((doc) => (
                { id: doc.id, ...doc.data() as Omit<Artigo, 'id'> }
            )).sort((a,b)=>b.criadoEm.toMillis() - a.criadoEm.toMillis())
            setArtigos(artigosSnap)
        }
        fetchData()
    }, [])

    return (
        <div className={Style.container}>
            <Header />
            {artigos.map(artigo => (
                <div className={Style['article-container']} key={artigo.id} >

                    <h2 className={Style['title-article']}>{artigo.titulo}</h2>

                    <p className={Style['text-article']}>Criado em {artigo.criadoEm.toDate().toLocaleString('pt-BR', {
                        day: '2-digit', month: 'long', year: 'numeric'
                    })} às {artigo.criadoEm.toDate().toLocaleString('pt-BR', {
                        hour: '2-digit', minute: '2-digit'
                    })} {artigo.nome && <span> por {artigo.nome}</span>}</p>

                    {artigo.imagem && (
                        <img
                            src={artigo.imagem}
                            alt={artigo.titulo}
                            className={Style['article-image']}
                            loading="lazy"
                        />
                    )}

                    <p className={Style['text-article']} style={{ whiteSpace: 'pre-line' }}>{artigo.texto}</p>

                    <Link className={`link nav-link ${Style.detalhe}`} to={`/article/${artigo.id}`}>Detalhes</Link>
                </div>
            ))}
        </div>
    )
}