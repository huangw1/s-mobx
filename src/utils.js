/**
 * 是否是方法
 * @param {any} fn
 */
const type = (o) => Object.prototype.toString.call(o).match(/\[object\s+(.*)\]/)[1].toLowerCase();
export const isString = (str) => type(str) === 'string';
export const isNumber = (str) => type(str) === 'number';
export const isBoolean = (str) => type(str) === 'boolean';
export const isDate = (str) => type(str) === 'date';
export const isFunction = (str) => type(str) === 'function';
export const isObject = (str) => type(str) === 'object';

/**
 * 基本类型
 * @param {*any} value
 */
export function isPrimitive(value) {
    if(value === null || value === undefined) {
        return true;
    }

    if(isString(value) || isNumber(value) || isBoolean(value) || isDate(value)) {
        return true;
    }

    return false;
}

/**
 * [isComputed description]
 * @param  {[type]}  target [description]
 * @param  {[type]}  key    [description]
 * @return {Boolean}        [description]
 */
export function isComputed(target, key) {
    const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
    if (descriptor && descriptor.get) {
        return descriptor;
    }
    return false;
}
















