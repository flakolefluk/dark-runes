
declare global {
    function $state<T>(value:T): T;
    function $states<A,B,C,D,E,F>(a:A,b?:B,c?:C,d?:D,e?:E,f?:F): [A,B,C,D,E,F];
    function $log(value:any): void;
}
export {};