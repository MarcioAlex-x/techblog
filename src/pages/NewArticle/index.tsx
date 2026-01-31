import { addDoc, collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { useAuth } from "../../services/useAuth"
import { useNavigate } from "react-router-dom"
import imageCompression from 'browser-image-compression'

import Style from './newarticle.module.css'

export const NewArticle = () => {
    const [titulo, setTitulo] = useState('')
    const [texto, setTexto] = useState('')
    const [imagem, setImagem] = useState<File | null>(null)

    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) navigate('/')
    }, [user, navigate])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!user) return
        if (!titulo || !texto) return

        let imageUrl = ''

        try {
            if (imagem) {
                imageUrl = await uploadImage(imagem)
            }

            await addDoc(collection(db, 'artigos'), {
                titulo,
                texto,
                imagem: imageUrl,
                nome: user.displayName,
                criadoEm: new Date(),
                uid: user.uid,
            })

            alert('Artigo enviado com sucesso.')

            setTitulo('')
            setTexto('')
            setImagem(null)
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message)
            }
        }
    }


    const uploadImage = async (file: File): Promise<string> => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
        }

        const compressedFile = await imageCompression(file, options)

        const formData = new FormData()
        formData.append('file', compressedFile)
        formData.append(
            'upload_preset',
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string
        )

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

        if (!cloudName) {
            throw new Error('Cloudinary cloud name não definido')
        }

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        const data = await response.json()

        if (!response.ok) {
            console.error('Erro Cloudinary:', data)
            throw new Error(data.error?.message || 'Erro no upload da imagem')
        }

        return data.secure_url
    }


    return (
        <div>
            <h2 className={Style['new-article-title']}>Contribua com suas ideias</h2>
            <p className={Style['new-article-sub-title']}>Descreva com detalhes seu pensamentos, ideias e descobertas relevantes ao tema tecnologia da informação</p>
            <form onSubmit={handleSubmit}>
                <div className="form-container">
                    <label htmlFor="titulo">Imagem</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setImagem(e.target.files[0])
                            }
                        }}
                    />
                </div>
                <div className="form-container">
                    <label htmlFor="titulo">Título</label>
                    <input
                        type="text"
                        name="titulo"
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)} />
                </div>
                <div className="form-container">
                    <label htmlFor="titulo">Conteúdo</label>
                    <textarea
                        name="texto"
                        value={texto}
                        onChange={e => setTexto(e.target.value)}></textarea>
                </div>
                <input className="btn btn-action" type="submit" value="Salvar" />
            </form>
        </div>
    )
}