import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link.jsx'

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setFilter: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)
