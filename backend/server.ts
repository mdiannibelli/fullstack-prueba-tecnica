import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors()) // Enable CORS

const storage = multer.memoryStorage() // middleware
const upload = multer({ storage: storage })

let userData:Array<Record<string, string>> = []

app.post('/api/files', upload.single('file'), async(req,res) => {
    // 1. Extract file from request
    const { file } = req
    // 2. Validate if we have a file
    if(!file) {
        return res.status(500).json({message: "File doesn't exist"})
    }
    // 3. Validate CSV mimetype format of file
    if(file.mimetype !== 'text/csv') {
        return res.status(500).json({message: "File must be CSV"})
    }
    try {
        // 4. Transform the file to string
        const csv = Buffer.from(file.buffer).toString('utf-8')
        console.log(csv)
        // 5. Transform the string csv to JSON
        const json = csvToJson.fieldDelimiter(',').csvStringToJson(csv)
        // 6. Save the JSON to db (or memory)
        userData = json
    } catch (error) {
        return res.status(500).json({message: "Error at parsing the file"})
    }
    // 7. Return 200 with data and message
    return res.status(200).json({data: userData , message: 'The file has loaded with success'})
})

app.get('/api/users', async(req,res) => {
    // 1. Extract query param ´q´
    const { q } = req.query
    // 2. Validate if we have a param
    if(!q) return res.status(500).json({message:"Query 'Q' is required"})
    if(Array.isArray(q)) return res.status(500).json({message:"Query 'Q' must be a string"})
    // 3. Filter the data from the db (or memory) using the query param
    const queryToSearch = q.toString().toLowerCase()
    const filteredData = userData.filter(row => {
        // 1, Juan Pérez, Marketing, juan.perez@example.com
       return Object.values(row).some(value => value.toLowerCase().includes(queryToSearch)) 
    })
    // 4. Return 200 with the filtered data
    return res.status(200).json({data: filteredData})
})

app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})