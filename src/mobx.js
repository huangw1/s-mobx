/**
 * 主类
 */
class Mobx {
	proxies = new WeakSet();
	dataToProxy = new WeakMap();
	dataKeyToObservers = new WeakMap();
    computeds = new WeakSet();

    currentObserver = null;

	isProxy(proxy) {
		return this.proxies.has(proxy);
	}

	isObservable(store) {
		return this.dataToProxy.has(store);
	}

	getObservers(raw, key) {
		let keyToObservers = this.dataKeyToObservers.get(raw);
		if(!keyToObservers) {
			keyToObservers = new Map();
			this.dataKeyToObservers.set(raw, keyToObservers)
		}
		let observers = keyToObservers.get(key);
		if(!observers) {
			observers = new Set();
			keyToObservers.set(key, observers);
		}
		return observers;
	}
}

export default new Mobx();