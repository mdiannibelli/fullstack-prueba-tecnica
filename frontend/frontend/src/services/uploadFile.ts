export const uploadFile = async(file: File) => {
    const formData = new FormData
    formData.append('file', file)

    try {
        const res = await fetch('http://localhost:3000/api/files', {
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