/**
 * Created by huangw1 on 2018/6/27.
 */

const queue = new Set();

const nextTick = (fn) => {
    Promise.resolve().then(fn);
}

const flushQueue = () => {
    for(let observer of queue) {
        observer.update();
    }
}

/**
 * 异步执行队列
 * @param observers
 */
export const enqueue = (observers) => {
    if(!queue.size) {
        nextTick(flushQueue);
    }
    observers.forEach((observer) => {
        queue.add(observer);
    });
}

