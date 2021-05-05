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
      columnsGrid: [
        { selector: 'name', name: 'Tên công cụ', width: '100% - 300px', sortable: true },
        {
          selector: 'status', name: 'Trạng thái', width: '130px', sortable: true,
          cell: (param) => {
            let { cchtt } = this.props;
            //if (!cchtt.isAction) return <></>
            let status = 'READY'
            let className = 'ready'
            switch (param.status + "") {
              case "1":
                status = 'RETURNED';
                className = 'ready';
                break;
              case "2":
                status = 'IN USE';
                className = 'in-use';
                break;
              case "3":
                status = 'BAD'
                className = 'bad';
                break;
              case "4":
                status = 'LOST';
                className = 'lost';
                break;
              default:
                status = 'READY'
                break;
            }
            return <div className={'lb-status color-' + className}>{status}</div>;
          }
        },
        // { selector: 'type', name: 'Loại', width: 'calc((100% - 100px) / 3)', sortable: true },
        {
          name: 'Hành động', width: '100px',
          cell: (params) => {
            let { cchtt } = this.props;
            console.log(cchtt)
            
            if (!cchtt.isAction) return <></>
            let data = JSON.parse(JSON.stringify(params))
            console.log(data)
            if (cchtt.status === "START") {
              return <>
                <Fab
                  color="default"
                  aria-label="Remove"
                  size='small'
                  onClick={() => {
                    this.onClickRemoveTool(data)
                  }}
                >
                  <DeleteForever color="error" fontSize="small" />
                </Fab>
              </>
            }
            if (cchtt.status === "READY" || cchtt.status === "INPRG HAVE TOOL") {
              if (data.status === 1) {
                return <>
                  <Fab
                    color="default"
                    aria-label="Return"
                    size='small'
                    onClick={() => {
                      this.onClickAddToolInList(data)
                    }}
                  >
                    <Add color="primary" fontSize="small" />
                  </Fab>
            &nbsp;
                  <Fab
                    color="default"
                    aria-label="Remove"
                    size='small'
                    onClick={() => {
                      this.onClickRemoveTool(data)
                    }}
                  >
                    <DeleteForever color="error" fontSize="small" />
                  </Fab>
                </>
              }
              if (data.status === 2) {
                return <>
                  <Fab
                    color="default"
                    aria-label="Return"
                    size='small'
                    onClick={() => {
                      this.onClickReturnTool(data)
                    }}
                  >
                    <KeyboardReturn fontSize="small" />
                  </Fab>
            &nbsp;
                  <Fab
                    color="default"
                    aria-label="Remove"
                    size='small'
                    onClick={() => {
                      this.onClickRemoveTool(data)
                    }}
                  >
                    <DeleteForever color="error" fontSize="small" />
                  </Fab>
                </>
              }
            }
          }
        }
      ],
      columnsGridComplete: [
        { selector: 'name', name: 'Tên công cụ', width: '100% - 300px', sortable: true },
        // { selector: 'type', name: 'Loại', width: 'calc((100% - 100px) / 3)', sortable: true },
      ]
    }
  }


  componentDidMount() {
    const { cchttActionCreator, customerActionCreator, match: { params }, cchtt } = this.props;
    const { getIdCchtt } = cchttActionCreator;
    const { listAllCustomers } = customerActionCreator;
    getIdCchtt(params.cchttId);
    listAllCustomers();
  }
  onClickShowTool = (data) => {
    if (data._id === this.state.currentIdTool._id) {
      this.setState({ showRightPanel: false, currentIdTool: {} });
    } else {
      this.setState({ showRightPanel: true, currentIdTool: data })
    }
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
  onClickRemoveTool = (data) => {
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn bỏ công cụ này?",
      ifOk: () => {
        const { cchttActionCreator, toolActionCreator, cchtt } = self.props;
        const { currentIdTool } = self.state;
        const { updateCchtt } = cchttActionCreator;
        const { updateTool } = toolActionCreator;
        const newCchtt = JSON.parse(JSON.stringify(cchtt));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newCchtt.toolId.findIndex(function (item, i) {
          return item._id === data._id
        });
        //let indexTool = newCchtt.toolId.indexOf(data._id);
        newCchtt.toolId.splice(indexTool, 1);
        newTool.wo = "";
        newTool.status = 1;
        if (currentIdTool._id === data._id) {
          self.setState({ currentIdTool: {} });
        }
        updateCchtt(newCchtt);
        updateTool(newTool);
      }
    })
  }
  onClickReturnTool = (data) => {
    let self = this
    popupConfirm({
      title: 'Trả tool',
      html: "Bạn muốn trả công cụ này về kho?",
      ifOk: () => {
        const { cchttActionCreator, toolActionCreator, cchtt } = self.props;
        const { currentIdTool } = self.state;
        const { updateCchtt } = cchttActionCreator;
        const { updateTool } = toolActionCreator;
        const newCchtt = JSON.parse(JSON.stringify(cchtt));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newCchtt.toolId.findIndex(function (item, i) {
          return item._id === data._id
        });
        newTool.wo = "";
        newTool.status = 1;
        newCchtt.toolId[indexTool].status = newTool.status;
        if (currentIdTool._id === data._id) {
          self.setState({ currentIdTool: {} });
        }
        updateCchtt(newCchtt);
        updateTool(newTool);
      }
    })
  }
  onClickAddToolInList = (data) => {
    let self = this
    popupConfirm({
      title: 'Mượn tool lại',
      html: "Bạn muốn mượn lại công cụ này không?",
      ifOk: () => {
        const { cchttActionCreator, toolActionCreator, cchtt } = self.props;
        const { currentIdTool } = self.state;
        const { updateCchtt } = cchttActionCreator;
        const { updateTool } = toolActionCreator;
        const newCchtt = JSON.parse(JSON.stringify(cchtt));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newCchtt.toolId.findIndex(function (item, i) {
          return item._id === data._id
        });
        newTool.wo = newCchtt.WO;
        newTool.status = 2;
        newCchtt.toolId[indexTool].status = newTool.status;
        if (currentIdTool._id === data._id) {
          self.setState({ currentIdTool: {} });
        }
        updateCchtt(newCchtt);
        updateTool(newTool);
      }
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
  onClickVerify = (data) => {
    const { cchttActionCreator, user, cchtt } = this.props;
    const { updateCchtt } = cchttActionCreator;
    const newCchtt = JSON.parse(JSON.stringify(data));
    const haveToolInList = data.toolId;
    switch (newCchtt.status) {
      case 'START':
        if (haveToolInList.length === 0) {
          newCchtt.status = 'INPRG NO TOOL'
          newCchtt.statusTool = "INPRG NO TOOL"
        }
        else {
          newCchtt.status = 'READY'
          newCchtt.statusTool = 'READY'
        }
        break;
      case 'READY':
        if (user.admin) {
          newCchtt.status = 'INPRG HAVE TOOL'
          newCchtt.statusTool = 'INPRG HAVE TOOL'
        }
        break;
      case 'INPRG HAVE TOOL':
        if (user.admin) {
          newCchtt.status = 'INPRG NO TOOL'
          newCchtt.statusTool = "INPRG NO TOOL"
        }
        break;
      case 'INPRG NO TOOL':
        let self = this
        popupConfirmYesNo({
          title: 'Thông báo',
          html: "Bạn vui lòng kiểm tra lại ngày kết thúc theo phiếu công tác, nếu đúng nhấn 'Đúng', nếu sai chọn 'Sai' ",
          ifOk: () => {
            const { cchtt } = self.props;
            const newCchtt = JSON.parse(JSON.stringify(cchtt));
            newCchtt.status = 'COMPLETE'
            newCchtt.statusTool = "COMPLETE"
            updateCchtt(newCchtt);
          },
          ifCancel: () => {
            this.onClickEdit(cchtt)
          }
        })
        break;
      case 'COMPLETE':
        if (user.pkt) {
          newCchtt.status = 'CLOSE'
        }
        break;
      default:
        break;
    }
    updateCchtt(newCchtt);
  };
  classAddTool = (cchtt) => {
    const { user } = this.props
    if (!cchtt.userId) return 'hide';
    if (!user.admin && (user._id !== cchtt.userId._id || cchtt.status !== 'START')) return 'hide';
    if (user.admin &&  cchtt.status === 'INPRG NO TOOL') return 'hide';
    if (cchtt.status === 'COMPLETE' || cchtt.status === 'CLOSE') return 'hide';
    return ''
  }
  getImage = (images) => {
    return images.map(img => ({
      original: `${URL}/api/upload/image/${img.filename}`,
      thumbnail: `${URL}/api/upload/image/${img.filename}`
    }))
  }
  addandremoveUserNV = (data) => {
    const { cchttActionCreator, cchtt } = this.props;
    const { updateCchtt } = cchttActionCreator;
    const newCchtt = JSON.parse(JSON.stringify(cchtt));
    newCchtt.NV = data
    updateCchtt(newCchtt);
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
                      <TextField id="wo" value={cchtt.WO} label="Work Cchtt" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="pct" value={cchtt.PCT} label="PCT" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="date_start" value={moment(cchtt.timeChange).format('DD/MM/YYYY')} label="Ngày giờ thay đổi" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="note" multiline value={cchtt.note || ''} label="Ghi chú" onBlur={this.onBlurNote} onChange={this.onChangeNote} InputProps={{ readOnly: this.classAddTool(cchtt) === 'hide' }} />
                    </FormControl>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid className='right-panel'>
              <div className='block'>
                <div>Tên công cụ: {currentIdTool.name}</div>
                <div>Hãng: {currentIdTool.manufacturer}</div>
                <div>Loại: {currentIdTool.type}</div>
                <div>Hình ảnh:</div>
                {
                  (currentIdTool.images || []).length === 0 ? <></>
                    : <ImageGallery items={this.getImage(currentIdTool.images)} />
                }
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
      date: state.cchtts.cchtt ? state.cchtts.cchtt.date : '',
      status: state.cchtts.cchtt ? state.cchtts.cchtt.status : '',
      statusTool: state.cchtts.cchtt ? state.cchtts.cchtt.statusTool : '',
      timeStart: state.cchtts.cchtt ? state.cchtts.cchtt.timeStart : '',
      timeStop: state.cchtts.cchtt ? state.cchtts.cchtt.timeStop : '',
      toolId: state.cchtts.cchtt ? state.cchtts.cchtt.toolId : [],
      content: state.cchtts.cchtt ? state.cchtts.cchtt.content : '',
      location: state.cchtts.cchtt ? state.cchtts.cchtt.location : '',
      KKS: state.cchtts.cchtt ? state.cchtts.cchtt.KKS : '',
      userId: state.cchtts.cchtt ? state.cchtts.cchtt.userId : {},
      NV: state.cchtts.cchtt ? state.cchtts.cchtt.NV : [],
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