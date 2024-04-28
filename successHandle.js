module.exports = function successHandle(res, headers, todos){
  res.writeHead(200, headers)
  res.write(JSON.stringify({
    data: todos
  }))
  res.end()
}