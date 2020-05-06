import * as types from '../constants/ActionTypes'
import * as actions from './index'

describe('todo actions', () => {
  it('addTodo should create ADD_TODO action', () => {
    expect(actions.addTodo('Use Redux')).to.deep.equal({
      type: types.ADD_TODO,
      text: 'Use Redux',
    })
  })

  it('deleteTodo should create DELETE_TODO action', () => {
    expect(actions.deleteTodo(1)).to.deep.equal({
      type: types.DELETE_TODO,
      id: 1,
    })
  })

  it('editTodo should create EDIT_TODO action', () => {
    expect(actions.editTodo(1, 'Use Redux everywhere')).to.deep.equal({
      type: types.EDIT_TODO,
      id: 1,
      text: 'Use Redux everywhere',
    })
  })

  it('completeTodo should create COMPLETE_TODO action', () => {
    expect(actions.completeTodo(1)).to.deep.equal({
      type: types.COMPLETE_TODO,
      id: 1,
    })
  })

  it('completeAll should create COMPLETE_ALL action', () => {
    expect(actions.completeAllTodos()).to.deep.equal({
      type: types.COMPLETE_ALL_TODOS,
    })
  })

  it('clearCompleted should create CLEAR_COMPLETED action', () => {
    expect(actions.clearCompleted()).to.deep.equal({
      type: types.CLEAR_COMPLETED,
    })
  })
})
