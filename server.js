var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 3333 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('查询字符串的路径\n' + pathWithQuery)


  if(path === '/uptoken'){
    response.status = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin','*')
    response.removeHeader('Date')                    

    var config = fs.readFileSync('./qiniu_key.json') //为了不泄露自己的key
    config = JSON.parse(config)
    let {accessKey, secretKey} = config
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
      scope: 'music-163demo',
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);

    response.write(`
    {
      "uptoken": "${uploadToken}"
    }
    `)
    response.end()
  }else{
    response.status = 404
    response.write
    response.end()
  }
})
server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
