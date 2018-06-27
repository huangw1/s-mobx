/**
 * Created by huangw1 on 2018/6/27.
 */

import { observable, observe, computed } from '../src';

describe('observable test', () => {

    test('object from class', (done) => {
        @observable
        class Lib {
            name = 'mobX';
            lib = 'react';


            @computed
            get fullName() {
                return `${this.name} for ${this.lib}`;
            }

            setLib(lib) {
                this.lib = lib;
            }

            setName(name) {
                this.name = name;
            }

            set(name, lib) {
                this.setName(name);
                this.setLib(lib);
            }
        }

        const lib = new Lib();
        let time = 0;
        observe(() => {
            time += 1;
            lib.fullName;
        });
        lib.set('name and age', 20);
        Promise.resolve().then(() => {
            expect(time).toBe(2);
            done();
        });
    });
});