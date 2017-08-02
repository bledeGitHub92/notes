## 首部类型
- 端到端首部
    - 此类首部会转发给请求/响应对应的最终接收目标，且必须保存在由缓存生成的响应中,必须转发。
- 逐条首部
    - 此类首部只对单次转发有效，会因通过或代理而不再转发。
## 通用首部字段
Cache-Control：控制缓存行为
- no-cache：参数无；强制向源服务器再次验证。
- no-store：参数无；不缓存请求或响应的任何内容。
- max-age = [秒]：参数必需；响应的最大Age值。
- max-stale( = [秒])：参数可选；接收已过期的响应。
- min-fresh = [秒]：参数必需；期望在指定时间内的响应扔有效。
- no-tranform：参数无；代理不可更改媒体类型。
Connection：逐跳首部、连接管理

> Date

    创建报文的日期时间
> Pragma

    报文指令
>  Trailer -> 逐跳

    报文末端的首部一览

> Transfer-Encoding -> 逐跳

    指定报文主体的传输编码方式

> Upgrade -> 逐跳

    升级为其他协议

> Via

    代理服务器的相关信息

> Warning

    错误通知
## 请求首部字段
> Accept

    用户代理可处理的媒体类型

> Accept-Charset

    优先的字符集
> Accept-Encoding

    优先的内容编码
> Accept-Language

    优先的语言
> Authorization

    Web认证信息
> Expect

    期待服务器的特定行为
> From

    用户的电子邮箱地址
> Host

    请求资源所在服务器
> if-Match

    比较实体标记(ETag)
> if-Modified-Since

    比较资源的更新时间
> if-None-Match

    比较实体标记(与if-Match相反)
> if-Range

    资源未更新时发送实体Byte的范围请求
> if-Unmodified-Since

    比较资源的更新时间(与if-Modified-Since相反)
> Max-Forwards

    最大传输逐跳数
> Proxy-Authorization -> 逐跳

    代理服务器要求客户端的认证信息
> Range

    实体的字节范围请求
> Referer

    对请求中URI的原始获取方
> TE -> 逐跳

    传输编码优先级
> User-Agent

    HTTP客户端程序的信息
## 响应首部字段
> Accept-Ranges
    
    是否接受字节范围请求
> Age

    推算资源创建经过时间
> ETag

    资源的匹配信息
> Location

    令客户端重定向至指定URI
> Proxy-Authenticate -> 逐跳

    代理服务器对客户端的认证信息
> Retry-After

    对再次发起请求的时机要求
> Server

    HTTP服务器的安装信息
> Vary

    代理服务器缓存的管理信息
> WWW-Authenticate

    服务器对客户端的认证信息
## 实体首部字段
> Allow

    资源可支持的HTTP方法
> Content-Encoding

    实体主体适用的编码方式
> Content-Language

    实体主体的自然语言
> Content-Length

    实体主体的大小(单位：字节)
> Content-Location

    替代对应资源的URI
> Content-MD5

    实体主体的报文摘要
> Content-Range

    实体主体的位置范围
> Content-Type

    实体主体的媒体类型
> Expires

    实体主体过期的日期时间
> Last-Modified

    资源的最后修改日期