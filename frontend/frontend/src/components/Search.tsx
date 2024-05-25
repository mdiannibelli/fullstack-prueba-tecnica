import { useEffect, useState } from "react"

interface Props {
    initialData: string[]
}

export const Search = ({initialData}: Props) => {
    const [data, setData] = useState<string[]>(initialData)
    const [searchValue, setSearchValue] = useState<string>("")

    const handleSearch = (e:React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    // Cada vez que cambie el search actualizaremos la url
    useEffect(() => {
        if(searchValue === '') {
            window.history.pushState({}, '', window.location.pathname)
            return
        }
        window.history.pushState({}, '', `?q=${searchValue}`)
    }, [searchValue])

    useEffect(() => {
        const res =
    }, [])

  return (
    <div>
        <h2>Search</h2>
        <form>
            <input type="search" onChange={handleSearch} placeholder="Buscar información..."/>
        </form>
    </div>
  )
}
