import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as cgsatActions from '../../actions/cgsatActions';
import * as modalActions from '../../actions/modal';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import CgsatForm from '../CgsatForm';
import { Grid, withStyles, Fab, TextField, FormControl, InputLabel, Select, MenuItem, Input } from '@material-ui/core';
import { DeleteForever, Edit, Visibility, Lock } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { popupConfirm } from '../../actions/ui';

class Changegsats extends Component {
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
        { selector: 'PCGSAT', name: 'Số Thay đổi GSAT', width: '200px', sortable: true, center: true },
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
      let tool = '/admin/cgsat-detail/' + this.state.idRedirect;
      return <Redirect to={tool} />
    }
  }
  componentDidMount() {
    const { cgsatActionCreator, customerActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchCgsat } = cgsatActionCreator;
    const { listAllCustomers } = customerActionCreator;
    let params = JSON.parse(JSON.stringify(dataSearch));
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    searchCgsat(params);
    listAllCustomers();
  }
  onClickDelete = (cgsat) => {
    let { user } = this.props;
    const { dataSearch } = this.state;
    if (!user.admin && user._id !== cgsat.userId._id) return;
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn xóa Phiếu thay đổi GSAT này?",
      ifOk: () => {
        const { cgsatActionCreator } = self.props;
        const { deleteCgsat } = cgsatActionCreator;
        let params = JSON.parse(JSON.stringify(dataSearch))
        deleteCgsat(cgsat, params);
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
    const { cgsatActionCreator, user } = this.props;
    const { updateCgsat } = cgsatActionCreator;
    const newCgsat = JSON.parse(JSON.stringify(data));
    switch (newCgsat.status) {
      case 'COMPLETE':
        if (user.pkt) {
          newCgsat.status = 'CLOSE'
        }
        break;
      default:
        break;
    }
    updateCgsat(newCgsat);
  };
  onClickEdit = (data) => {
    const { cgsatActionCreator, modalActionsCreator, user } = this.props;
    const { setCgsatEditing } = cgsatActionCreator;
    if (!user.admin && user._id !== data.userId._id) return;
    setCgsatEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Phiếu Đổi GSAT');
    changeModalContent(<CgsatForm />);
  }
  handleSearch = (event) => {
    const { cgsatActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchCgsat } = cgsatActionCreator;
    let search = {
      ...dataSearch,
      skip: 0,
      limit: pagination.rowPerPage,
      [event.target.name]: event.target.value
    }
    this.setState({ dataSearch: search });
    searchCgsat(search);
  }
  handleChangePage = (page, total) => {
    const { cgsatActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchCgsat } = cgsatActionCreator;
    pagination.page = page;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchCgsat(params);
  }
  handleChangeRowsPerPage = (rowPerPage, total) => {
    const { cgsatActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchCgsat } = cgsatActionCreator;
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
    searchCgsat(params);
  }

  render() {
    const { cgsats, customers, CgsatsTotal, classes } = this.props;
    const { columnsGrid, pagination, dataSearch } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_GSAT"
                name="gsat"
                label="Phiếu Thay Đổi GSAT"
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
              data={this.genData(cgsats)}
              striped={true}
              pagination
              paginationServer
              paginationDefaultPage={pagination.page}
              paginationPerPage={pagination.rowPerPage}
              paginationRowsPerPageOptions={pagination.rowPerPageOption}
              paginationTotalRows={CgsatsTotal}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
          {this.renderRedirect()}
        </div>
      </Fragment>
    );
  }
  genData = (cgsats) => {
    let { user } = this.props;
    console.log(cgsats)
    if (!user) return [];
    return cgsats.filter(cgsat => cgsat.userId)
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    cgsats: state.cgsats.cgsats,
    cgsatsTotal: state.cgsats.total,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    cgsatActionCreator: bindActionCreators(cgsatActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Changegsats);