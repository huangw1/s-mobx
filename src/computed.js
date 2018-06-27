/**
 * Created by huangw1 on 2018/6/26.
 */

import mobX from './mobx';
import { enqueue } from './queue';
import observe from './observe';

export default function computed(target, key, descriptor) {
    let originalGet = descriptor.get;
    let isFirst = true;
    let preValue;
    let observer;
    let observers = new Set();

    function getter() {
        // computed 被依赖的
        if(mobX.currentObserver) {
            observers.add(mobX.currentObserver);
            mobX.currentObserver.bindObservers.add(observers);
        }

        if(isFirst) {
            originalGet = originalGet.bind(this);
            function reComputed() {
                preValue = originalGet();
                enqueue(observers);
            }
            // computed 所依赖的
            observer = observe(() => {
                reComputed();
            });
            isFirst = false;
        }
        return preValue;
    }
    descriptor.get = getter;
    return descriptor;
}