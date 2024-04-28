const http = require('http')
const { v4: uuidv4 } = require('uuid')
const errorHandle = require('./errorHandle')
const successHandle = require('./successHandle')
const todos =[]

const requestListener = ( req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }

  let body = ''
  req.on('data', (chunk)=> {
    body += chunk
  })

  if( req.url === '/' && req.method === 'GET'){
    successHandle(res, headers, todos)
  } else if( req.url === '/todos' && req.method === 'POST'){
    req.on('end', async () => {
      try {
        const title = JSON.parse(body).title
        if( title !== undefined) {
          const todo = {
            title: title,
            id: uuidv4()
          }
          todos.push(todo)
          successHandle(res, headers, todos)
        } else {
          errorHandle(res, headers)
        }
      } catch (error) {
        errorHandle(res, headers)
      }
    })

  } else if( req.url === '/todos' && req.method === 'DELETE'){

    todos.length = 0
    successHandle(res, headers, todos)

  } else if( req.url.startsWith('/todos/') && req.method === 'DELETE'){
    
    const id = req.url.split('/').pop()
    const index = todos.findIndex( element => element.id === id)
    if ( index !== -1 ){
      todos.splice(index, 1)
      successHandle(res, headers, todos)
    } else {
      errorHandle(res, headers)
    }
    
  } else if( req.url.startsWith('/todos/') && req.method === 'PATCH'){
    req.on('end', async()=>{
      try {
        const title = JSON.parse(body).title
        const id = req.url.split('/').pop()
        const index = todos.findIndex( element => element.id === id)
        if( title !== undefined && index !== -1) {
          todos[index].title = title
          successHandle(res, headers, todos)
        } else {
          errorHandle(res, headers)
        }
        
      } catch (error) {
        errorHandle(res, headers)
      }

    })

  } else if( req.method === 'OPTIONS'){
    res.writeHead(200, headers)
    res.end()
  } else {
    res.writeHead(404, headers)
    res.write(JSON.stringify({
      status: false,
      message: "沒有此路由"
    }))
    res.end()
  }
}


const server = http.createServer(requestListener)
server.listen( process.env.PORT || 3005 )