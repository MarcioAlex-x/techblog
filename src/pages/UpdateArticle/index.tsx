import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { useAuth } from "../../services/useAuth"
import { useNavigate, useParams } from "react-router-dom"
import imageCompression from "browser-image-compression"

export const UpdateArticle = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [titulo, setTitulo] = useState("")
    const [texto, setTexto] = useState("")
    const [imagem, setImagem] = useState<File | null>(null)
    const [imagemAtual, setImagemAtual] = useState<string>("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            navigate("/")
            return
        }

        const loadArticle = async () => {
            if (!id) return

            const ref = doc(db, "artigos", id)
            const snap = await getDoc(ref)

            if (!snap.exists()) {
                navigate("/")
                return
            }

            const data = snap.data()

            if (data.uid !== user.uid) {
                navigate("/")
                return
            }

            setTitulo(data.titulo)
            setTexto(data.texto)
            setImagemAtual(data.imagem || "")
            setLoading(false)
        }

        loadArticle()
    }, [id, user, navigate])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!id || !user) return

        let imageUrl = imagemAtual

        try {
            if (imagem) {
                imageUrl = await uploadImage(imagem)
            }

            const ref = doc(db, "artigos", id)

            await updateDoc(ref, {
                titulo,
                texto,
                imagem: imageUrl,
                atualizadoEm: new Date(),
            })

            alert("Artigo atualizado com sucesso.")
            navigate("/")
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
        formData.append("file", compressedFile)
        formData.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string
        )

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        if (!cloudName) throw new Error("Cloudinary cloud name não definido")

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error?.message || "Erro no upload da imagem")
        }

        return data.secure_url
    }

    if (loading) return <p>Carregando artigo...</p>

    return (
        <div>
            <h2 >Editar artigo</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-container">
                    <label>Imagem</label>
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
                    <label>Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>

                <div className="form-container">
                    <label>Conteúdo</label>
                    <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                    />
                </div>

                <input
                    className="btn btn-action"
                    type="submit"
                    value="Atualizar"
                />
            </form>
        </div>
    )
}
