## 基本用法

第一步：使用 canvas 元素前，必须先指定其 width 和 height 特性。出现在开始和结束标签之间的信息是后备信息，当浏览器不支持 canvas 元素时就显示这些信息。

    < canvas id="drawing" width="200" height="200" >A drawing of something.< /canvas >

第二步：调用 getContext() 方法并传入上下文的名字（2d/3d），取得绘图上下文对象的引用。

    var drawing = document.querySelector('drawing');

    if (drawing.getContext) {
        var context = drawing.getContext('2d');
    }

Tips：使用 toDataURL() 方法，可以导出在 canvas 元素上绘制的图像。这个方法接受一个图像的 MIME 类型作为参数。

    var drawing = document.querySelect('#drawing');

    if (drawing.getContext) {
        var imgURI = drawing.toDataURL('image/png');

        var image = document.createElement('img');
        img.src = imgURI;
        document.body.appendChild(img);
    }

## 2D上下文

使用 2D 绘图上下文提供的方法，可以绘制简单的 2D 图形，比如矩形、弧线和路径。 2D 上下文的坐标开始于< canvas >元素的左上角，原点坐标是(0,0)。所有坐标值都基于这个原点计算， x 值越大表示越靠右， y 值越大表示越靠下。默认情况下， width 和 height 表示水平和垂直两个方向上可用的像素数目。

### 填充和描边

2D 上下文的两种基本绘图操作是填充和描边：

> 这两个属性的值可以是字符串、渐变对象或模式对象，而且它们的默认值都是"#000000"。

- fillStyle：填充，就是用指定的样式（颜色、渐变或图像）填充图形；
- strokeStyle：描边，就是只在图形的边缘画线；

可以使用 CSS 中指定颜色值的任何格式为它们指定表示颜色的字符串值，包括颜色名、十六进制码、rgb、 rgba、 hsl 或 hsla：

    var drawing = document.getElementById("drawing");

    //确定浏览器支持<canvas>元素
    if (drawing.getContext){
        var context = drawing.getContext("2d");
        context.strokeStyle = "red";
        context.fillStyle = "#0000ff";
    }

### 绘制矩形

第一步：用 fillStyle / strokeStyle 指定矩形的 填充 / 描边 颜色：

        context.fillStyle = '#ff0000';

        context.strokeStyle = 'rgba(0, 0, 255, 0.5)';

第二步：用 fillRect(x, y, width, height) / strokeRect(x, y, width, height) 方法 填充 / 描边 矩形：

    context.fillRect(10, 10, 50, 50);

    context.strokeRect(10, 10, 50, 50);

第三步：可用 clearRect(x, y, width, height) 方法清除画布上的矩形区域：

    context.clearRect(40, 40, 10, 10);

| 矩形的属性     | 说明                                      |
|-----------|-----------------------------------------|
| lineWidth | 线条的宽度，可以是任意整数。                          |
| lineCap   | 线条末端的形状是平头（butt）、圆头（round）还是方头（square）。 |
| lineJoin  | 线条相交的方式是圆交（round）、斜交（bevel）还是斜接（miter）。 |

### 绘制路径

第一步：调用 beginPath() 方法，表示要开始绘制新路径。

第二步：通过调用下列方法来实际地绘制路径：

- arc(x, y, radius, startAngle, endAngle, counterclockwise)：以(x,y)为圆心绘制一条弧线，弧线半径为 radius，起始和结束角度（用弧度表示）分别为 startAngle 和 endAngle。最后一个参数表示 startAngle 和 endAngle 是否按逆时针方向计算，值为 false 表示按顺时针方向计算。
- arcTo(x1, y1, x2, y2, radius)：从上一点开始绘制一条弧线，到(x2,y2)为止，并且以给定的半径 radius 穿过(x1,y1)。
- bezierCurveTo(c1x, c1y, c2x, c2y, x, y)：从上一点开始绘制一条曲线，到(x,y)为止，并且以(c1x,c1y)和(c2x,c2y)为控制点。
- lineTo(x, y)：从上一点开始绘制一条直线，到(x,y)为止。
- moveTo(x, y)：将绘图游标移动到(x,y)，不画线。
- quadraticCurveTo(cx, cy, x, y)：从上一点开始绘制一条二次曲线，到(x,y)为止，并且以(cx,cy)作为控制点。
- rect(x, y, width, height)：从点(x,y)开始绘制一个矩形，宽度和高度分别由 width 和height 指定。这个方法绘制的是矩形路径，而不是 strokeRect()和 fillRect()所绘制的独立的形状。

第三步：有几种可能的选择：

- 调用 closePath()：绘制一条连接到路径起点的线条；
- 调用 fill()：路径已经完成，你想用 fillStyle 填充它；
- 调用 stroke()：对路径描边，描边使用的是 strokeStyle；
- 调用 clip()：这个方法可以在路径上创建一个剪切区域；

### 绘制文本

第一步：指定字体的样式：

- font：表示文本样式、大小及字体，用 CSS 中指定字体的格式来指定，例如"10px Arial"；
- textAlign：表示文本对齐方式。可能的值有"start"、"end"、"center"、"left"、"right"。建议使用"start"和"end"；
- textBaseLine：表示文本的基线。可能的值有"top"、"hanging"、"middle"、"alphabetic"、"ideographic"和"bottom"；

> 这几个属性都有默认值，因此没有必要每次使用它们都重新设置一遍值。

    context.font = "bold 14px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

第二步：调用 fillText(text, x, y, maxPixelWidth?) / strokeText(text, x, y, maxPixelWidth?) 方法：

> 使用 fillStyle / strokeStyle 指定文字颜色。

    context.fillText("12", 100, 20);

    context.strokeText('12', 100, 20);

### 变换

可以通过如下方法来修改变换矩阵：

- rotate(angle)：围绕原点旋转图像 angle 弧度。
- scale(scaleX, scaleY)：缩放图像，在 x 方向乘以 scaleX，在 y 方向乘以 scaleY。 scaleX 和 scaleY 的默认值都是 1.0。
- translate(x, y)：将坐标原点移动到(x,y)。执行这个变换之后， 坐标(0,0)会变成之前由(x,y)表示的点。
- transform(m1_1, m1_2, m2_1, m2_2, dx, dy)：直接修改变换矩阵，方式是乘以如下矩阵：

        m1_1 m1_2 dx
        m2_1 m2_2 dy
        0    0    1

- setTransform(m1\_1, m1\_2, m2\_1, m2\_2, dx, dy)：将变换矩阵重置为默认状态，然后再调用 transform()。

### 绘制图像

调用 drawImage() 方法可把一幅图像绘制到画布上。

调用这个方法时，可以使用三种不同的参数组合：

- 传入一个 HTML < img > 元素，以及绘制该图像的起点的 x 和 y 坐标：

        var image = document.images[0];
        context.drawImage(image, 10, 10, 目标宽度?, 目标高度?);


- 选择把图像中的某个区域绘制到上下文中。 drawImage()方法的这种调用方式总共需要传入 9 个参数：要绘制的图像、源图像的 x 坐标、源图像的 y 坐标、源图像的宽度、源图像的高度、目标图像的 x 坐标、目标图像的 y 坐标、目标图像的宽度、目标图像的高度:

        context.drawImage(image, 0, 10, 50, 50, 0, 100, 40, 60);

- 可传入另一个< canvas >元素作为其第一个参数。这样，就可以把另一个画布内容绘制到当前画布上。

### 阴影

