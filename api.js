const http = require('http')


const PORT = 5000

// store all products
const products = [];


const handleResponse = (req, res) => ({ code = 200, error = null, data = null}) => { 
    res.setHeader('content-type', 'application/json') 
    res.writeHead(code) 
    res.write(JSON.stringify({ data, error })) 
    res.end() 
}


const bodyParser = (req, res, callback) => { 
    const body = [];

    req.on('data', (chunk) => { 
        body.push(chunk) 
    })

    req.on('end', () => { 
        if (body.length) { 
            const parsedBody = Buffer.concat(body).toString() 
            req.body = JSON.parse(parsedBody); 
        }

        callback(req, res) 
    })
}

const handleRequest = (req, res) => { 

    const response = handleResponse(req, res) 

    if (req.url === '/v1/products' && req.method === 'POST') { 

        products.push({ ...req.body, id: Math.floor(Math.random() * 300).toString()}) 

        return response({  data: products,  code: 201  }) 
    }

    if (req.url === '/v1/products' && req.method === 'GET') { 
        return response({ data: products, code: 200 }) 
    }


    if (req.url.startsWith('/v1/products/') && req.method === 'GET') { 
        const id = req.url.split('/')[3] 
 
        // find index of the products
        const productIndex = products.findIndex((product) => product.id === id) 
        // checks if product is in the products array
        if (productIndex === -1) { 
            // return response when products is not found
            return response({ code: 404, error: 'Product not found' }) 
        }

        // point to the value of the products from the index
        const product = products[productIndex] 

        // return response
        return response({  data: product, code: 200 }) 

    }


    // checks the url and method of the request
    if (req.url.startsWith('/v1/products/') && req.method === 'PATCH') { 
        const id = req.url.split('/')[3] 
        const productIndex = products.findIndex((product) => product.id === id) 

        if (productIndex === -1) { 
            return response({ code: 404, error: 'Product not found' }) 
        }


        const product = { ...products[productIndex], ...req.body } 

        return response({ data: product, code: 200 }) 

    }

    if (req.url.startsWith('/v1/products/') && req.method === 'DELETE') {  
        const id = req.url.split('/')[3] 

        const productIndex = products.findIndex((product) => product.id === id) 

        if (productIndex === -1) { 
            return response({ code: 404, error: 'product not found' }) 

        products.splice(productIndex, 1) 
        return response({ data: products, code: 200 }) 
    }
}
}

const server = http.createServer((req, res) => bodyParser(req, res, handleRequest)) 

server.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})