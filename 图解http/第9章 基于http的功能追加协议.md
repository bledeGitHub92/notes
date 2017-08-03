##WebSocket：Web浏览器与Web服务器之间全双工通信标准
### 推送功能
- 支持服务器向客户端推送数据的推送功能。
### 减少通信量
- 只要建立起WebSocket连接，就希望一直保持连接状态。
- WebSocket首部信息量很小。
- 在http建立后，需要完成一次握手的步骤
    - 握手 · 请求，需要用到Upgrade首部字段
      > Sec-WebSocket-Key 记录了握手过程中必不可少的键值  
        Sec-WebSocket-Protocol 记录使用的子协议
            
            GET /chat HTTP/1.1
            Host: server.example.com
            Upgrade: websocket
            Connection: Upgrade
            Sec-WebSocket-Key: abcde...
            Origin: http://example.com
            Sec-WebSocket-Protocol: chat, superchat
            Sec-WebSocket-Version: 13
    - 握手 · 响应，对于之前的请求，返回状态码101 Switch Protocols的响应。
      > Sec-WebSocket-Accept 的字段值由请求中的Sec-WebSocket-Key生成

            HTTP/1.1 101 Switching Protocols
            Upgrade: websocket
            Connection: Upgrade
            Sec-WebSocket-Accept: abcde...
            Sec-WebSocket-Protocol: chat