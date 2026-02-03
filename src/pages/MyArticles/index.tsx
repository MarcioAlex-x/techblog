import { collection, deleteDoc, doc, getDocs, query, where, type Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { useAuth } from "../../services/useAuth"
import { Link } from "react-router-dom"
import Style from './myArtycles.module.css'
import Linkify from 'linkify-react';

type Artigos = {
    id: string
    nome: string
    titulo: string
    imagem?:string
    texto: string
    criadoEm: Timestamp
    uid: string
}

export const MyArticles = () => {
    const [artigos, setArtigos] = useState<Artigos[]>([])
    const { user } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            try {

                if (!user) return

                const q = query(collection(db, 'artigos'), where('uid', '==', user?.uid))
                const snapshot = await getDocs(q)
                const querySnapShot = snapshot.docs.map((doc) => (
                    { id: doc.id, ...doc.data() as Omit<Artigos, 'id'> }
                )).sort((a,b)=>b.criadoEm.toMillis() - a.criadoEm.toMillis())
                setArtigos(querySnapShot)

            } catch (err) {
                if (err instanceof Error) {
                    console.error(err.message)
                }
            }
        }
        fetchData()
    }, [user])

    const handleDelete = async (id:string) => {
        try {
            const resp = confirm('Tem certeza que deseja apagar o artigo?')
            if (resp === true) {
                await deleteDoc(doc(db, 'artigos', id))
                setArtigos(prev => prev.filter(a=>a.id !== id))
            } else {
                return
            }

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message)
            }
        }
    }

    return (
        <div className={Style.container}>
            {artigos.map((artigo) => (
                <div className={Style['article-container']} key={artigo.id}>
                    <h2 >{artigo.titulo}</h2>
                    <p ><i>Criado em {artigo.criadoEm.toDate().toLocaleString('pt-BR')}</i></p>
                    {artigo.imagem && (
                        <img
                            src={artigo.imagem}
                            alt={artigo.titulo}
                            className={Style['article-image']}
                            loading="lazy"
                        />
                    )}
                    <p className={Style['text-article']}><Linkify>{artigo.texto}</Linkify></p>
                    <button className="btn btn-danger" onClick={() => handleDelete(artigo.id)}>Apagar</button>
                    <button className="btn btn-action"><Link className="link" to={`/update-article/${artigo.id}`}>Atualizar</Link></button>
                </div>
            ))}
        </div>
    )
}