import { connect } from 'react-redux'
import Header from '../components/Header.jsx'
import { addTodo } from '../actions'

export default connect(null, { addTodo })(Header)
