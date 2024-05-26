export const searchData = async(search: string) => {
    const API_HOST = 'http://localhost:3000'
    try {
        const res = await fetch(`${API_HOST}/api/users?q=${search}`)
        if(!res.ok) throw new Error("Error searching data")
        const json = await res.json()
        return [null, json.data]
    } catch (error) {
        console.log(error)
        return[error]
    }
}