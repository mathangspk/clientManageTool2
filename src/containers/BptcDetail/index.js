import React, { Component, Fragment, } from 'react';
import { connect } from 'react-redux';
import * as bptcActions from '../../actions/bptcActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, TextField, FormControl, Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import {ArrowBackIos, Edit } from '@material-ui/icons';
import BptcForm from '../BptcForm';
import moment from 'moment';

import "react-image-gallery/styles/css/image-gallery.css";


class BptcDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showRightPanel: false,
      redirect: false,
      urlRedirect: '',
      currentIdTool: {},
      isChange: false,
      bptcAction: true,
    }
  }

  componentDidMount() {
    const { bptcActionCreator, customerActionCreator, match: { params }, bptc } = this.props;
    const { getIdBptc } = bptcActionCreator;
    const { listAllCustomers } = customerActionCreator;
    getIdBptc(params.bptcId);
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
    const { bptcActionCreator, modalActionsCreator } = this.props;
    const { setBptcEditing } = bptcActionCreator;
    setBptcEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa BPTC & JSA');
    changeModalContent(<BptcForm />);
  }
  onChangeNote = (event) => {
    const { bptcActionCreator, bptc } = this.props;
    const { updateBptcNote } = bptcActionCreator;
    const newBptc = JSON.parse(JSON.stringify(bptc));
    newBptc.note = event.target.value;
    this.setState({ isChange: true });
    updateBptcNote(newBptc);
  }
  onBlurNote = (event) => {
    const { bptcActionCreator, bptc } = this.props;
    const { isChange } = this.state;
    const newBptc = JSON.parse(JSON.stringify(bptc));
    if (isChange) {
      const { updateBptc } = bptcActionCreator;
      newBptc.note = event.target.value;
      updateBptc(newBptc);
      this.setState({ isChange: false });
    }
  }
  render() {
    const { classes, bptc, user, customers } = this.props
    const { showRightPanel, columnsGrid, columnsGridComplete, currentIdTool, bptcAction } = this.state
    return (
      <Fragment>
        <div className={classes.containerPanel}>
          {this.renderRedirect()}
          <div className={bptc._id ? '' : classes.maskLoading}>
          </div>
          <Grid className={(showRightPanel ? 'box-panel show-right-panel' : 'box-panel')}>
            <Grid className='left-panel'>
              <div className='block'>
                <div className='header-action'>
                  <div className='group'>
                    <Button variant="contained" color="primary" onClick={() => { this.onClickGotoList('/admin/bptc') }}>
                      <ArrowBackIos style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Quay về danh sách
                    </Button>
                    &nbsp;
                    <Button className={bptc.userId && (user.admin || user._id === bptc.userId._id) ? '' : 'hide'} variant="contained" color="primary" onClick={() => { this.onClickEdit(bptc) }}>
                      <Edit style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Chỉnh sửa
                    </Button>
                  </div>
                </div>
                {bptc.userId && user._id !== bptc.userId._id ? <div className='customer-field'>Người dùng: {bptc.userId ? bptc.userId.name : ''}</div> : ''}
                <div className='info-wo'>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="bptc" value={bptc.BPTC} label="Số Biện pháp thi công" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="jsa" value={bptc.JSA} label="Số JSA" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="content" value={bptc.content} label="Nội dung công tác" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="note" multiline value={bptc.note || ''} label="Ghi chú" onBlur={this.onBlurNote} onChange={this.onChangeNote} InputProps={{ readOnly: true }} />
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
    bptcs: state.bptcs.bptcs,
    bptc: {
      WO: state.bptcs.bptc ? state.bptcs.bptc.WO : '',
      content: state.bptcs.bptc ? state.bptcs.bptc.content : '',
      BPTC: state.bptcs.bptc ? state.bptcs.bptc.BPTC : '',
      JSA: state.bptcs.bptc ? state.bptcs.bptc.JSA : '',
      time: state.bptcs.bptc ? state.bptcs.bptc.time : '',
      userId: state.bptcs.bptc ? state.bptcs.bptc.userId : {},
      note: state.bptcs.bptc ? state.bptcs.bptc.note : '',
      _id: state.bptcs.bptc ? state.bptcs.bptc._id : '',
      isAction: true
    },
    user: state.auth.user || {}
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    toolActionCreator: bindActionCreators(toolActions, dispatch),
    bptcActionCreator: bindActionCreators(bptcActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(BptcDetail);