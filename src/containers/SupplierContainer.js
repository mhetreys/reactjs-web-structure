import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActionCreators from '../actions';

import Supplier from './../components/Supplier';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return state;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Supplier);
