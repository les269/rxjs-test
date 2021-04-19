// TODO: 設定讓外部使用 todo-store 的程式可以使用哪些內容
import { shareReplay } from "rxjs/operators";
import { store$ as storeSubject$ } from "./todo-store";


export const store$ = storeSubject$.asObservable().pipe(shareReplay(1));


export * from './todo-actions';
export * from './todo-dispatch';
