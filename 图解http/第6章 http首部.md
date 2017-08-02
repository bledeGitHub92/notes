## 首部类型
- 端到端首部：此类首部会转发给请求/响应对应的最终接收目标，且必须保存在由缓存生成的响应中,必须转发。
- 逐条首部：此类首部只对单次转发有效，会因通过或代理而不再转发。
## 通用首部字段
### Cache-Control：控制缓存行为。
> 缓存请求指令
- no-cache：参数无；强制向源服务器再次验证。
- no-store：参数无；不缓存请求或响应的任何内容。
- max-age = [秒]：参数必需；响应的缓存时间最大值。
- max-stale(= [秒])：参数可选；接收已过期指定时间内的响应。
- min-fresh = [秒]：参数必需；期望在指定时间内的响应仍有效。
- no-tranform：参数无；代理不可更改媒体类型。
- only-if-cached：参数无；缓存服务器有缓存才获取资源。
- cache-extension：参数无；新指令标记（token）。
> 缓存响应指令
- public：参数无；可向任意方提供响应的缓存。
- private：参数可选；仅向特定用户返回响应。
- no-cache(= [location])：参数可选；缓存前必须确认其有效性。
- no-store：参数无；不缓存请求或响应的任何内容。
- no-transform：参数无；代理不可更改媒体类型。
- must-revalidate：参数无;可缓存但必须向源服务器进行确认。
- proxy-revalidate：参数无；要求中间缓存服务器对缓存的响应有效性再进行确认。
- max-age = [秒]：参数必需；响应的缓存时间最大值。
- s-maxage = [秒]：参数必需；公共缓存服务器响应的最大Age值。
- cache-extension：参数无；新指令标记（token）。
### Connection：逐跳首部、连接管理。
> 控制不再转发给代理的首部字段
- Connection：不再转发的首部字段名
> 管理持久连接
- 服务器关闭持久连接。

        Connection: close
- http/1.0建立持久连接

        Connection: Keep-Alive
### Date：创建报文的日期和时间。
> 时间格式
- http/1.1

        Date: Tue, 03 Jul 2012 04:40:59 GMT
- http/1.0

        Date: Tue, 03-Jul-12 04:40:59 GMT
- 其他

        Date: Tue Jul 03 04:40:59 2012
### Pragma：报文指令。
> http/1.0遗留字段，向后兼容。
- 仅在请求首部使用。要求所有中间服务器不返回缓存的资源。

        Pragma: no-cache
        Cache-Control: no-cache
### Trailer：逐跳首部，报文末端的首部一览
> 用在http/1.1分块传输编码。
- 报文主体之后（分块长度0之后）出现首部字段Expires。

        HTTP/1.1 200 OK
        Date: Tue, 03 Jul 2012 04:40:59 GMT
        Content-Type: text/html
        ...
        Trailer: Expires
        空行
        ...（报文主体）...
        0
        Expires: Tue, 28 Sep 2004 23:59:59 GMT
### Transfer-Encoding：逐跳首部，指定报文主体的传输编码方式

### Upgrade：逐跳首部，升级为其他协议
> 检测是否能用更高版本协议进行通信
- 仅限于客户端和相邻服务器之间，因此需指定 Connection: Upgrade。

        GET /index.html HTTP/1.1
        Upgrade: TSL/1.0
        Connection: Upgrade

        HTTP/1.1 101 Switching Protocols
        Upgrade: TSL/1.0, HTTP/1.1
        Connection: Upgrade
### Via：代理服务器的相关信息
> 追踪客户端和服务器之间的请求和响应报文的传输路径
- 报文经过代理或网关时，会先在首部字段Via中附加该服务器的信息。
> 避免回路的发生
### Warning：错误通知
> 告知用户一些与缓存相关的问题和警告，由http/1.0 Retry-After演变而来。
- 首部格式。最后的日期时间部分可省略。

        Warning: [警告码][警告的主机：端口号]"[警告的内容]"([日期时间])
        Warning: 113 gw.hacker.jp:8080 "Heuristic expiration" Tue, 03 Jul 2012 05:09:44 GMT
> http/1.1定义了7种警告码，可扩展
- 110   Response is stale（响应已过期）                   代理返回已过期的资源
- 111   Revalidation failed（再验证失败）                 代理再验证资源有效性时失败（服务器无法到达等原因）
- 112   Disconnection operation（断开连接操作）           代理和互联网连接被故意切断
- 113   Heuristic expiration（试探性过期）                响应的使用期超过24小时（有效缓存的设定时间大于24小时的情况下）
- 199   Miscellaneous warning（杂项警告）                 任意的警告内容
- 214   Transformation applied（使用了转换）              代理对内容编码或媒体类型等执行了某些处理时
- 299   Miscellaneous presistent warning（持久杂项警告）  任意的警告内容
## 请求首部字段
### Accept：用户代理可处理的媒体类型
> 通知服务器，用户代理能处理的媒体类型，用权重q(0-1)表示相对优先级。

        Accept: text/html,text/plain;q=0.6;
### Accept-Charset：优先的字符集
> 通知服务器，用户代理支持的字符集，用权重q(0-1)表示相对优先级。

        Accept-Charset: ios-8859-5, unicode-1-1;q=0.8
### Accept-Encoding：优先的内容编码
> 通告服务器，用户代理支持的内容编码，用权重q(0-1)表示相对优先级。

        Accpet-Encoding: gzip, compress;q=0.8
### Accept-Language：优先的语言
> 通知服务器，用户代理支持的自然语言集，用权重q(0-1)表示相对优先级

        Accept-Language: zh-cn,zh;q=0.7,en-us,en=0.3
### Authorization：Web认证信息
> 告诉服务器，用户代理的认证信息。
### Expect：期待服务器的特定行为
> 等待状态码100响应的客户端在发生请求时，需要指定

        Expect: 100-continue
### From：用户的电子邮箱地址
> 告知服务器用户代理的邮箱地址。

        From: info@hackr.jp
### Host：请求资源所在服务器
> 告知服务器，请求的资源所在的互联网主机名和端口号。

        Host: www.hackr.jp
### if-Match：比较实体标记(ETag)
> 此字段值与ETag匹配时，服务器才处理请求。
### if-Modified-Since：比较资源的更新时间
> 此字段指定日期后，资源发生更新，服务器才处理请求。

        If-Modified-Since: Thu, 15 Apr 2004 00:00:00 GMT
### if-None-Match：比较实体标记(与if-Match相反)
> 此字段值与ETag值不一致时，服务器才处理请求。
### if-Range：资源未更新时发送实体Byte的范围请求
> 此字段值和请求资源的ETag值或时间一致时,作范围处理。反之，返回全部资源。

        GET /index.html
        If-Range: '123456',
        Range: bytes=5001-10000
### if-Unmodified-Since：比较资源的更新时间(与if-Modified-Since相反)
> 请求资源在此字段指定时间后未发生变化,才处理请求。

        If-Unmodified-Since: Thu, 15 Apr 2004 00:00:00 GMT
### Max-Forwards：最大传输逐跳数
> 以十进制整数指定可经过的服务器最大数目。
### Proxy-Authorization：逐跳首部，代理服务器要求客户端的认证信息
> 接受到来自代理服务器发来的认证质询时，客户端用发送包含此字段的请求，以告知服务器认证所需要的信息。
### Range：实体的字节范围请求
> 对只需获取部分资源的范围请求，包含此字段告知服务器资源的指定范围。

        Range: bytes=5001-1000
### Referer：对请求中URI的原始获取方
> 请求的原始资源的URI

        referer: http://www.hackr.jp/index.html
### TE：逐跳首部，传输编码优先级
> 告知服务器，客户端能够处理的传输编码方式及相对优先级。

        TE: gzip, deflate;q=0.5
### User-Agent：HTTP客户端程序的信息
> 浏览器用户代理名称等信息
- 网络爬虫发起请求时，在字段中加入爬虫作者的联系方式
- 经过代理，可能添加上代理服务器的名称。
## 响应首部字段
### Accept-Ranges：是否接受字节范围请求
> 告知客户端，服务器能否处理范围请求。
- 可处理指定bytes

        Accept-Ranges: bytes
- 反之指定none

        Accept-Ranges: none
### Age：推算资源创建经过时间
> 告知客户端，源服务器多久前创建了响应。单位为秒。
> 若创建响应的服务器是缓存服务器，则表示认证到当前的时间值，代理创建响应时必须加上Age首部。
### ETag：资源的匹配信息
> 将资源以字符串形式做唯一性标志的方式。
- 服务器会为没份资源分配ETag值。
- 当资源更新，ETag也需更新。
> 有强弱值之分
- 强ETag值，不论实体发生多么细微的变化都会改变值
。
        ETag: "usagi-1234"
- 弱ETag值，资源发生根本改变，才改变值。会在字段开头附加W/

        ETag: W/"usagi-1234"
### Location：令客户端重定向至指定URI
> 告知客户端，重定向至此字段指定的URI访问资源。
### Proxy-Authenticate -> 逐跳：代理服务器对客户端的认证信息
> 把代理所要求的认证信息发送给客户端。
### Retry-After：对再次发起请求的时机要求
> 告知客户端多久之后再发送请求。
- 可指定具体日期
- 可指定响应后秒数
### Server：HTTP服务器的安装信息
> 告知客户端当前服务器上安装的HTTP服务器应用程序的信息。

        Server: Apache/2.2.6 (Unix) PHP/5.2.5
### Vary：代理服务器缓存的管理信息
> 对缓存进行控制。
- 对此字段指定的首部字段相同时，返回缓存。
- 反之须从源服务器重新获取资源。

        Vary: Accept-language
### WWW-Authenticate：服务器对客户端的认证信息
> 用于HTTP访问认证。
- 告知客户端适用于请求URI所指定的认证方案（BASIC或DIGEST）和带参数提示的质询

        WWW-Authenticate: Basic realm=""Usagidesign Auth
## 实体首部字段
### Allow：资源可支持的HTTP方法
> 告知客户端，能够支持Requet-URI指定资源的所有HTTP方法。
- 服务器收到不支持的HTTP方法时，以405 Method Not Allow作为响应，并带上含有支持的方法的Allow首部
        Allow: GET, HEAD
### Content-Encoding：实体主体适用的编码方式
> 告知客户端，服务器对实体的主体部分选用的内容编码方式。
- gzip
- compress
- deflate
- identify
### Content-Language：实体主体的自然语言
> 告知客户端，实体主体使用的自然语言
### Content-Length：实体主体的大小(单位：字节)
> 实体的主体的大小（单位：字节）。
- 对实体的主体进行内容编码时，不能再使用此字段。
### Content-Location：替代对应资源的URI
> 告知客户端，报文主体部分对应的URI。
### Content-MD5：实体主体的报文摘要
> 对报文指定MD5再指定Base64编码后的值
- 用于报文完整性检查。但报文和此字段都可能被篡改，所以没作用。
### Content-Range：实体主体的位置范围
> 针对范围请求，告知客户端本轮响应的实体的范围，和整个实体大小。

        Content-Range: bytes 5001-10000/10000
### Content-Type：实体主体的媒体类型
> 实体主体内对象的媒体类型

        Content-Type: text/html; charset=UTF-8
### Expires：实体主体过期的日期时间
> 和Cache-control:max-age=[秒]作用一致，值是用日期。
### Last-Modified：资源的最后修改日期
> 指明资源最后修改日期。

        Last-Modified: Web, 23 May 2012 09:59:55 GMT