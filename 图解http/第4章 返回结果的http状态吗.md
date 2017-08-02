## 4.2 2XX 成功
- 200 OK：客户端请求被服务器正常处理了。
- 204 No Content：服务器接受的请求处理成功，但返回的响应报文不包含主体部分。
- 206 Partical Content：客户端进行了范围请求，服务器成功执行了GET请求。
## 4.3 3XX 重定向
- 301 Moved Permanently：永久性重定向。
- 302 Found：临时性重定向。
- 303 See Ohter：明确客户端用GET从另一个URL获取资源。
- 304 Not Modified：客户端发送附带条件（if-modified-since..），资源未满足条件.
- 307 Temporary Redirect：同302。
## 4.4 4XX 客户端错误
- 400 Bad Request：请求报文中出现语法错误。
- 401 Unauthorized：请求需要HTTP认证。
- 403 Forbidden：对请求资源的访问被服务器拒绝。
- 404 Not Found：服务器上无法找到请求的资源。
## 5XX 服务器错误
- 500 Internal Server Error：服务器在执行请求时发生错误。
- 503 Service Unavailable：服务器处于超负载或正在进行停机维护，现在无法提供请求。
