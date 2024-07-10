/**
To migrate from legacy decorators to modern decorators, perform the following steps:
Disable / remove the experimentalDecorators flag from your TypeScript configuration (or Babel equivalent)
Remove all makeObservable(this) calls from class constructors that use decorators.
Replace all instances of @observable (and variations) with @observable accessor
 */

import {action, computed, makeObservable, observable} from 'mobx'

class Count {
  @observable count = 0

  constructor() {
    makeObservable(this)
  }
  @action
  setCount(num: number) {
    this.count = num
  }
}
export const countStore = new Count()

class Todo {
  id = Math.random()
  @observable title = ''
  @observable finished = false

  constructor() {
    makeObservable(this)
  }

  @action
  toggle() {
    this.finished = !this.finished
  }
}
export const todoStore = new Todo()

class TodoList {
  @observable todos: Todo[] = []

  @action
  setFullData(d: Todo[]) {
    this.todos = d
  }
  addData(d: Todo) {
    this.todos.unshift(d)
  }

  @computed
  get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length
  }

  constructor() {
    makeObservable(this)
  }
}

export const todoListStore = new TodoList()
