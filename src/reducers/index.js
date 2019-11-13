import { combineReducers } from 'redux';
import * as appearanceReducer from './appearance';
import * as authReducer from './auth';
import * as campaignReducer from './campaign';
import * as supplierStaticReducer from './supplier_static';
import * as checklistReducer from './checklist';
import * as inventoryReducer from './inventory';
import * as supplierReducer from './Supplier/supplier';
import * as supplierTypeReducer from './Supplier/supplierType';
import * as baseSupplierTypeReducer from './Supplier/baseSupplierType';
import * as settingReducer from './setting';
import * as userReducer from './user';
import * as userProfileReducer from './userProfile';
import * as leadReducer from './lead';
import * as bookingReducer from './booking';
import * as phaseReducer from './phase';
import * as locationReducer from './location';
import { reducer as toastrReducer } from 'react-redux-toastr';

const reducers = combineReducers(
  Object.assign(
    {},
    { toastr: toastrReducer },
    appearanceReducer,
    authReducer,
    campaignReducer,
    supplierStaticReducer,
    checklistReducer,
    supplierReducer,
    supplierTypeReducer,
    baseSupplierTypeReducer,
    settingReducer,
    userReducer,
    leadReducer,
    inventoryReducer,
    userProfileReducer,
    leadReducer,
    bookingReducer,
    phaseReducer,
    locationReducer
  )
);

export default reducers;
