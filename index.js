const http = require('http')
const fs = require('fs')

const PORT = 5000

const server = http.createServer((req, res) => {
    console.log({path: req.url, method: req.method})

    if (req.url.endsWith('.html') && req.method === 'GET') {
        try {
            const splitUrl = req.url.split('/')
            console.log({ url: req.url, splitUrl })
            const filename = splitUrl[1]
            const fileLocation = `./${filename}`
    
    
            const file = fs.readFileSync(fileLocation)
            res.setHeader('content-type','text/html')
            // knowing the status
            res.writeHead(200)
            // sending data to the client
            res.write(file)
            res.end()
            
        } catch (error) {
            const file = fs.readFileSync('./404.html')
            res.setHeader('content-type','text/html')
            // knowing the status
            res.writeHead(200)
            // sending data to the client
            res.write(file)
            res.end()
            
        }
     
    }
})

server.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})