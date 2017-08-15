## 创建画布

标签通常需要指定一个id属性 (脚本中经常引用), width 和 height 属性定义的画布的大小.

    <canvas id="myCanvas" width="200" height="100"></canvas>

## 坐标

canvas 是一个二维网格。

canvas 的左上角坐标为 (0,0)

上面的 fillRect 方法拥有参数 (0,0,150,75)。

意思是：在画布上绘制 150x75 的矩形，从左上角开始 (0,0)。

## 绘制接口

### 获取 context

getContext("2d") 对象是内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。

    var ctx = element.getContext('2d');

### 路径

在Canvas上画线，我们将使用以下两种方法：

> 绘制线条我们必须使用到 "ink" 的方法，就像stroke().

    ctx.moveTo(x,y);    // 定义线条开始坐标
    ctx.lineTo(x,y);    // 定义线条结束坐标
    ctx.stroke();

### 矩形

在 canvas 中绘制矩形, 我们将使用以下方法:

    ctx.fillStyle="#FF0000";       // 设置fillStyle属性可以是CSS颜色，渐变，或图案。fillStyle 默认设置是#000000（黑色）。
    fillRect(x,y,width,height);    // 方法定义了矩形当前的填充方式。

### 圆形

在 canvas 中绘制圆形, 我们将使用以下方法:

实际上我们在绘制圆形时使用了 "ink" 的方法, 比如 stroke() 或者 fill().

    ctx.beginPath();
    ctx.arc(x,y,r,start,stop);
    ctx.stroke();

### 文本

使用 canvas 绘制文本，重要的属性和方法如下：

    ctx.font = 定义字体
    ctx.fillText(text,x,y) - 在 canvas 上绘制实心的文本
    <!-- or -->
    ctx.strokeText(text,x,y) - 在 canvas 上绘制空心的文本

### 渐变

渐变可以填充在矩形, 圆形, 线条, 文本等等, 各种形状可以自己定义不同的颜色。

当我们使用渐变对象，必须使用两种或两种以上的停止颜色。

addColorStop()方法指定颜色停止，参数使用坐标来描述，可以是0至1.

使用渐变，设置fillStyle或strokeStyle的值为 渐变，然后绘制形状，如矩形，文本，或一条线。

以下有两种不同的方式来设置Canvas渐变：

    var grd = createLinearGradient(x,y,x1,y1) - 创建线条渐变
    <!-- or  -->
    var grd = createRadialGradient(x,y,r,x1,y1,r1) - 创建一个径向/圆渐变

    <!-- 指定端点颜色  -->
    grd.addColorStop(0,"red");
    grd.addColorStop(1,"white");

    <!-- 填充渐变  -->
    ctx.fillStyle=grd;
    ctx.fillRect(10,10,150,80);

### 图像

把一幅图像放置到画布上, 使用以下方法:

    var img = document.getElementById("scream");
    ctx.drawImage(image, x, y);
