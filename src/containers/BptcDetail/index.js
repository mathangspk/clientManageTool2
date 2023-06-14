import React, { Component, Fragment, } from 'react';
import { connect } from 'react-redux';
import * as bptcActions from '../../actions/bptcActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import * as fileActions from '../../actions/fileActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, TextField, FormControl, Button, Fab } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import { ArrowBackIos, Edit, DeleteForever } from '@material-ui/icons';
import BptcForm from '../BptcForm';
import FileInput from '../../components/FileInput';
import DataTable from 'react-data-table-component';
import { popupConfirm, popupConfirmYesNo } from '../../actions/ui';
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
      addFile: false,
      columnsGrid: [
        { selector: 'name', name: 'Tên tài liệu', width: '100% - 300px', sortable: true },
        {
          selector: 'idFile', name: 'Link xem', width: 'calc((100% - 100px) / 3)',
          cell: (params) => {
            console.log(params.idFile)
            return <>
              <div>
                <a href={`https://drive.google.com/file/d/${params.idFile}`} target="_blank">Click me</a>
              </div>

            </>
          },
          sortable: true
        },
        {
          name: 'Hành động', width: '100px',
          cell: (params) => {
            let { fastReport } = this.props;
            console.log(fastReport)

            let data = JSON.parse(JSON.stringify(params))
            console.log(data)
            return <>
              <div>
                {/* <a href={`https://drive.google.com/file/d/${params.idFile}`} target="_blank">Click me</a> */}
                <Fab
                  size='small'
                  onClick={() => {
                    this.onClickRemoveDoc(data)
                  }}>
                  <DeleteForever color="error" fontSize="small" /></Fab>
              </div>

            </>
          }
        }
      ],
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
  addFile = (data) => {
    const { fileActionsCreator } = this.props;
    const { uploadFilesSuccess } = fileActionsCreator;
    console.log(data)
    uploadFilesSuccess(data.files)
    this.setState({
      addFile: true,
    })
  };
  generateDocs = (bptc) => {
    console.log('generate bang')
    console.log(bptc)
    const { user } = this.props;
    if (!user && !user._id) return [];
    bptc.isAction = true
    if (!user.admin && bptc.userId && (user._id !== bptc.userId._id)) bptc.isAction = false;
    if (bptc && bptc.files && bptc.files.length > 0) {
      return bptc.files
    }
    return []
  }
  onClickRemoveDoc = (data) => {
    let self = this
    console.log(data)
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn bỏ tài liệu này?",
      ifOk: () => {
        const { bptcActionCreator, toolActionCreator, bptc, fileActionsCreator } = self.props;
        const { currentIdTool } = self.state;
        console.log(currentIdTool)
        const { updateBptc } = bptcActionCreator;
        const { deleteFile } = fileActionsCreator;
        const newbptc = JSON.parse(JSON.stringify(bptc));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newbptc.files.findIndex(function (item, i) {
          return item._id === data._id
        });
        newbptc.files.splice(indexTool, 1);
        newTool.wo = "";
        newTool.status = 1;
        updateBptc(newbptc);
        deleteFile(data.idFile);
      }
    })
  }
  render() {
    const { classes, bptc, user, customers } = this.props
    const { showRightPanel, columnsGrid, columnsGridComplete, currentIdTool, bptcAction, addFile } = this.state
    let dataTable = this.generateDocs(bptc)
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
                  {addFile ? <></> : <Button className={bptc.userId && (user.admin || user._id === bptc.userId._id) ? '' : 'hide'} variant="contained" color="primary" onClick={() => { this.addFile(bptc) }}>
                    <Edit style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Thêm File
                  </Button>}
                  {addFile ? <FileInput /> : <></>}
                  &nbsp;
                </div>
                <Grid className={classes.dataTable}>
                  <DataTable
                    noHeader={true}
                    keyField={'_id'}
                    columns={columnsGrid}
                    data={dataTable}
                    striped={true}
                    pagination
                    paginationPerPage={20}
                    paginationRowsPerPageOptions={[10, 20, 50]}
                    //onRowClicked={this.onClickShowTool}
                    noDataComponent='Chưa thêm tài liệu'
                  />
                </Grid>
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
      isAction: true,
      files: state.bptcs.bptc ? state.bptcs.bptc.files : [],
    },
    user: state.auth.user || {}
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    toolActionCreator: bindActionCreators(toolActions, dispatch),
    bptcActionCreator: bindActionCreators(bptcActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    fileActionsCreator: bindActionCreators(fileActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(BptcDetail);