import React, { Component, Fragment, } from 'react';
import { connect } from 'react-redux';
import * as bbdgktActions from '../../actions/bbdgktActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, TextField, FormControl, Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import {ArrowBackIos, Edit } from '@material-ui/icons';
import BbdgktForm from '../BbdgktForm';
import moment from 'moment';

import "react-image-gallery/styles/css/image-gallery.css";


class BbdgktDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showRightPanel: false,
      redirect: false,
      urlRedirect: '',
      currentIdTool: {},
      isChange: false,
      bbdgktAction: true,
    }
  }

  componentDidMount() {
    const { bbdgktActionCreator, customerActionCreator, match: { params }, bbdgkt } = this.props;
    const { getIdBbdgkt } = bbdgktActionCreator;
    const { listAllCustomers } = customerActionCreator;
    getIdBbdgkt(params.bbdgktId);
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
    const { bbdgktActionCreator, modalActionsCreator } = this.props;
    const { setBbdgktEditing } = bbdgktActionCreator;
    setBbdgktEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Biên Bản ĐGKT');
    changeModalContent(<BbdgktForm />);
  }
  onChangeNote = (event) => {
    const { bbdgktActionCreator, bbdgkt } = this.props;
    const { updateBbdgktNote } = bbdgktActionCreator;
    const newBbdgkt = JSON.parse(JSON.stringify(bbdgkt));
    newBbdgkt.note = event.target.value;
    this.setState({ isChange: true });
    updateBbdgktNote(newBbdgkt);
  }
  onBlurNote = (event) => {
    const { bbdgktActionCreator, bbdgkt } = this.props;
    const { isChange } = this.state;
    const newBbdgkt = JSON.parse(JSON.stringify(bbdgkt));
    if (isChange) {
      const { updateBbdgkt } = bbdgktActionCreator;
      newBbdgkt.note = event.target.value;
      updateBbdgkt(newBbdgkt);
      this.setState({ isChange: false });
    }
  }
  render() {
    const { classes, bbdgkt, user, customers } = this.props
    const { showRightPanel, columnsGrid, columnsGridComplete, currentIdTool, bbdgktAction } = this.state
    return (
      <Fragment>
        <div className={classes.containerPanel}>
          {this.renderRedirect()}
          <div className={bbdgkt._id ? '' : classes.maskLoading}>
          </div>
          <Grid className={(showRightPanel ? 'box-panel show-right-panel' : 'box-panel')}>
            <Grid className='left-panel'>
              <div className='block'>
                <div className='header-action'>
                  <div className='group'>
                    <Button variant="contained" color="primary" onClick={() => { this.onClickGotoList('/admin/bbdgkt') }}>
                      <ArrowBackIos style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Quay về danh sách
                    </Button>
                    &nbsp;
                    <Button className={bbdgkt.userId && (user.admin || user._id === bbdgkt.userId._id) ? '' : 'hide'} variant="contained" color="primary" onClick={() => { this.onClickEdit(bbdgkt) }}>
                      <Edit style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Chỉnh sửa
                    </Button>
                  </div>
                </div>
                {bbdgkt.userId && user._id !== bbdgkt.userId._id ? <div className='customer-field'>Người dùng: {bbdgkt.userId ? bbdgkt.userId.name : ''}</div> : ''}
                <div className='info-wo'>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="bbdgkt" value={bbdgkt.BBDGKT} label="Số Biên Bản ĐGKT" InputProps={{ readOnly: true }} />
                    </FormControl>


                    <FormControl className='field' fullWidth>
                      <TextField id="content" value={bbdgkt.content} label="Nội dung công tác" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="wo" value={bbdgkt.WO} label="Work Bbdgkt" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="time" value={moment(bbdgkt.time).format('DD/MM/YYYY')} label="Ngày thực hiện" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="note" multiline value={bbdgkt.note || ''} label="Ghi chú" onBlur={this.onBlurNote} onChange={this.onChangeNote} InputProps={{ readOnly: true }} />
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
    bbdgkts: state.bbdgkts.bbdgkts,
    bbdgkt: {
      WO: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.WO : '',
      content: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.content : '',
      BBDGKT: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.BBDGKT : '',
      time: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.time : '',
      userId: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.userId : {},
      note: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.note : '',
      _id: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt._id : '',
      isAction: true
    },
    user: state.auth.user || {}
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    toolActionCreator: bindActionCreators(toolActions, dispatch),
    bbdgktActionCreator: bindActionCreators(bbdgktActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(BbdgktDetail);