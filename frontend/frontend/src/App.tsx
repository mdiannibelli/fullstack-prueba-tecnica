import { useState } from 'react'
import './App.css'
import { uploadFile } from './services/uploadFile'
import { Search } from './components/Search'

const APP_STATUS = {
  IDLE: 'idle', // entry
  ERROR: 'error', // when is an error
  READY_UPLOAD: 'ready_upload', // ready to upload 
  UPLOADING: 'uploading', // while it's uploading
  READY_USAGE: 'ready_usage' // finished uploading
} as const

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: 'Subir archivo',
  [APP_STATUS.UPLOADING]: 'Subiendo archivo...'
}

/* const get  ButtonText = () => {
  switch(appStatus) {
    case APP_STATUS.READY_UPLOAD: 
      return 'Subir archivo'
    case APP_STATUS.UPLOADING:
      return 'Subiendo archivo...'
    default:
      return 'Subir archivo'
  }
} */

type AppStatus = 'idle' | 'error' | 'ready_upload' | 'uploading' | 'ready_usage'

function App() {
  const [appStatus, setAppStatus] = useState<AppStatus>(APP_STATUS.IDLE)
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState([])

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? []
    if(file) {
      setFile(file)
      setAppStatus(APP_STATUS.READY_UPLOAD)
    }
  }

  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(appStatus !== APP_STATUS.READY_UPLOAD || !file) {
      return 
    }

    setAppStatus(APP_STATUS.UPLOADING)

    const [err, newData] = await uploadFile(file)
    
    if(err) { setAppStatus(APP_STATUS.ERROR)}
    setAppStatus(APP_STATUS.READY_USAGE)

    if(newData) { setData(newData) }
    //console.log({err, newData})
  }
  


  return (
    <>
      <h4>Challenge: Upload CSV + Search</h4>
      <form onSubmit={handleSubmit}>
        <input 
        disabled={appStatus === APP_STATUS.UPLOADING}
        onChange={handleInputChange} 
        name='file' 
        type="file" 
        accept='.csv'/>
        {
          (appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING) &&
          <button type='submit' disabled={appStatus === APP_STATUS.UPLOADING}>
            {BUTTON_TEXT[appStatus]}
          </button>
        }
      </form>

      {
        appStatus === APP_STATUS.READY_USAGE && (
          <Search initialData={data}/>
        )
      }
    </>
  )
}

export default App
