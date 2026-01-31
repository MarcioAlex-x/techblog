import { doc, getDoc, type Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { useParams } from "react-router-dom"

export const Article = () => {
 

    const { id } = useParams()

    const [nome, setNome] = useState('')
    const [titulo, setTitulo] = useState('')
    const [texto, setTexto] = useState('')
    const [criadoEm, setCriadoEm] = useState<Timestamp|null>(null)
    console.log('olá')

    useEffect(()=>{
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
        }
    }

    fetchData()
    },[id])

    return (
        <div>
            <h2>{titulo}</h2>
            {criadoEm && <p>Criado em {criadoEm.toDate().toLocaleDateString()} {nome && <span> por {nome}</span>}</p>}
            <p style={{whiteSpace:'pre-line'}}>{texto}</p>
        </div>
    )
}