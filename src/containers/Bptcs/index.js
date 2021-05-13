import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as bptcActions from '../../actions/bptcActions';
import * as modalActions from '../../actions/modal';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import BptcForm from '../BptcForm';
import { Grid, withStyles, Fab, TextField, FormControl, InputLabel, Select, MenuItem, Input } from '@material-ui/core';
import { DeleteForever, Edit, Visibility, Lock } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { popupConfirm } from '../../actions/ui';

class Bptcs extends Component {
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

                    <Fab
                    color="default"
                    aria-label="Xóa WO"
                    size='small'
                    onClick={() => {
                      this.onClickDelete(data)
                    }}
                    >
                    <DeleteForever color="error" fontSize="small" />
                  </Fab>
                  </> : <></>
              }
            </>
          }
        },
        { selector: 'BPTC', name: 'Số Biện Pháp Thi Công', width: '200px', sortable: true, center: true },
        { selector: 'JSA', name: 'Số JSA', width: '200px', sortable: true, center: true },
        { selector: 'content', name: 'Nội dung công tác', width: '500px', sortable: true, center: true },       
        { selector: 'note', name: 'Ghi chú', width: '300px', sortable: true },
      ]
    }
  }
  renderRedirect = () => {
    if (this.state.redirect && this.state.idRedirect) {
      let tool = '/admin/bptc-detail/' + this.state.idRedirect;
      return <Redirect to={tool} />
    }
  }
  componentDidMount() {
    const { bptcActionCreator, customerActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchBptc } = bptcActionCreator;
    const { listAllCustomers } = customerActionCreator;
    let params = JSON.parse(JSON.stringify(dataSearch));
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    searchBptc(params);
    listAllCustomers();
  }
  onClickDelete = (bptc) => {
    let { user } = this.props;
    const { dataSearch } = this.state;
    if (!user.admin && user._id !== bptc.userId._id) return;
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn xóa Biện pháp thi công và JSA này?",
      ifOk: () => {
        const { bptcActionCreator } = self.props;
        const { deleteBptc } = bptcActionCreator;
        let params = JSON.parse(JSON.stringify(dataSearch))
        deleteBptc(bptc, params);
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
    const { bptcActionCreator, user } = this.props;
    const { updateBptc } = bptcActionCreator;
    const newBptc = JSON.parse(JSON.stringify(data));
    switch (newBptc.status) {
      case 'COMPLETE':
        if (user.pkt) {
          newBptc.status = 'CLOSE'
        }
        break;
      default:
        break;
    }
    updateBptc(newBptc);
  };
  onClickEdit = (data) => {
    const { bptcActionCreator, modalActionsCreator, user } = this.props;
    const { setBptcEditing } = bptcActionCreator;
    if (!user.admin && user._id !== data.userId._id) return;
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
  handleSearch = (event) => {
    const { bptcActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchBptc } = bptcActionCreator;
    let search = {
      ...dataSearch,
      skip: 0,
      limit: pagination.rowPerPage,
      [event.target.name]: event.target.value
    }
    this.setState({ dataSearch: search });
    searchBptc(search);
  }
  handleChangePage = (page, total) => {
    const { bptcActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchBptc } = bptcActionCreator;
    pagination.page = page;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchBptc(params);
  }
  handleChangeRowsPerPage = (rowPerPage, total) => {
    const { bptcActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchBptc } = bptcActionCreator;
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
    searchBptc(params);
  }

  render() {
    const { bptcs, customers, BptcsTotal, classes } = this.props;
    const { columnsGrid, pagination, dataSearch } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_BPTC"
                name="bptc"
                label="Số Biện pháp thi công"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_jsa"
                name="jsa"
                label="Số JSA"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_content"
                name="content"
                label="Nội dung công tác"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <FormControl fullWidth className="multiple-select">
                <InputLabel className="lb-user" id="lb-user">Người lấy số phiếu</InputLabel>
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
              data={this.genData(bptcs)}
              striped={true}
              pagination
              paginationServer
              paginationDefaultPage={pagination.page}
              paginationPerPage={pagination.rowPerPage}
              paginationRowsPerPageOptions={pagination.rowPerPageOption}
              paginationTotalRows={BptcsTotal}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
          {this.renderRedirect()}
        </div>
      </Fragment>
    );
  }
  genData = (bptcs) => {
    let { user } = this.props;
    console.log(bptcs)
    if (!user) return [];
    return bptcs.filter(bptc => bptc.userId)
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    bptcs: state.bptcs.bptcs,
    bptcsTotal: state.bptcs.total,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    bptcActionCreator: bindActionCreators(bptcActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Bptcs);