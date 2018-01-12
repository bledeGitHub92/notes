## Promise

社区提供实现，ES6 写进了标准。

Promise 内部抛出的错误不会冒泡到外层。如果没有部署 catch 方法，脚本会报错，但不会终止。

```js
var promise = new Promise((resolve, reject) => {
    if (...) {
        resolve();
    } else {
        reject();
    }
});
```

## 实例方法

`Promise.prototype.then(resolvedFn, rejectedFn?)`

返回一个新的 Promise 实例。

promise 封装的异步操作成功时调用 resolvedFn，失败时调用 rejectedFn。

`Promise.prototype.catch(fn)`

返回一个新的 Promise 实例。

捕获 promise 内部和 then 和 catch 方法抛出的错误。

是 Promise.prototype.then(null, rejection) 的别名。

在 then 方法中指定的回调函数报错也会被 catch 捕获。

## 静态方法

`p = Promise.all([p1, p2, p3, ...])`

Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例 p。

> 如果 p1, p2, p3, ... 没有 catch 方法，才会调用 Promise.all 返回的 promise 的 catch 方法。

p1, p2, p3, ... 状态都发生改变后才会调用包装 p 的 then 方法，此时 p1, p2, p3, ... 的返回值组成一个数组，传递给 p 的回调函数。

`p = Promise.race([p1, p2, p3, ...])`

Promise.race 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例 p。

p1, p2, p3, ... 只要有一个的状态发生改变就会触发 p 的回调函数，率先改变的 promise 实例的返回值，传递给 p 的回调函数。

`Promise.resolve(value)`

把 value 转为 Promise 对象，Promise.resolve方法就起到这个作用。

> Promise.all() 和 Promise.race 的参数数组里的参数如果不是 promise 会调用这个方法转为 promise。

- 参数是一个 promise 实例，直接返回这个 promise。
- 参数是一个具有 then(resolve, reject) 方法的对象，把这个对象转为 promise 对象，然后立即执行 then 方法。
- 参数是一个简单类型数据，返回一个状态为 resolved 的 promise 对象，回调函数的参数就是 Promise.resolve() 的参数。
- 不带任何参数，直接返回一个状态为 resolved 的参数。

`Promise.reject(reason)`

Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。

Promise.reject(reason)方法的参数，直接变成后续方法的参数。

`Promise.try()`

实际开发需求：不知道或者不想区分，函数f是同步函数还是异步操作，但是想用 Promise 来处理它。

因为这样就可以不管 f 是否包含异步操作，都用 then 方法指定下一步流程，用 catch 方法处理f抛出的错误。

```js
Promise.try(database.users.get({id: userId}))
    .then(...)
    .catch(...)
```

## 需要自己部署的附加方法

`Promise.prototype.done()`

Promise 对象的回调链，不管以then方法或catch方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到（因为 Promise 内部的错误不会冒泡到全局）。

```js
Promise.prototype.done = function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected)
    .catch(function (reason) {
      // 抛出一个全局错误
      setTimeout(() => { throw reason }, 0);
    });
};
```

`Promise.prototype.finally()`

finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```