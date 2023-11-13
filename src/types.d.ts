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
}

export declare function processDarkRunes(opts?: any): void
// TODO: fix type
export declare function darkRunes(): any

export { };
