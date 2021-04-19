import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import * as domUtils from './dom-utils';
import {
  store$,
  loadTodoItemsAction,
  addTodoItemAction,
  toggleTodoItemAction,
  todoDispatcher
} from './todo-store';



// 當 TodoItem 被建立後，針對每個 TodoItem 處理相關事件
const initTodoItemEvents = () => {
  const toggleTodoItemElements = document.querySelectorAll(
    '#todoList input[type=checkbox]'
  );
  if (toggleTodoItemElements.length === 0) {
    return;
  }

  fromEvent(toggleTodoItemElements, 'click').subscribe((event: Event) => {
    // checkbox 點擊後，分配 toggleTodoItemAction
    todoDispatcher(
      toggleTodoItemAction((event.target as HTMLInputElement).value)
    );
  });
};

// 初始化 TodoList 元件行為
// TodoList 元件同時有 Action 分配及訂閱 store$ 資料
const initTodoListComponent = () => {
  // 分配 loadTodoItemsAction，已取得 TodoItems 資料
  todoDispatcher(loadTodoItemsAction());

  // 訂閱 store$ 來得到最新的 todos$ 資料
  store$.pipe(map(store => store.todos)).subscribe(todos => {
    domUtils.updateTodoList(todos);
    initTodoItemEvents();
  });

  /* 從上面程式中可以很容易看出來，更新資料和讀取資料有各自的處理邏輯 */
};

// 初始化 AddTodoItem 元件行為
// AddTodoItem 元件只處理 Action 分配
const initAddTodoItemComponent = () => {
  const addItemButtonElement = document.querySelector('#addTodoButton');
  fromEvent(addItemButtonElement, 'click').subscribe(() => {
    const todoItemElement = document.querySelector(
      '#todoDataText'
    ) as HTMLInputElement;
    const todoItemValue = todoItemElement.value;
    if (todoItemValue) {
      // 分配 addTodoItemAction 來新增 TodoItem
      todoDispatcher(addTodoItemAction(todoItemValue));
    }
    todoItemElement.value = '';
    todoItemElement.focus();
  });
};

// 初始化 TodoInfo 元件行為
// TodoInfo 元件只負責訂閱 store$ 來處理畫面資訊
const initTodoInfoComponent = () => {
  const completedTodos$ = store$.pipe(
    map(store => store.todos.filter(todo => todo.done).length)
  );

  const totalTodos$ = store$.pipe(map(store => store.todos.length));

  completedTodos$.subscribe(completedTodos => {
    domUtils.updateCompleteTodos(completedTodos);
  });

  totalTodos$.subscribe(totalTodos => {
    domUtils.updateTotalTodos(totalTodos);
  });
};

// 初始化 Loading 元件行為
const initLoadingStateComponent = () => {
  const loading$ = store$.pipe(map(store => store.loading));

  loading$.subscribe(loading => {
    domUtils.updateLoadingState(loading);
  });
};

const initApp = () => {
  initAddTodoItemComponent();
  initTodoListComponent();
  initTodoInfoComponent();
  initLoadingStateComponent();
};
initApp();
