## Reflect

Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API。

## 设计目的

将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。

修改某些Object方法的返回结果，让其变得更合理。

> Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。

让Object操作都变成函数行为。

> 某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。

Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。

> 这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

## 静态方法

`Reflect.get(target, name, receiver)`

Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。

如果name属性部署了读取函数（getter），则读取函数的this绑定receiver。

`Reflect.set(target, name, value, receiver)`

Reflect.set方法设置target对象的name属性等于value。

如果name属性设置了赋值函数，则赋值函数的this绑定receiver。

`Reflect.has(target, name)`

Reflect.has方法对应name in obj里面的in运算符。

`Reflect.deleteProperty(target, name)`

Reflect.deleteProperty方法等同于delete obj[name]，用于删除对象的属性。

该方法返回一个布尔值。如果删除成功，或者被删除的属性不存在，返回true；删除失败，被删除的属性依然存在，返回false。

`Reflect.construct(target, args)`

Reflect.construct方法等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法。

`Reflect.getPrototypeOf(target)`

Reflect.getPrototypeOf方法用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。

`Reflect.setPrototypeOf(target, prototype)`

Reflect.setPrototypeOf方法用于设置对象的__proto__属性，返回第一个参数对象，对应Object.setPrototypeOf(obj, newProto)。

`Reflect.apply(target, ctx, args)`

Reflect.apply方法等同于Function.prototype.apply.call(func, ctx, args)，用于绑定this对象后执行给定函数。

`Reflect.defineProperty(target, name, desc)`

Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它。

`Reflect.getOwnPropertyDescriptor(target, name)`

Reflect.getOwnPropertyDescriptor基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代掉后者。

`Reflect.isExtensible(target)`

Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。

`Reflect.preventExtensions(target)`

Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

`Reflect.ownKeys(target)`

Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。

