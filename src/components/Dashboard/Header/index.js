import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect, } from 'react-redux';
import { withRouter } from 'react-router';

import { withStyles, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Add, GetApp } from '@material-ui/icons';

import * as modalActions from '../../../actions/modal';
import * as orderActions from '../../../actions/orderActions';
import * as cchttActions from '../../../actions/cchttActions';
import * as cgsatActions from '../../../actions/cgsatActions';
import * as bbdgktActions from '../../../actions/bbdgktActions';
import * as bptcActions from '../../../actions/bptcActions';
import * as customerActions from '../../../actions/customerActions';
import * as toolActions from '../../../actions/toolActions';

import styles from './styles';
import CustomerForm from '../../../containers/CustomerForm';
import ExportToolForm from '../../../containers/ExportToolForm';
import { Redirect } from "react-router-dom";
import { getWithToken } from '../../../commons/utils/apiCaller';
import { getToken } from '../../../apis/auth';
import XLSX from 'xlsx';
import moment from 'moment';

const menuId = 'primary-search-account-menu';
const mobileMenuId = 'primary-search-account-menu-mobile';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      redirect: false,
      urlRedirect: ''
    };
  }
  handleProfileMenuOpen = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  handleMyProfile = () => {
    const { customerActionsCreator, modalActionsCreator, user } = this.props;
    const { setCustomerEditing } = customerActionsCreator;
    setCustomerEditing(user);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('S???a th??ng tin c?? nh??n');
    changeModalContent(<CustomerForm />);
  }
  handleLogout = () => {
    const { history, logout } = this.props;
    logout();
    if (history) {
      history.push('/login')
    }
  }
  renderMenu = () => {
    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMyProfile}>Th??ng tin c?? nh??n</MenuItem>
        <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
      </Menu>
    );
  };

  handleToggleSidebar = () => {
    const { showSidebar, onToggleSidebar } = this.props;
    if (onToggleSidebar) {
      onToggleSidebar(!showSidebar)
    }
  }
  openForm = () => {
    const { modalActionsCreator,
      toolActionsCreator,
      customerActionsCreator,
      orderActionsCreator,
      cchttActionsCreator,
      cgsatActionsCreator,
      bbdgktActionsCreator,
      bptcActionsCreator,
      form: FormComponent,
      labelButtonAdd } = this.props;
    const { setToolEditing } = toolActionsCreator;
    setToolEditing(null);
    const { setCustomerEditing } = customerActionsCreator;
    setCustomerEditing(null);
    const { setOrderEditing } = orderActionsCreator;
    setOrderEditing(null);
    const { setCchttEditing } = cchttActionsCreator;
    setCchttEditing(null);
    const { setCgsatEditing } = cgsatActionsCreator;
    setCgsatEditing(null);
    const { setBbdgktEditing } = bbdgktActionsCreator;
    setBbdgktEditing(null);
    const { setBptcEditing } = bptcActionsCreator;
    setBptcEditing(null);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle(`Th??m ${labelButtonAdd}`);
    changeModalContent(<FormComponent />);
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.urlRedirect} />
    }
  }
  onClickGotoUrl = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }

  convertArrayOfObjectsToCSV = (array) => {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(array[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach(item => {
      let ctr = 0;
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }
  generateOrder = (item) => {
    return [item.PCT, item.userId.department, item.location, item.KKS, item.content, moment(item.timeStart).format('DD-MM-YYYY'), moment(item.timeStop).format('DD-MM-YYYY'), item.userId.name, item.WO]
  }
  generateCchtt = (item) => {
    return [item.PCCHTT, item.WO, item.PCT, item.userId.name, moment(item.timeChange).format('HH:mm DD-MM-YYYY'), item.note]
  }
  generateCgsat = (item) => {
    return [item.PCGSAT, item.WO, item.PCT, item.userId.name, moment(item.timeChange).format('HH:mm DD-MM-YYYY'), item.note]
  }
  generateBbdgkt = (item) => {
    return [item.BBDGKT, item.userId.department, item.content, item.WO, moment(item.time).format('DD-MM-YYYY'), item.userId.name]
  }
  generateBptc = (item) => {
    return [item.BPTC, item.JSA, item.content, item.note]
  }
  generateTool = (item) => {
    if (item.woInfo && item.woInfo.length > 0) {
      let woInfo = item.woInfo.filter(wo => wo.status !== 'COMPLETE');
      if (woInfo.length > 0) {
        item.woName = woInfo[0].WO;
        item.userName = woInfo[0].userInfo.name
      }
    }
    let status = ''
    switch (item.status) {
      case 1:
        status = 'READY'
        break;
      case 2:
        status = 'IN USE'
        break;
      case 3:
        status = 'BAD'
        break;
      case 4:
        status = 'LOST'
        break;
      default:

        status = 'READY'
        break;
    }
    return [item.name, item.manufacturer, item.type, item.woName || '', item.userName || '', status]
  }
  handleExport = async () => {
    const { labelButtonAdd, order, tools, cchtt, cgsat, bbdgkt, bptc } = this.props;
    console.log(labelButtonAdd)
    let url = '';
    let params = {};
    let header = [];
    let dataBind = '';
    let genData = null;
    let nameSheet = '';
    switch (labelButtonAdd) {
      case 'WORK ORDER':
        params = JSON.parse(JSON.stringify(order.params));
        delete params.skip;
        delete params.limit;
        header = ["S??? phi???u", "PX th???c hi???n", "?????a ??i???m c??ng t??c", "H??? th???ng/KKS", "N???i dung c??ng t??c", "Ng??y b???t ?????u", "Ng??y k???t th??c", "Nh??m c??ng t??c", "Ghi ch??"];
        genData = this.generateOrder;
        url = 'api/orders/search';
        dataBind = 'data.Data.Row';
        nameSheet = "Work Order";
        break;

      case 'C??NG C???':
        params = JSON.parse(JSON.stringify(tools && tools.params ? tools.params : {}));
        if (tools && tools.params) {
          delete params.skip;
          delete params.limit;
        }
        header = ["T??n c??ng c???", "H??ng", "Lo???i", 'Work Order', "Ng?????i d??ng", "Tr???ng th??i"];
        genData = this.generateTool;
        url = 'api/tools/search';
        dataBind = 'data';
        nameSheet = "Tool"
        break;

      case 'Phi???u ?????i CHTT':
        params = JSON.parse(JSON.stringify(cchtt.params));
        delete params.skip;
        delete params.limit;
        delete params.userId;
        header = ["S??? thay ?????i CHTT", "Work Order", "S??? PCT", 'Ng?????i vi???t phi???u', "Th???i gian thay ?????i", "Ghi ch??"];
        genData = this.generateCchtt;
        url = 'api/cchtts/search';
        dataBind = 'data.Data.Row';
        nameSheet = "ChangeCHTT"
        break;
      case 'Phi???u ?????i GSAT':
        params = JSON.parse(JSON.stringify(cgsat.params));
        delete params.skip;
        delete params.limit;
        delete params.userId;
        header = ["S??? thay ?????i GSAT", "Work Order", "S??? PCT", 'Ng?????i vi???t phi???u', "Th???i gian thay ?????i", "Ghi ch??"];
        genData = this.generateCgsat;
        url = 'api/cgsats/search';
        dataBind = 'data.Data.Row';
        nameSheet = "ChangeGSAT"
        break;
      case 'Bi??n b???n ??GKT':
        params = JSON.parse(JSON.stringify(bbdgkt.params));
        delete params.skip;
        delete params.limit;
        delete params.userId;
        header = ["S??? BBDGKT","Ph??n x?????ng th???c hi???n","N???i dung c??ng t??c", "Work Order", "Ng??y th???c hi???n", "Ghi ch??"];
        genData = this.generateBbdgkt;
        url = 'api/bbdgkts/search';
        dataBind = 'data.Data.Row';
        nameSheet = "BBDGKT"
        console.log(params)
        break;
      case 'BPTC & JSA':
        params = JSON.parse(JSON.stringify(bptc.params));
        delete params.skip;
        delete params.limit;
        delete params.userId;
        header = ["S??? BPTC","S??? JSA","N???i dung c??ng t??c", "Ghi ch??"];
        genData = this.generateBptc;
        url = 'api/bptcs/search';
        dataBind = 'data.Data.Row';
        nameSheet = "BPTC&JSA"
        console.log(params)
        break;

      default:
        break;
    }

    let token = await getToken();
    getWithToken(url, token, { params }).then(res => {
      let path = dataBind.split('.')

      let array = res;
      path.forEach(i => {
        array = array[i];
      })
      console.log(array)
      let users = [];
      users.push(header);
      array.forEach((item) => {
        console.log(item)
        users.push(genData(item));
        console.log(users)
      })
      console.log(users)
      const wb = XLSX.utils.book_new();
      const wsAll = XLSX.utils.aoa_to_sheet(users);
      let cols = []
      for (let i = 0; i < header.length; i++) {
        cols.push({ wch: 15 });
      }
      wsAll['!cols'] = cols
      XLSX.utils.book_append_sheet(wb, wsAll, nameSheet);
      let name = `${nameSheet.replace(/ /g, '')}_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      XLSX.writeFile(wb, name);
    }).catch(err => { return err.response });
  }
  checkPermissionAdd = () => {
    const { labelButtonAdd, user } = this.props;
    if (labelButtonAdd === 'WORK ORDER' && user && !user.admin) return true
    if (labelButtonAdd === 'Phi???u ?????i CHTT' && user && !user.admin) return true
    if (labelButtonAdd === 'Phi???u ?????i GSAT' && user && !user.admin) return true
    if (labelButtonAdd === 'Bi??n b???n ??GKT' && user && !user.admin) return true
    if (labelButtonAdd === 'BPTC & JSA' && user && !user.admin) return true
    return true
  }
  showExportToolType = () => {
    const { labelButtonAdd, user } = this.props;
    if (user && !user.admin) return false;
    if (labelButtonAdd !== 'C??NG C???') return false;
    return true;
  }
  handleExportToolType = () => {
    const { modalActionsCreator } = this.props;
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle("Th???ng k?? d??? li???u");
    changeModalContent(<ExportToolForm />);
  }
  render() {
    const { classes, name, labelButtonAdd, user, isHide, isExport, match: { params }, order } = this.props;
    let isGetToolforOrder = params.orderId ? true : false;
    return (
      <div className={classes.grow}>
        {this.renderRedirect()}
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleToggleSidebar}
            >
              
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              {isHide || !isGetToolforOrder ? name : <>{`Th??m C??ng C??? v??o Work Order: ${order && order.order ? order.order.WO : ''}`}&nbsp;<Button variant="contained" className={classes.btnBack} onClick={() => { this.onClickGotoUrl('/admin/order-detail/' + order.order._id) }}>Quay l???i</Button></>}
            </Typography>
            {labelButtonAdd && !isGetToolforOrder && this.checkPermissionAdd() ? <Button variant="contained" color="primary" onClick={this.openForm}>
              <Add />
              {`TH??M M???I ${labelButtonAdd}`}
            </Button> : null}
            {isExport && user && user.admin ? <>&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="contained" color="primary" onClick={this.handleExport}><GetApp />&nbsp;Xu???t file</Button></> : null}
            {this.showExportToolType() ? <>&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="contained" color="primary" onClick={this.handleExportToolType}><GetApp />&nbsp;Th???ng k?? d??? li???u</Button></> : null}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <label>{user.name}</label>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {this.renderMenu()}

      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    orderActionsCreator: bindActionCreators(orderActions, dispatch),
    cchttActionsCreator: bindActionCreators(cchttActions, dispatch),
    cgsatActionsCreator: bindActionCreators(cgsatActions, dispatch),
    bbdgktActionsCreator: bindActionCreators(bbdgktActions, dispatch),
    bptcActionsCreator: bindActionCreators(bptcActions, dispatch),
    customerActionsCreator: bindActionCreators(customerActions, dispatch),
    toolActionsCreator: bindActionCreators(toolActions, dispatch)
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    showModalStatus: state.modal.showModal,
    user: state.auth.user || {},
    order: state.orders,
    cchtt: state.cchtts,
    bbdgkt: state.bbdgkts,
    bptc: state.bptcs,
    cgsat: state.cgsats,
    tools: state.tools
  };
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withStyles(styles),
  withConnect,
  withRouter,
)(Header);
