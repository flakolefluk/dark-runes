
declare global {
    function $state<T>(value: T): T;
    function $states<T extends any[]>(...values: T): T
    function $log(...args: any[]): void;
}
export { };
