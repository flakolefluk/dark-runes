declare global {
	function $states<T extends any[]>(...values: T): T

	function $log(...args: any[]): void;

	function $gsp<Getters>(getObj: Getters): Readonly<Getters>
	function $gsp<Getters, Setters>(getObj: Getters, setObj: Setters): Omit<Readonly<Getters>, keyof Setters> & Setters
	function $gsp<Getters, Setters, Properties>(getObj: Getters, setObj: Setters, propObj: Properties): Omit<Readonly<Getters>, keyof Setters | keyof Properties> & Omit<Setters, keyof Properties> & Properties

	function $wrap<Writables>(writablesObj: Writables): Writables
	function $wrap<Writables, Readables>(writablesObj: Writables, readablesObj: Readables): Omit<Readonly<Readables>, keyof Writables> & Writables
	function $wrap<Writables, Readables, Properties>(writablesObj: Writables, readablesObj: Readables, propObj: Properties): Omit<Readonly<Readables>, keyof Writables | keyof Properties> & Omit<Writables, keyof Properties> & Properties

	function $get<T>(getObj: T): Readonly<T>;
	function $set<T>(setObj: T): T;
	function $getset<T>(getsetObj: T): T;

	/**
 	* 
	* $fx rune
	* compiles to:
	* $effect(() => { (fn)(...args) })
	* 
	*
 	* @param fn The function to call inside an $effect
 	* @param args The arguments of the function
 	*/
	function $fx(fn, ...args:any[]): void

	/**
 	* 
	* $devfx rune
	* compiles (ONLY IN DEV mode) to:
	* $effect(() => { (fn)(...args) });
	* 
	* NOTE: $devfx will be removed in production
	*
 	* @param fn The function to call inside an $effect
 	* @param args The arguments of the function
 	*/
	function $devfx(fn, ...args:any[]): void

	/**
 	* 
	* $computed
	* Alternative to $derived that allows
	* using a function expression as argument.
	* The output will be converted to an IIFE argument for $derived
	*
	* @example
	* `let foo = $computed(() => { return bar; })`
	* compiles to:	
	* `let foo = $derived((() => { return bar; })())`
	*
 	* @param expression The expression to be derived
	* @returns derived value
 	*/
	function $computed<T>(exp: () => T): T

}

export declare function processDarkRunes(opts?: Record<string, any>): void
// TODO: fix type
export declare function darkRunes(opts?: Record<string, any>): any

export { };
