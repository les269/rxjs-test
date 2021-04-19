import { concatMap, distinct, distinctUntilChanged, findIndex, skipUntil } from 'rxjs/operators';
import { toArray } from 'rxjs/operators';
import { from, fromEvent, of, OperatorFunction } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { array } from './data';

const filterByKey = (data) => from(data).pipe(
    distinct((value: any) => value.key));
// const filterByKey = (data) => from(data).pipe(
//     filter((value: any, index) =>
//         data.findIndex(x => x.key === value.key && x.path !== value.path) > -1)
// );


of(array).pipe(
    concatMap((v) => filterByKey(v)),
    toArray()
).subscribe(res => {
    console.log(res)
})
