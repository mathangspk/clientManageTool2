import React, { Component, Fragment, } from 'react';
import { connect } from 'react-redux';
import * as bbdgktActions from '../../actions/bbdgktActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import * as fileActions from '../../actions/fileActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, TextField, FormControl, Button, Fab } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import { ArrowBackIos, Edit, DeleteForever } from '@material-ui/icons';
import DataTable from 'react-data-table-component';
import BbdgktForm from '../BbdgktForm';
import moment from 'moment';
import FileInput from '../../components/FileInput';
import { popupConfirm, popupConfirmYesNo } from '../../actions/ui';
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
  addFile = (data) => {
    const { fileActionsCreator } = this.props;
    const { uploadFilesSuccess } = fileActionsCreator;
    console.log(data)
    uploadFilesSuccess(data.files)
    this.setState({
      addFile: true,
    })
  };
  generateDocs = (bbdgkt) => {
    console.log('generate bang')
    console.log(bbdgkt)
    const { user } = this.props;
    if (!user && !user._id) return [];
    bbdgkt.isAction = true
    if (!user.admin && bbdgkt.userId && (user._id !== bbdgkt.userId._id)) bbdgkt.isAction = false;
    if (bbdgkt && bbdgkt.files && bbdgkt.files.length > 0) {
      return bbdgkt.files
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
        const { bbdgktActionCreator, toolActionCreator, bbdgkt, fileActionsCreator } = self.props;
        const { currentIdTool } = self.state;
        console.log(currentIdTool)
        const { updateBbdgkt } = bbdgktActionCreator;
        const { deleteFile } = fileActionsCreator;
        const newbbdgkt = JSON.parse(JSON.stringify(bbdgkt));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newbbdgkt.files.findIndex(function (item, i) {
          return item._id === data._id
        });
        newbbdgkt.files.splice(indexTool, 1);
        newTool.wo = "";
        newTool.status = 1;
        updateBbdgkt(newbbdgkt);
        deleteFile(data.idFile);
      }
    })
  }
  render() {
    const { classes, bbdgkt, user, customers } = this.props
    const { showRightPanel, columnsGrid, columnsGridComplete, currentIdTool, bbdgktAction, addFile } = this.state
    let dataTable = this.generateDocs(bbdgkt)
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
                  {addFile ? <></> : <Button className={bbdgkt.userId && (user.admin || user._id === bbdgkt.userId._id) ? '' : 'hide'} variant="contained" color="primary" onClick={() => { this.addFile(bbdgkt) }}>
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
    bbdgkts: state.bbdgkts.bbdgkts,
    bbdgkt: {
      WO: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.WO : '',
      content: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.content : '',
      BBDGKT: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.BBDGKT : '',
      time: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.time : '',
      userId: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.userId : {},
      note: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.note : '',
      _id: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt._id : '',
      isAction: true,
      files: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.files : [],
    },
    user: state.auth.user || {}
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    toolActionCreator: bindActionCreators(toolActions, dispatch),
    bbdgktActionCreator: bindActionCreators(bbdgktActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    fileActionsCreator: bindActionCreators(fileActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(BbdgktDetail);