import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as cchttActions from '../../actions/cchttActions';
import * as modalActions from '../../actions/modal';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import CchttForm from '../CchttForm';
import { Grid, withStyles, Fab, TextField, FormControl, InputLabel, Select, MenuItem, Input } from '@material-ui/core';
import { DeleteForever, Edit, Visibility, Lock } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { popupConfirm } from '../../actions/ui';

class Changechtts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        page: 1,
        rowPerPage: 20,
        rowPerPageOption: [10, 20, 50]
      },
      redirect: false,
      idRedirect: '',
      dataSearch: {
        wo: '',
        pct: '',
        userId: [],
      },
      columnsGrid: [
        {
          name: '', width: '100px', center: true,
          cell: (params) => {
            let { user } = this.props;
            let data = JSON.parse(JSON.stringify(params));
            console.log(data)
            let checkUser = (user.admin || user._id === params.userId._id);
            console.log(user)
            return <>
              <Fab
                color="default"
                aria-label="Xem Chi Tiết"
                size='small'
                onClick={() => {
                  this.onClickView(data._id)
                }}
              >
                <Visibility color="primary" />
              </Fab>
              {
                checkUser ?
                  <>
                    &nbsp;&nbsp;
                    <Fab
                      color="default"
                      aria-label="Sửa WO"
                      size='small'
                      onClick={() => {
                        this.onClickEdit(data)
                      }}
                    >
                      <Edit color="primary" />
                    </Fab>
                    &nbsp;&nbsp;

                    {/* <Fab
                    color="default"
                    aria-label="Xóa WO"
                    size='small'
                    onClick={() => {
                      this.onClickDelete(data)
                    }}
                    >
                    <DeleteForever color="error" fontSize="small" />
                  </Fab> */}
                  </> : <></>
              }
            </>
          }
        },
        { selector: 'PCCHTT', name: 'Số Thay đổi CHTT', width: '200px', sortable: true, center: true },
        { selector: 'WO', name: 'Work Order', width: '120px', sortable: true, center: true },
        { selector: 'PCT', name: 'Số PCT', width: '120px', sortable: true, center: true },
        { selector: 'userId.name', name: 'Người viết phiếu', width: '180px', sortable: true },
        {
          selector: 'timeChange', name: 'Thời gian thay đổi', width: '200px', sortable: true, center: true,
          cell: (params) => moment(params.timeChange).format('HH:mm DD/MM/YYYY')
        },
        { selector: 'note', name: 'Ghi chú', width: '300px', sortable: true },
      ]
    }
  }
  renderRedirect = () => {
    if (this.state.redirect && this.state.idRedirect) {
      let tool = '/admin/cchtt-detail/' + this.state.idRedirect;
      return <Redirect to={tool} />
    }
  }
  componentDidMount() {
    const { cchttActionCreator, customerActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchCchtt } = cchttActionCreator;
    const { listAllCustomers } = customerActionCreator;
    let params = JSON.parse(JSON.stringify(dataSearch));
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    searchCchtt(params);
    listAllCustomers();
  }
  onClickDelete = (cchtt) => {
    let { user } = this.props;
    const { dataSearch } = this.state;
    if (!user.admin && user._id !== cchtt.userId._id) return;
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn xóa Work Cchtt này?",
      ifOk: () => {
        const { cchttActionCreator } = self.props;
        const { deleteCchtt } = cchttActionCreator;
        let params = JSON.parse(JSON.stringify(dataSearch))
        deleteCchtt(cchtt, params);
      }
    })
  }
  onClickView = (idRedirect) => {
    this.setState({
      redirect: true,
      idRedirect
    })
  };
  onCloseWo = (data) => {
    const { cchttActionCreator, user } = this.props;
    const { updateCchtt } = cchttActionCreator;
    const newCchtt = JSON.parse(JSON.stringify(data));
    switch (newCchtt.status) {
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
  onClickEdit = (data) => {
    const { cchttActionCreator, modalActionsCreator, user } = this.props;
    const { setCchttEditing } = cchttActionCreator;
    if (!user.admin && user._id !== data.userId._id) return;
    setCchttEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Phiếu Đổi CHTT');
    changeModalContent(<CchttForm />);
  }
  handleSearch = (event) => {
    const { cchttActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchCchtt } = cchttActionCreator;
    let search = {
      ...dataSearch,
      skip: 0,
      limit: pagination.rowPerPage,
      [event.target.name]: event.target.value
    }
    this.setState({ dataSearch: search });
    searchCchtt(search);
  }
  handleChangePage = (page, total) => {
    const { cchttActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchCchtt } = cchttActionCreator;
    pagination.page = page;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchCchtt(params);
  }
  handleChangeRowsPerPage = (rowPerPage, total) => {
    const { cchttActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchCchtt } = cchttActionCreator;
    pagination.rowPerPage = rowPerPage;
    pagination.page = 1;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchCchtt(params);
  }

  render() {
    const { cchtts, customers, CchttsTotal, classes } = this.props;
    const { columnsGrid, pagination, dataSearch } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_CHTT"
                name="pcchtt"
                label="Số thay đổi CHTT"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_WO"
                name="wo"
                label="Work Order"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_pct"
                name="pct"
                label="Số PCT"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <FormControl fullWidth className="multiple-select">
                <InputLabel className="lb-user" id="lb-user">Người viết phiếu</InputLabel>
                <Select
                  labelId="lb-user"
                  id="user-id"
                  className="sl-user"
                  multiple
                  value={dataSearch.userId}
                  onChange={this.handleSearch}
                  inputProps={{
                    name: 'userId',
                    id: 'userId',
                  }}
                  input={<Input />}
                >
                  {customers && customers.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <Grid className={classes.dataTable}>
            <DataTable
              noHeader={true}
              keyField={'_id'}
              columns={columnsGrid}
              data={this.genData(cchtts)}
              striped={true}
              pagination
              paginationServer
              paginationDefaultPage={pagination.page}
              paginationPerPage={pagination.rowPerPage}
              paginationRowsPerPageOptions={pagination.rowPerPageOption}
              paginationTotalRows={CchttsTotal}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
          {this.renderRedirect()}
        </div>
      </Fragment>
    );
  }
  genData = (cchtts) => {
    let { user } = this.props;
    console.log(cchtts)
    if (!user) return [];
    return cchtts.filter(cchtt => cchtt.userId)
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    cchtts: state.cchtts.cchtts,
    CchttsTotal: state.cchtts.total,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    cchttActionCreator: bindActionCreators(cchttActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Changechtts);