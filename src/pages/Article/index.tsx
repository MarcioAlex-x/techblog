import { doc, getDoc, type Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { useParams } from "react-router-dom"
import Linkify from 'linkify-react'
import Style from './article.module.css'

export const Article = () => {
 

    const { id } = useParams()

    const [nome, setNome] = useState('')
    const [titulo, setTitulo] = useState('')
    const [texto, setTexto] = useState('')
    const [criadoEm, setCriadoEm] = useState<Timestamp|null>(null)
    const [loading, setLoading] = useState(true)
    console.log('olá')

    useEffect(()=>{
        setLoading(true)
        const fetchData = async () => {
        try {
            if (!id) return

            const articleRef = doc(db, 'artigos', id)
            const snapshot = await getDoc(articleRef)
            const data = snapshot.data()

            setNome(data?.nome)
            setTitulo(data?.titulo)
            setTexto(data?.texto)
            setCriadoEm(data?.criadoEm)

        } catch (err) {

            if (err instanceof Error) {
                console.error(err.message)
            }
        } finally{
            setLoading(false)
        }
    }

    fetchData()
    },[id])

    
    return (
        <div className={Style.container}>

            <div className="spinnerContainer">{loading && <img src="/loading.gif" />}</div>
            <div className={Style['article-container']}>
                <h2>{titulo}</h2>
                {criadoEm && <p className={Style.criadoEm}>Criado em {criadoEm.toDate().toLocaleDateString()} {nome && <span> por {nome}</span>}</p>}
                <Linkify>
                    <p style={{whiteSpace:'pre-line'}}>{texto}</p>
                </Linkify>
            </div>
        </div>
    )
}