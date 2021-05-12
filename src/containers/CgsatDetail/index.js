import React, { Component, Fragment, } from 'react';
import { connect } from 'react-redux';
import * as cgsatActions from '../../actions/cgsatActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, TextField, FormControl, Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import {ArrowBackIos, Edit } from '@material-ui/icons';
import CgsatForm from '../CgsatForm';
import moment from 'moment';

import "react-image-gallery/styles/css/image-gallery.css";


class CgsatDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showRightPanel: false,
      redirect: false,
      urlRedirect: '',
      currentIdTool: {},
      isChange: false,
      cgsatAction: true,
    }
  }

  componentDidMount() {
    const { cgsatActionCreator, customerActionCreator, match: { params }, cgsat } = this.props;
    const { getIdCgsat } = cgsatActionCreator;
    const { listAllCustomers } = customerActionCreator;
    getIdCgsat(params.cgsatId);
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
    const { cgsatActionCreator, modalActionsCreator } = this.props;
    const { setCgsatEditing } = cgsatActionCreator;
    setCgsatEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Phiếu thay đổi GSAT');
    changeModalContent(<CgsatForm />);
  }
  onChangeNote = (event) => {
    const { cgsatActionCreator, cgsat } = this.props;
    const { updateCgsatNote } = cgsatActionCreator;
    const newCgsat = JSON.parse(JSON.stringify(cgsat));
    newCgsat.note = event.target.value;
    this.setState({ isChange: true });
    updateCgsatNote(newCgsat);
  }
  onBlurNote = (event) => {
    const { cgsatActionCreator, cgsat } = this.props;
    const { isChange } = this.state;
    const newCgsat = JSON.parse(JSON.stringify(cgsat));
    if (isChange) {
      const { updateCgsat } = cgsatActionCreator;
      newCgsat.note = event.target.value;
      updateCgsat(newCgsat);
      this.setState({ isChange: false });
    }
  }
  render() {
    const { classes, cgsat, user, customers } = this.props
    const { showRightPanel, columnsGrid, columnsGridComplete, currentIdTool, cgsatAction } = this.state
    return (
      <Fragment>
        <div className={classes.containerPanel}>
          {this.renderRedirect()}
          <div className={cgsat._id ? '' : classes.maskLoading}>
          </div>
          <Grid className={(showRightPanel ? 'box-panel show-right-panel' : 'box-panel')}>
            <Grid className='left-panel'>
              <div className='block'>
                <div className='header-action'>
                  <div className='group'>
                    <Button variant="contained" color="primary" onClick={() => { this.onClickGotoList('/admin/cgsat') }}>
                      <ArrowBackIos style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Quay về danh sách
                    </Button>
                    &nbsp;
                    <Button className={cgsat.userId && (user.admin || user._id === cgsat.userId._id) ? '' : 'hide'} variant="contained" color="primary" onClick={() => { this.onClickEdit(cgsat) }}>
                      <Edit style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Chỉnh sửa
                    </Button>
                  </div>
                </div>
                {cgsat.userId && user._id !== cgsat.userId._id ? <div className='customer-field'>Người dùng: {cgsat.userId ? cgsat.userId.name : ''}</div> : ''}
                <div className='info-wo'>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="cgsat" value={cgsat.PCGSAT} label="Số Phiếu Đổi GSAT" InputProps={{ readOnly: true }} />
                    </FormControl>


                    <FormControl className='field' fullWidth>
                      <TextField id="pct" value={cgsat.PCT} label="PCT" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="wo" value={cgsat.WO} label="Work Cgsat" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="timeChange" value={moment(cgsat.timeChange).format('HH:mm DD/MM/YYYY')} label="Ngày giờ thay đổi" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="note" multiline value={cgsat.note || ''} label="Ghi chú" onBlur={this.onBlurNote} onChange={this.onChangeNote} InputProps={{ readOnly: true }} />
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
    cgsats: state.cgsats.cgsats,
    cgsat: {
      WO: state.cgsats.cgsat ? state.cgsats.cgsat.WO : '',
      PCT: state.cgsats.cgsat ? state.cgsats.cgsat.PCT : '',
      PCGSAT: state.cgsats.cgsat ? state.cgsats.cgsat.PCGSAT : '',
      timeChange: state.cgsats.cgsat ? state.cgsats.cgsat.timeChange : '',
      userId: state.cgsats.cgsat ? state.cgsats.cgsat.userId : {},
      note: state.cgsats.cgsat ? state.cgsats.cgsat.note : '',
      _id: state.cgsats.cgsat ? state.cgsats.cgsat._id : '',
      isAction: true
    },
    user: state.auth.user || {}
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    toolActionCreator: bindActionCreators(toolActions, dispatch),
    cgsatActionCreator: bindActionCreators(cgsatActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(CgsatDetail);