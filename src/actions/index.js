import * as AppearanceActions from './appearance';
import * as AuthActions from './auth';
import * as ChecklistActions from './checklist';
import * as CampaignActions from './campaign';
import * as SupplierStaticActions from './supplier_static';
import * as SupplierActions from './Supplier/supplier';
import * as SupplierTypeActions from './Supplier/supplierType';
import * as BaseSupplierTypeActions from './Supplier/baseSupplierType';
import * as InventoryActions from './inventory';
import * as SettingActions from './setting';
import * as UserActions from './user';
import * as UserProfileActions from './userProfile';
import * as LeadActions from './lead';
import * as BookingActions from './booking';
import * as PhaseActions from './phase';
import * as LocationActions from './location';

export default Object.assign(
  {},
  AppearanceActions,
  AuthActions,
  ChecklistActions,
  CampaignActions,
  SupplierActions,
  SupplierStaticActions,
  SupplierTypeActions,
  BaseSupplierTypeActions,
  InventoryActions,
  SettingActions,
  UserActions,
  UserProfileActions,
  LeadActions,
  BookingActions,
  PhaseActions,
  LocationActions
);
