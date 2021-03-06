import AdminHomePage from '../containers/AdminHomePage';
import Taskboard from '../containers/Taskboard';
import LoginPage from '../containers/LoginPage';
import SignupPage from '../containers/SignupPage';
import PageNotFound from '../containers/PageNotFound';

import Orders from '../containers/Orders';
import OrderDetail from '../containers/OrderDetail';
import OrderForm from '../containers/OrderForm';

import Changechtts from '../containers/Changechtts';
import CchttDetail from '../containers/CchttDetail';
import CchttForm from '../containers/CchttForm';

import Changegsats from '../containers/Changegsats';
import CgsatDetail from '../containers/CgsatDetail';
import CgsatForm from '../containers/CgsatForm';

import Bbdgkts from '../containers/Bbdgkts';
import BbdgktDetail from '../containers/BbdgktDetail';
import BbdgktForm from '../containers/BbdgktForm';

import Thongkes from '../containers/ThongKes';

import Bptcs from '../containers/Bptcs';

import BptcDetail from '../containers/BptcDetail';
import BptcForm from '../containers/BptcForm';

import Tools from '../containers/Tools';
import ToolForm from '../containers/ToolForm';

import Customers from '../containers/Customers';
import CustomerForm from '../containers/CustomerForm';

import BallotIcon from '@material-ui/icons/Ballot';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PagesIcon from '@material-ui/icons/Pages';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import DateRangeIcon from '@material-ui/icons/DateRange';
import WorkIcon from '@material-ui/icons/Work';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import FaceIcon from '@material-ui/icons/Face';
import DescriptionIcon from '@material-ui/icons/Description';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import BuildIcon from '@material-ui/icons/Build';
//export const API_ENDPOINT = 'https://api.yensaochampa.icu';
//export const API_ENDPOINT = 'http://localhost:4001';
export const API_ENDPOINT = 'http://128.199.82.173:4001';

export const STATUSES = [
  {
    value: 0,
    label: 'READY',
  },
  {
    value: 1,
    label: 'IN PROGRESS',
  },
  {
    value: 2,
    label: 'COMPLETE',
  },
];

export const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  UPDATED: 202,
};

export const ADMIN_ROUTES = [
  {
    path: '/admin',
    name: 'Trang qu???n tr???',
    exact: true,
    component: AdminHomePage,
    form: null,
    onlyAdmin: false,
    iconSidebar : SupervisorAccountIcon,
    isHide: true
  },
  {
    path: '/',
    name: 'Trang ch???',
    exact: true,
    component: AdminHomePage,
    form: null,
    onlyAdmin: false,
    iconSidebar : PagesIcon,
    isHide: true
  },
  {
    path: '/admin/order',
    params: [":orderId?"],
    name: 'Qu???n l?? Work Order',
    exact: false,
    component: Orders,
    form: OrderForm,
    onlyAdmin: false,
    labelButtonAdd: 'WORK ORDER',
    iconSidebar : WorkIcon,
    isExport: true
  },
  {
    path: '/admin/cchtt',
    params: [":cchttId?"],
    name: 'Thay ?????i CHTT',
    exact: false,
    component: Changechtts,
    form: CchttForm,
    onlyAdmin: false,
    labelButtonAdd: 'Phi???u ?????i CHTT',
    iconSidebar : SwapHorizontalCircleIcon,
    isExport: true
  },
  {
    path: '/admin/cgsat',
    params: [":cgsatId?"],
    name: 'Thay ?????i GSAT',
    exact: false,
    component: Changegsats,
    form: CgsatForm,
    onlyAdmin: false,
    labelButtonAdd: 'Phi???u ?????i GSAT',
    iconSidebar : SwapHorizontalCircleIcon,
    isExport: true
  },
  {
    path: '/admin/bbdgkt',
    params: [":bbdgktId?"],
    name: 'Bi??n b???n ??GKT',
    exact: false,
    component: Bbdgkts,
    form: BbdgktForm,
    onlyAdmin: false,
    labelButtonAdd: 'Bi??n b???n ??GKT',
    iconSidebar : DescriptionIcon,
    isExport: true
  },
  {
    path: '/admin/bptc',
    params: [":bptcId?"],
    name: 'BPTC & JSA',
    exact: false,
    component: Bptcs,
    form: BptcForm,
    onlyAdmin: false,
    labelButtonAdd: 'BPTC & JSA',
    iconSidebar : MenuBookIcon,
    isExport: true
  },
  {
    path: '/admin/order-detail',
    params: [":orderId"],
    name: 'Chi ti???t Work Order',
    exact: false,
    component: OrderDetail,
    form: OrderForm,
    onlyAdmin: false,
    iconSidebar : ChromeReaderModeIcon,
    isHide: true
  },
  {
    path: '/admin/cchtt-detail',
    params: [":cchttId"],
    name: 'Chi ti???t thay ?????i ch??? huy tr???c ti???p',
    exact: false,
    component: CchttDetail,
    form: CchttForm,
    onlyAdmin: false,
    iconSidebar : ChromeReaderModeIcon,
    isHide: true
  },
  {
    path: '/admin/cgsat-detail',
    params: [":cgsatId"],
    name: 'Chi ti???t thay ?????i gi??m s??t an to??n',
    exact: false,
    component: CgsatDetail,
    form: CgsatForm,
    onlyAdmin: false,
    iconSidebar : ChromeReaderModeIcon,
    isHide: true
  },
  {
    path: '/admin/bbdgkt-detail',
    params: [":bbdgktId"],
    name: 'Chi ti???t Bi??n B???n ??GKT',
    exact: false,
    component: BbdgktDetail,
    form: BbdgktForm,
    onlyAdmin: false,
    iconSidebar : ChromeReaderModeIcon,
    isHide: true
  },
  {
    path: '/admin/bptc-detail',
    params: [":bptcId"],
    name: 'Chi ti???t Bi???n ph??p thi c??ng & JSA',
    exact: false,
    component: BptcDetail,
    form: BptcForm,
    onlyAdmin: false,
    iconSidebar : ChromeReaderModeIcon,
    isHide: true
  },
  {
    path: '/admin/tool',
    params: [":orderId?"],
    name: 'Qu???n l?? d???ng c???',
    exact: false,
    component: Tools,
    form: ToolForm,
    onlyAdmin: false,
    labelButtonAdd: 'C??NG C???',
    iconSidebar : BuildIcon,
    isExport: true
  },
  {
    path: '/admin/customer',
    name: 'Qu???n l?? ng?????i d??ng',
    exact: false,
    component: Customers,
    form: CustomerForm,
    onlyAdmin: true,
    labelButtonAdd: 'NG?????I D??NG',
    iconSidebar : FaceIcon,
  },
  {
    path: '/admin/thongke',
    name: 'Dash Board',
    exact: false,
    component: Thongkes,
    onlyAdmin: false,
    labelButtonAdd: 'DASHBOARD',
    iconSidebar : FaceIcon,
  },
];

export const ROUTES = [
  {
    name: 'Dang nhap',
    path: '/login',
    exact: true,
    component: LoginPage,
  },
  {
    name: 'Dang ky',
    path: '/signup',
    exact: true,
    component: SignupPage,
  },
  {
    name: 'Page Not Found',
    path: '',
    exact: false,
    component: PageNotFound,
  }
]

export const limitSizeImage = 10000000;