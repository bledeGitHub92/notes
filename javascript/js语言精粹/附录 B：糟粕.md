## ==

不要使用 ==，== 会把运算数强制转化为相同的类型。

## with 语句

本意是想用它快捷的访问对象的属性。但它的结果有时不可预料，避免使用。

下面的语句：

    with (obj) {
        a = b;
    }

和下面的代码做的是同样的事：

    if (obj.a === undefined) {
        a = object.b === undefined ? b : obj.b;
    } else {
        obj.a = obj.b === undefined ? b : obj.b;
    }

所以它等于这些语句中的某一句：

    a = b;
    a = obj.b;
    obj.a = b;
    obj.a = obj.b;

## eval

会造成安全问题。降低性能。

 浏览器提供的 setTimeout 函数接受字符串参数时跟 eval 一样。