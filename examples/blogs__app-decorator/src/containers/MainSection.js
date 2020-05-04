import { connect } from 'react-redux'
import * as TodoActions from '../actions'
import { bindActionCreators } from 'redux'
import MainSection from '../components/MainSection.jsx'
import { getCompletedTodoCount } from '../selectors'

const mapStateToProps = (state) => {
  return {
    todosCount: state.todos.length,
    completedCount: getCompletedTodoCount(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TodoActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainSection)
