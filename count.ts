import { filter } from 'rxjs/operators';
import { fromEvent, Subject } from "rxjs";

let start = document.getElementById('start');
let count = document.getElementById('count');
let error = document.getElementById('error');
let complete = document.getElementById('complete');

let now_status = document.getElementById('now_status');
let now_count = document.getElementById('now_count');
let even_count = document.getElementById('even_count')

var qty = 0;
var setting: Subject<any>;

fromEvent(start, 'click')
    .subscribe(() => {
        now_status.innerHTML = `目前狀態：開始計數`;
        qty = 0;

        //new 在這邊 因如果完成或失敗後 這個Subject已失效
        setting = new Subject();
        setting.subscribe(() => {
            now_count.innerHTML = `目前計數：${qty}`;
            even_count.innerHTML = `偶數計數：${qty % 2 === 0 ? '' : qty}`;
        }, (message) => {
            now_status.innerHTML = `目前狀態：錯誤 -> ${message}`
        }, () => {
            now_status.innerHTML = '目前狀態：完成';
        });

        setting.next();
    });
//判斷是否為開始計數
let started = filter(() => now_status.innerHTML === '目前狀態：開始計數')

fromEvent(count, 'click')
    .pipe(started)
    .subscribe(() => {
        qty += 1;
        setting.next();
    });

fromEvent(error, 'click')
    .pipe(started)
    .subscribe(() => {
        const reason = prompt('請輸入錯誤訊息');
        setting.error(reason || 'error');
    });

fromEvent(complete, 'click')
    .pipe(started)
    .subscribe(() => {
        setting.complete();
    });