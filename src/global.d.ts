
declare global {
    function $state<T>(value: T): T;
    function $states<T extends any[]>(...values: T): T
    function $log(...args: any[]): void;
    function $gsp(...args: any[]): Record<string, any>;
    function $get(...args: any[]): Record<string, any>;
    function $set(...args: any[]): Record<string, any>;
    function $getset(...args: any[]): Record<string, any>;
}
export { };
