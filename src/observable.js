
import mobX from './mobx';
import computed from './computed';
import { enqueue } from './queue';
import { isPrimitive, isFunction, isObject, isComputed } from './utils'

function getter(target, key, receiver) {
    const descriptor = isComputed(target, key);
    if(descriptor && !mobX.computeds.has(descriptor)) {
        const descWrapper = computed(target, key, descriptor)
        Reflect.defineProperty(target, key, descWrapper);
        mobX.computeds.add(descWrapper);
        return Reflect.get(target, key, receiver);
    }
    let value = Reflect.get(target, key, receiver);
    if(isFunction(value)) {
        return value;
    }
    if(isObject(value)) {
        value = toObservable(value);
    }
    if(mobX.currentObserver) {
        const observers = mobX.getObservers(target, key);
        observers.add(mobX.currentObserver);
        mobX.currentObserver.bindObservers.add(observers);
    }
    return value;
}

function setter(target, key, value, receiver) {
    const oldValue = Reflect.get(target, key, receiver);
    // 不是数组不需拦截 length
    if (oldValue === value && !Array.isArray(target)){
        return true;
    }
    Reflect.set(target, key, value, receiver);

    const observers = mobX.getObservers(target, key);
    // 若为数组，length 发生变化，触发 observers
    if(Array.isArray(Reflect.get(target, key))) {
        const subObservers = mobX.getObservers(Reflect.get(target, key), 'length');
        observers.forEach((observer) => {
            subObservers.add(observer);
        })
    }
    enqueue(observers);
    return true;
}

function deleter(target, key) {
    const res = Reflect.deleteProperty(target, key);
    const observers = mobX.getObservers(target, key);
    enqueue(observers);
    return res;
}

export function toObservable(store) {
	if(isPrimitive(store) || mobX.isProxy(store)) {
		return store;
	};
	if(mobX.isObservable(store)) {
		return mobX.dataToProxy.get(store);
	};
	const proxy = new Proxy(store, {
		get: getter,
        set: setter,
        deleteProperty: deleter
	});
    mobX.proxies.add(proxy);
    mobX.dataToProxy.set(store, proxy);
    return proxy;
}

function observable(target) {
	if(isFunction(target)) {
		return new Proxy(target, {
            construct(Cls, ...params) {
				const ob = new Cls(...params);
				const proxy = toObservable(ob);
				ob.$proxy = proxy;
				return proxy;
			}
		})
	}
	return toObservable(target)
}

export default observable;