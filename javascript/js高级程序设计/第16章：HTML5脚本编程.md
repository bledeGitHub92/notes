## 跨文档消息传递

支持 XDM 的浏览器有 IE8+、Firefox3.5+、Safari4+、Opera、Chrome、iOS 版 Safari 及 Android 版 WebKit。XDM 已经作为一个规范独立出来，现在它的名字叫Web Messaging。

跨文档消息传送（cross-document messaging），有时候简称为 XDM，指的是在来自不同域的页面间传递消息。

XMD 的核心是 postMessage(message, origin) 方法：向另一个地方传递消息。

    //注意：所有支持 XDM 的浏览器也支持 iframe 的 contentWindow 属性
    var iframeWindow = document.getElementById("myframe").contentWindow;
    iframeWindow.postMessage("A secret", "http://www.wrox.com");

接收到 XDM 消息时，会触发 window 对象的 message 事件。触发 message事件后，传递给 onmessage 处理程序的事件对象包含以下三方面的重要信息：

- data：作为 postMessage()第一个参数传入的字符串数据；
- origin：发送消息的文档所在的域，例如"http://www.wrox.com"；
- source：发送消息的文档的 window 对象的代理。这个代理对象主要用于在发送上一条消息的窗口中调用 postMessage()方法。如果发送消息的窗口来自同一个域，那这个对象就是 window；

基本的检测模式如下：

    EventUtil.addHandler(window, "message", function(event){
        //确保发送消息的域是已知的域
        if (event.origin == "http://www.wrox.com"){
            //处理接收到的数据
            processMessage(event.data);
            //可选：向来源窗口发送回执
            event.source.postMessage("Received!", "http://p2p.wrox.com");
        }
    });

## 原生拖放

HTML5 以 IE 的实例为基础制定了拖放规范。 Firefox 3.5、 Safari 3+和 Chrome 也根据 HTML5 规范实现了原生拖放功能。

### 拖放事件

拖动某元素时，将依次触发下列事件：

> 下列三个事件的目标都是被拖动的元素。

- dragstart：按下鼠标键并开始移动鼠标时，会在被拖放的元素上触发 dragstart 事件；
- drag：触发 dragstart 事件后，随即会触发 drag 事件，而且在元素被拖动期间会持续触发该事件；
- dragend：当拖动停止时（无论是把元素放到了有效的放置目标，还是放到了无效的放置目标上），会触发 dragend 事件；


当某个元素被拖动到一个有效的放置目标上时，下列事件会依次发生：

> 下列三个事件的目标都是作为放置目标的元素。

- dragenter：只要有元素被拖动到放置目标上，就会触发 dragenter 事件（类似于 mouseover 事件）；
- dragover：紧随其后的是 dragover 事件，而且在被拖动的元素还在放置目标的范围内移动时，就会持续触发该事件。
- dragleave 或 drop 如果元素被拖出了放置目标， dragover 事件不再发生，但会触发 dragleave 事件（类似于 mouseout事件）。如果元素被放到了放置目标中，则会触发 drop 事件而不是 dragleave 事件。

### 自定义放置目标

可以把任何元素变成有效的放置目标，方法是重写 dragenter 和 dragover 事件的默认行为：

    var droptarget = document.getElementById("droptarget");

    EventUtil.addHandler(droptarget, "dragover", function(event){
        EventUtil.preventDefault(event);
    });
    EventUtil.addHandler(droptarget, "dragenter", function(event){
        EventUtil.preventDefault(event);
    });

### dataTransfer对象

为了在拖放操作时实现数据交换， IE 5 引入了dataTransfer 对象，它是事件对象的一个属性，用于从被拖动元素向放置目标传递字符串格式的数据。目前， HTML5 规范草案也收入了 dataTransfer 对象。

保存在 dataTransfer 对象中的数据只能在 drop 事件处理程序中读取。dataTransfer 对象有两个主要方法：

- getData()：取得由 setData()保存的值；
- setData()：第一个参数是一个字符串，表示保存的数据类型。取值为"text"或"URL"：

> IE只定义了"text"和"URL"两种有效的数据类型，而 HTML5则对此加以扩展，允许指定各种 MIME类型。考虑到向后兼容， HTML5 也支持"text"和"URL"，但这两种类型会被映射为"text/plain"和"text/uri-list"。

    //设置和接收文本数据
    event.dataTransfer.setData("text", "some text");
    var text = event.dataTransfer.getData("text");
    
    //设置和接收 URL
    event.dataTransfer.setData("URL", "http://www.wrox.com/");
    var url = event.dataTransfer.getData("URL");

#### 设置数据

在 dragstart 事件处理程序中调用 setData()，手工保存自己要传输的数据。

#### 兼容性

Firefox 在其第5个版本之前不能正确地将 "url" 和 "text" 映射为 "text/uri-list" 和 "text/plain"。但是却能把"Text"（T 大写）映射为"text/plain"：

    var dataTransfer = event.dataTransfer;
    
    // 读取 URL
    var url = dataTransfer.getData("url") || dataTransfer.getData("text/uri-list");
    
    // 读取文本
    var text = dataTransfer.getData("Text");

Tips：一定要把短数据类型放在前面，因为 IE 10 及之前的版本仍然不支持扩展的 MIME 类型名，而它们在遇到无法识别的数据类型时，会抛出错误。

### dropEffect与effectAllowed

dataTransfer.dropEffect 可以知道被拖动的元素能够执行哪种放置行为。这个属性有下列 4 个可能的值：

> 必须在 ondragenter 事件处理程序中针对放置目标来设置它。

> dropEffect 属性只有搭配 effectAllowed 属性才有用。 

- "none"：不能把拖动的元素放在这里。这是除文本框之外所有元素的默认值；
- "move"：应该把拖动的元素移动到放置目标；
- "copy"：应该把拖动的元素复制到放置目标；
- "link"：表示放置目标会打开拖动的元素（但拖动的元素必须是一个链接，有 URL）；

dataTransfer.effectAllowed 属性表示允许拖动元素的哪种 dropEffect， effectAllowed 属性可能的值如下：

> 必须在 ondragstart 事件处理程序中设置 effectAllowed 属性。

- "uninitialized"：没有给被拖动的元素设置任何放置行为；
- "none"：被拖动的元素不能有任何行为；
- "copy"：只允许值为"copy"的 dropEffect；
- "link"：只允许值为"link"的 dropEffect；
- "move"：只允许值为"move"的 dropEffect；
- "copyLink"：允许值为"copy"和"link"的 dropEffect；
- "copyMove"：允许值为"copy"和"move"的 dropEffect；
- "linkMove"：允许值为"link"和"move"的 dropEffect；
- "all"：允许任意 dropEffect；

### 可拖动

默认情况下，图像、链接和文本是可以拖动的，也就是说，不用额外编写代码，用户就可以拖动它们。文本只有在被选中的情况下才能拖动，而图像和链接在任何时候都可以拖动。

HTML5 为所有 HTML 元素规定了一个 draggable 属性，表示元素是否可以拖动。图像和链接的 draggable 属性自动被设置成了 true，而其他元素这个属性的默认值都是 false。要想让其他元素可拖动，或者让图像或链接不能拖动，都可以设置这个属性。例如：

    <!-- 让这个图像不可以拖动 -->
    <img src="smile.gif" draggable="false" alt="Smiley face">
    <!-- 让这个元素可以拖动 -->
    <div draggable="true">...</div>

#### 兼容性

支持 draggable 属性的浏览器有 IE 10+、 Firefox 4+、 Safari 5+和 Chrome。 Opera 11.5 及之前的版本都不支持 HTML5 的拖放功能。

为了让 Firefox 支持可拖动属性，还必须添加一个 ondragstart 事件处理程序，并在 dataTransfer 对象中保存一些信息。

在 IE9 及更早版本中，通过 mousedown 事件处理程序调用 dragDrop()能够让任何元素可拖动。而在 Safari 4 及之前版本中，必须额外给相应元素设置 CSS 样式–khtml-user-drag: element。

### 其他成员

HTML5 规范规定 dataTransfer 对象还应该包含下列方法和属性：

- addElement(element)：为拖动操作添加一个元素。添加这个元素只影响数据（即增加作为拖动源而响应回调的对象），不会影响拖动操作时页面元素的外观。在写作本书时，只有 Firefox 3.5+ 实现了这个方法；
- clearData(format)：清除以特定格式保存的数据。实现这个方法的浏览器有 IE、Fireforx 3.5+、Chrome 和 Safari 4+；
- setDragImage(element, x, y)：指定一幅图像，当拖动发生时，显示在光标下方。这个法接收的三个参数分别是要显示的 HTML 元素和光标在图像中的 x、 y 坐标。其中， HTML 元素可以是一幅图像，也可以是其他元素。是图像则显示图像，是其他元素则显示渲染后的元素。实现这个方法的浏览器有 Firefox 3.5+、 Safari 4+和 Chrome；
- types：当前保存的数据类型。这是一个类似数组的集合，以"text"这样的字符串形式保存着数据类型。实现这个属性的浏览器有 IE10+、 Firefox 3.5+ 和 Chrome。

## 媒体元素

< audio >和< video >：不必依赖任何插件就能在网页中嵌入跨浏览器的音频和视频内容。并提供了对应的 Javascript API。

    <!-- 嵌入视频 -->
    <video src="conference.mpg" id="myVideo">Video player not available.</video>

    <!-- 嵌入音频 -->
    <audio src="song.mp3" id="myAudio">Audio player not available.</audio>

因为并非所有浏览器都支持所有媒体格式，所以可以指定多个不同的媒体来源：

    <!-- 嵌入视频 -->
    <video id="myVideo">
    <source src="conference.webm" type="video/webm; codecs='vp8, vorbis'">
    <source src="conference.ogv" type="video/ogg; codecs='theora, vorbis'">
    <source src="conference.mpg">
        Video player not available.
    </video>

    <!-- 嵌入音频 -->
    <audio id="myAudio">
    <source src="song.ogg" type="audio/ogg">
    <source src="song.mp3" type="audio/mpeg">
        Audio player not available.
    </audio>

#### 兼容性

支持这两个媒体元素的浏览器有 IE9+、 Firefox 3.5+、 Safari 4+、 Opera 10.5+、 Chrome、 iOS 版 Safari 和 Android 版 WebKit。

### 属性

< video >和< audio >元素都提供了完善的 JavaScript 接口。下表列出了这两个元素共有的属性，通过这些属性可以知道媒体的当前状态。

| 属性                  | 数据类型 | 说明                                                                                       |
|---------------------|------|------------------------------------------------------------------------------------------|
| autoplay            | 布尔值  | 取得或设置autoplay标志                                                                          |
| buffered            | 时间范围 | 表示已下载的缓冲的时间范围的对象                                                                         |
| bufferedBytes       | 字节范围 | 表示已下载的缓冲的字节范围的对象                                                                         |
| bufferingRate       | 整数   | 下载过程中每秒钟平均接收到的位数                                                                         |
| bufferingThrottled  | 布尔值  | 表示浏览器是否对缓冲进行了节流                                                                          |
| controls            | 布尔值  | 取得或设置controls属性，用于显示或隐藏浏览器内置的控件                                                          |
| currentLoop         | 整数   | 媒体文件已经循环的次数                                                                              |
| currentSrc          | 字符串  | 当前播放的媒体文件的URL                                                                            |
| currentTime         | 浮点数  | 已经播放的秒数                                                                                  |
| defaultPlaybackRate | 浮点数  | 取得或设置默认的播放速度。默认值为1.0秒                                                                    |
| duration            | 浮点数  | 媒体的总播放时间（秒数）                                                                             |
| ended               | 布尔值  | 表示媒体文件是否播放完成                                                                             |
| loop                | 布尔值  | 取得或设置媒体文件在播放完成后是否再从头开始播放                                                                 |
| muted               | 布尔值  | 取得或设置媒体文件是否静音                                                                            |
| networkState        | 整数   | 表示当前媒体的网络连接状态： 0表示空， 1表示正在加载， 2表示正在加载元数据， 3表示已经加载了第一帧， 4表示加载完成                           |
| paused              | 布尔值  | 表示播放器是否暂停                                                                                |
| playbackRate        | 浮点数  | 取得或设置当前的播放速度。用户可以改变这个值，让媒体播放速度变快或变慢，这与defaultPlaybackRate只能由开发人员修改的defaultPlaybackRate不同 |
| played              | 时间范围 | 到目前为止已经播放的时间范围                                                                           |
| readyState          | 整数   | 表示媒体是否已经就绪（可以播放了）。 0表示数据不可用， 1表示可以显示当前帧， 2表示可以开始播放， 3表示媒体可以从头到尾播放                        |
| seekable            | 时间范围 | 可以搜索的时间范围                                                                                |
| seeking             | 布尔值  | 表示播放器是否正移动到媒体文件中的新位置                                                                     |
| src                 | 字符串  | 媒体文件的来源。任何时候都可以重写这个属性                                                                    |
| start               | 浮点数  | 取得或设置媒体文件中开始播放的位置，以秒表示                                                                   |
| totalBytes          | 整数   | 当前资源所需的总字节数                                                                              |
| videoHeight         | 整数   | 返回视频（不一定是元素）的高度。只适用于< video >                                                            |
| videoWidth          | 整数   | 返回视频（不一定是元素）的宽度。只适用于< video >                                                            |
| volume              | 浮点数  | 取得或设置当前音量，值为0.0到1.0                                                                      |

### 事件

这两个媒体元素还可以触发很多事件，这些变化可能是媒体播放的结果，也可能是用户操作播放器的结果：

| 事件                  | 触发时机                                    |
|---------------------|-----------------------------------------|
| abort               | 下载中断                                    |
| canplay             | 可以播放时； readyState值为2                    |
| canplaythrough      | 播放可继续，而且应该不会中断； readyState值为3           |
| canshowcurrentframe | 当前帧已经下载完成； readyState值为1                |
| dataunavailable     | 因为没有数据而不能播放； readyState值为0              |
| durationchange      | duration属性的值改变                          |
| emptied             | 网络连接关闭                                  |
| empty               | 发生错误阻止了媒体下载                             |
| ended               | 媒体已播放到末尾，播放停止                           |
| error               | 下载期间发生网络错误                              |
| load                | 所有媒体已加载完成。这个事件可能会被废弃，建议使用canplaythrough |
| loadeddata          | 媒体的第一帧已加载完成                             |
| loadedmetadata      | 媒体的元数据已加载完成                             |
| loadstart           | 下载已开始                                   |
| pause               | 播放已暂停                                   |
| play                | 媒体已接收到指令开始播放                            |
| playing             | 媒体已实际开始播放                               |
| progress            | 正在下载                                    |
| ratechange          | 播放媒体的速度改变                               |
| seeked              | 搜索结束                                    |
| seeking             | 正移动到新位置                                 |
| stalled             | 浏览器尝试下载，但未接收到数据                         |
| timeupdate          | currentTime被以不合理或意外的方式更新                |
| volumechange        | volume属性值或muted属性值已改变                   |
| waiting             | 播放暂停，等待下载更多数据                           |

### 自定义媒体播放器

使用< audio >和< video >元素的 play()和 pause()方法，可以手工控制媒体文件的播放。组合使用属性、事件和这两个方法，很容易创建一个自定义的媒体播放器，如下面的例子所示。

...

### 检测编解码器的支持情况

有一个 JavaScript API 能够检测浏览器是否支持某种格式和编解码器。

这两个媒体元素都有一个 canPlayType() 方法，该方法接收一种格式/编解码器字符串，返回 "probably"、 "maybe"或""（ 空字符串）。空字符串是假值，因此可以像下面这样在 if 语句中使用canPlayType()：

    if (audio.canPlayType("audio/mpeg")){
        //进一步处理
    }

在同时传入 MIME 类型和编解码器的情况下，可能性就会增加，返回的字符串会变成"probably"：

    var audio = document.getElementById("audio-player");

    //很可能"maybe"
    if (audio.canPlayType("audio/mpeg")){
        //进一步处理
    }
    
    //可能是"probably"
    if (audio.canPlayType("audio/ogg; codecs=\"vorbis\"")){
        //进一步处理
    }

注意，编解码器必须用引号引起来才行。下表列出了已知的已得到支持的音频格式和编解码器。

| 音频     | 字符串                          | 支持的浏览器                            |
|--------|------------------------------|-----------------------------------|
| AAC    | audio/mp4;codecs="mp4a.40.2" | IE9+、 Safari 4+、 iOS版Safari       |
| MP3    | audio/mpeg                   | IE9+、 Chrome                      |
| Vorbis | audio/ogg;codecs="vorbis"    | Firefox 3.5+、 Chrome、 Opera 10.5+ |
| WAV    | audio/wav;codecs="1"         | Firefox 3.5+、 Opera 10.5+、 Chrome |

当然，也可以使用 canPlayType()来检测视频格式。下表列出了已知的已得到支持的音频格式和编解码器。

| 视频     | 字符串                                        | 支持的浏览器                                      |
|--------|--------------------------------------------|---------------------------------------------|
| H.264  | video/mp4; codecs="avc1.42E01E, mp4a.40.2" | IE9+、 Safari 4+、 iOS版Safari、 Android版WebKit |
| Theora | video/ogg; codecs="theora"                 | Firefox 3.5+、 Opera 10.5、 Chrome            |
| WebM   | video/webm; codecs="vp8, vorbis"           | Firefox 4+、 Opera 10.6、 Chrome              |

### Audio类型

< audio >元素还有一个原生的 JavaScript 构造函数 Audio，可以在任何时候播放音频。从同为 DOM元素的角度看， Audio 与 Image 很相似，但 Audio 不用像 Image 那样必须插入到文档中。只要创建一个新实例，并传入音频源文件即可。

    var audio = new Audio("sound.mp3");
    EventUtil.addHandler(audio, "canplaythrough", function(event){
        audio.play();
    });

创建新的 Audio 实例即可开始下载指定的文件。下载完成后，调用 play()就可以播放音频。

在 iOS 中，调用 play()时会弹出一个对话框，得到用户的许可后才能播放声音。如果想在一段音频播放后再播放另一段音频，必须在 onfinish 事件处理程序中调用 play()方法。

## 历史状态管理

首选使用 hashchange 事件。HTML5 通过更新 history 对象为管理历史状态提供了方便。

通过 hashchange 事件，可以知道 URL 的参数什么时候发生了变化，即什么时候该有所反应。而通过状态管理 API，能够在不加载新页面的情况下改变浏览器的 URL。为此，需要使用 history.pushState()方法，该方法可以接收三个参数：状态对象、新状态的标题和可选的相对 URL。例如：

    history.pushState({name:"Nicholas"}, "Nicholas' page", "nicholas.html");

执行 pushState()方法后，新的状态信息就会被加入历史状态栈，而浏览器地址栏也会变成新的相对 URL。但是，浏览器并不会真的向服务器发送请求，即使状态改变之后查询 location.href 也会返回与地址栏中相同的地址。另外，第二个参数目前还没有浏览器实现，因此完全可以只传入一个空字符串，或者一个短标题也可以。而第一个参数则应该尽可能提供初始化页面状态所需的各种信息。

因为 pushState()会创建新的历史状态，所以你会发现“后退”按钮也能使用了。按下“后退”按钮，会触发 window 对象的 popstate 事件。popstate 事件的事件对象有一个 state 属性，这个属性就包含着当初以第一个参数传递给 pushState()的状态对象。

    EventUtil.addHandler(window, "popstate", function(event){
        var state = event.state;
        if (state){ //第一个页面加载时 state 为空
            processState(state);
        }
    });

要更新当前状态，可以调用 replaceState()，传入的参数与 pushState()的前两个参数相同。调用这个方法不会在历史状态栈中创建新状态，只会重写当前状态。

    history.replaceState({name:"Greg"}, "Greg's page");

### 兼容性

支持 HTML5 历史状态管理的浏览器有 Firefox 4+、 Safari 5+、 Opera 11.5+和 Chrome。在 Safari 和Chrome 中，传递给 pushState()或 replaceState()的状态对象中不能包含 DOM 元素。而 Firefox支持在状态对象中包含 DOM 元素。 Opera 还支持一个 history.state 属性，它返回当前状态的状态对象。

