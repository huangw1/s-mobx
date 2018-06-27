/**
 * Created by huangw1 on 2018/6/26.
 */

import mobX from './mobx'

class Observer {

    constructor(callback) {
        this.callback = callback;
    }

    // 维护包含自身的 observers 以便后期移除
    bindObservers = new Set();

    beginCollectDep() {
        mobX.currentObserver = this;
    }

    collectDep(fn) {
        this.beginCollectDep();
        const res = fn();
        this.endCollectDep();
        return res;
    }

    endCollectDep() {
        mobX.currentObserver = null;
    }

    clearDep() {
        this.bindObservers.forEach((observers) => {
            observers.delete(this);
        })
    }

    update() {
        this.callback && this.callback();
    }
}

const observe = function (fn) {
    const observer = new Observer(fn);
    observer.collectDep(fn);
}

export default observe;








