import React, { Component, Fragment, } from 'react';
import { connect } from 'react-redux';
import * as cchttActions from '../../actions/cchttActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, Fab, TextField, FormControl, Button, Table } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import { DeleteForever, ArrowBackIos, Edit, KeyboardReturn, Add } from '@material-ui/icons';
import DataTable from 'react-data-table-component';
import { API_ENDPOINT as URL } from '../../constants';
import CchttForm from '../CchttForm';
import moment from 'moment';
import { popupConfirm, popupConfirmYesNo } from '../../actions/ui';
import ImageGallery from 'react-image-gallery';
import { Multiselect } from 'multiselect-react-dropdown';
import { AlignmentType, Document, BcchttStyle, HeadingLevel, Packer, Paragraph, TabStopPosition, TabStopType, TextRun, Table as TableD, TableCell as TableCellD, TableRow as TableRowD, WidthType, convertInchesToTwip } from 'docx';
import { saveAs } from "file-saver";

import "react-image-gallery/styles/css/image-gallery.css";


class CchttDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showRightPanel: false,
      redirect: false,
      urlRedirect: '',
      currentIdTool: {},
      isChange: false,
      cchttAction: true,
    }
  }

  componentDidMount() {
    const { cchttActionCreator, customerActionCreator, match: { params }, cchtt } = this.props;
    const { getIdCchtt } = cchttActionCreator;
    const { listAllCustomers } = customerActionCreator;
    getIdCchtt(params.cchttId);
    listAllCustomers();
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.urlRedirect} />
    }
  }
  onClickAddTool = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }
  onClickGotoList = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }
  onClickEdit = (data) => {
    const { cchttActionCreator, modalActionsCreator } = this.props;
    const { setCchttEditing } = cchttActionCreator;
    setCchttEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Work Cchtt');
    changeModalContent(<CchttForm />);
  }
  onChangeNote = (event) => {
    const { cchttActionCreator, cchtt } = this.props;
    const { updateCchttNote } = cchttActionCreator;
    const newCchtt = JSON.parse(JSON.stringify(cchtt));
    newCchtt.note = event.target.value;
    this.setState({ isChange: true });
    updateCchttNote(newCchtt);
  }
  onBlurNote = (event) => {
    const { cchttActionCreator, cchtt } = this.props;
    const { isChange } = this.state;
    const newCchtt = JSON.parse(JSON.stringify(cchtt));
    if (isChange) {
      const { updateCchtt } = cchttActionCreator;
      newCchtt.note = event.target.value;
      updateCchtt(newCchtt);
      this.setState({ isChange: false });
    }
  }
  render() {
    const { classes, cchtt, user, customers } = this.props
    const { showRightPanel, columnsGrid, columnsGridComplete, currentIdTool, cchttAction } = this.state
    return (
      <Fragment>
        <div className={classes.containerPanel}>
          {this.renderRedirect()}
          <div className={cchtt._id ? '' : classes.maskLoading}>
          </div>
          <Grid className={(showRightPanel ? 'box-panel show-right-panel' : 'box-panel')}>
            <Grid className='left-panel'>
              <div className='block'>
                <div className='header-action'>
                  <div className='group'>
                    <Button variant="contained" color="primary" onClick={() => { this.onClickGotoList('/admin/cchtt') }}>
                      <ArrowBackIos style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Quay về danh sách
                    </Button>
                    &nbsp;
                    <Button className={cchtt.userId && (user.admin || user._id === cchtt.userId._id) ? '' : 'hide'} variant="contained" color="primary" onClick={() => { this.onClickEdit(cchtt) }}>
                      <Edit style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Chỉnh sửa
                    </Button>
                  </div>
                </div>
                {cchtt.userId && user._id !== cchtt.userId._id ? <div className='customer-field'>Người dùng: {cchtt.userId ? cchtt.userId.name : ''}</div> : ''}
                <div className='info-wo'>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="cchtt" value={cchtt.PCCHTT} label="Số Phiếu Đổi CHTT" InputProps={{ readOnly: true }} />
                    </FormControl>


                    <FormControl className='field' fullWidth>
                      <TextField id="pct" value={cchtt.PCT} label="PCT" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="wo" value={cchtt.WO} label="Work Cchtt" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="timeChange" value={moment(cchtt.timeChange).format('HH:mm DD/MM/YYYY')} label="Ngày giờ thay đổi" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="note" multiline value={cchtt.note || ''} label="Ghi chú" onBlur={this.onBlurNote} onChange={this.onChangeNote} InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    cchtts: state.cchtts.cchtts,
    cchtt: {
      WO: state.cchtts.cchtt ? state.cchtts.cchtt.WO : '',
      PCT: state.cchtts.cchtt ? state.cchtts.cchtt.PCT : '',
      PCCHTT: state.cchtts.cchtt ? state.cchtts.cchtt.PCCHTT : '',
      timeChange: state.cchtts.cchtt ? state.cchtts.cchtt.timeChange : '',
      userId: state.cchtts.cchtt ? state.cchtts.cchtt.userId : {},
      note: state.cchtts.cchtt ? state.cchtts.cchtt.note : '',
      _id: state.cchtts.cchtt ? state.cchtts.cchtt._id : '',
      isAction: true
    },
    user: state.auth.user || {}
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    toolActionCreator: bindActionCreators(toolActions, dispatch),
    cchttActionCreator: bindActionCreators(cchttActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(CchttDetail);