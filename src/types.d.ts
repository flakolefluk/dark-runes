import { Plugin } from 'vite'
declare global {
	function $state<T>(value: T): T;
	function $states<T extends any[]>(...values: T): T

	function $log(...args: any[]): void;

	function $gsp<G>(getObj: G): Readonly<G>
	function $gsp<G, S>(getObj: G, setObj: S): Omit<Readonly<G>, keyof S> & S
	function $gsp<G, S, P>(getObj: G, setObj: S, propObj: P): Omit<Readonly<G>, keyof S | keyof P> & Omit<S, keyof P> & P

	function $get<T>(getObj: T): Readonly<T>;
	function $set<T>(setObj: T): T;
	function $getset<T>(getsetObj: T): T;
}

export declare function processDarkRunes(opts: any): void
export declare function darkRunes(): Plugin

export { };
