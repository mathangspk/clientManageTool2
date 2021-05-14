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
export const API_ENDPOINT = 'http://localhost:4000';
//export const API_ENDPOINT = 'http://128.199.82.173:4000';

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
    name: 'Trang quản trị',
    exact: true,
    component: AdminHomePage,
    form: null,
    onlyAdmin: false,
    iconSidebar : SupervisorAccountIcon,
    isHide: true
  },
  {
    path: '/',
    name: 'Trang chủ',
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
    name: 'Quản lý Work Order',
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
    name: 'Thay đổi CHTT',
    exact: false,
    component: Changechtts,
    form: CchttForm,
    onlyAdmin: false,
    labelButtonAdd: 'Phiếu Đổi CHTT',
    iconSidebar : SwapHorizontalCircleIcon,
    isExport: true
  },
  {
    path: '/admin/cgsat',
    params: [":cgsatId?"],
    name: 'Thay đổi GSAT',
    exact: false,
    component: Changegsats,
    form: CgsatForm,
    onlyAdmin: false,
    labelButtonAdd: 'Phiếu Đổi GSAT',
    iconSidebar : SwapHorizontalCircleIcon,
    isExport: true
  },
  {
    path: '/admin/bbdgkt',
    params: [":bbdgktId?"],
    name: 'Biên bản ĐGKT',
    exact: false,
    component: Bbdgkts,
    form: BbdgktForm,
    onlyAdmin: false,
    labelButtonAdd: 'Biên bản ĐGKT',
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
    name: 'Chi tiết Work Order',
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
    name: 'Chi tiết thay đổi chỉ huy trực tiếp',
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
    name: 'Chi tiết thay đổi giám sát an toàn',
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
    name: 'Chi tiết Biên Bản ĐGKT',
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
    name: 'Chi tiết Biện pháp thi công & JSA',
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
    name: 'Quản lý dụng cụ',
    exact: false,
    component: Tools,
    form: ToolForm,
    onlyAdmin: false,
    labelButtonAdd: 'CÔNG CỤ',
    iconSidebar : BuildIcon,
    isExport: true
  },
  {
    path: '/admin/customer',
    name: 'Quản lý người dùng',
    exact: false,
    component: Customers,
    form: CustomerForm,
    onlyAdmin: true,
    labelButtonAdd: 'NGƯỜI DÙNG',
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