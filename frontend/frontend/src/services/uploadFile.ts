export const uploadFile = async(file: File) => {
    const formData = new FormData
    formData.append('file', file)

    const API_HOST = 'http://localhost:3000'
    try {
        const res = await fetch(`${API_HOST}/api/files`, {
            method: 'POST',
            body: formData
        })
        if(!res.ok) throw new Error("Error uploading file")
        const json = await res.json()
        return [null, json.data]
    } catch (error) {
        console.log(error)
        return[error]
    }
}