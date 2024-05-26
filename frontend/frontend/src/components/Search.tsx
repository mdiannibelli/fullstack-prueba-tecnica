import { useEffect, useState } from "react"
import { searchData } from "../services/searchData"

interface Props {
    initialData: string[]
}

export const Search = ({initialData}: Props) => {
    const [data, setData] = useState<string[]>(initialData)
    const [searchValue, setSearchValue] = useState<string>(() => {
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    })

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
        if(!searchValue) {
            setData(initialData)
            return
        }
        // API Fetch
        searchData(searchValue).then(res => {
            const [err, newData] = res 
            if(err) throw new Error(`Error ${err}`)
            if(newData) setData(newData)
        })
    }, [searchValue, initialData])

  return (
    <div>
        <h2>Search</h2>
        <form>
            <input type="search" onChange={handleSearch} placeholder="Buscar información..." defaultValue={searchValue}/>
        </form>
        <ul>
            {
                data.map((row, index) => (
                    <li key={index}>
                        <article>
                            {Object.entries(row).map(([key,value]) => <p key={key}><strong>{key}</strong>:<span>{value}</span></p>)}
                        </article>
                    </li>
                ))
            }
        </ul>
    </div>
  )
}
