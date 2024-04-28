module.exports = function errorHandle(res, headers){
  res.writeHead(400, headers)
  res.write(JSON.stringify({
    status: false,
    message: "欄位填寫錯誤 或 無此 todo id"
  }))
  res.end()
}