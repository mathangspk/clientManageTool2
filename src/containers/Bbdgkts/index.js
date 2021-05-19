import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as bbdgktActions from '../../actions/bbdgktActions';
import * as modalActions from '../../actions/modal';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import BbdgktForm from '../BbdgktForm';
import { Grid, withStyles, Fab, TextField, FormControl, InputLabel, Select, MenuItem, Input } from '@material-ui/core';
import { DeleteForever, Edit, Visibility, Lock } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { popupConfirm } from '../../actions/ui';

class Bbdgkts extends Component {
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
        { selector: 'BBDGKT', name: 'Số Thay đổi GSAT', width: '200px', sortable: true, center: true },
        { selector: 'userId.department', name: 'Phân xưởng thực hiện', width: '200px', sortable: true, center: true },
        { selector: 'content', name: 'Nội dung công tác', width: '500px', sortable: true, center: true },
        {
          selector: 'time', name: 'Ngày thực hiện', width: '200px', sortable: true, center: true,
          cell: (params) => moment(params.time).format('DD/MM/YYYY')
        },
        { selector: 'WO', name: 'Work Order', width: '120px', sortable: true, center: true },
        
        { selector: 'userId.name', name: 'Người thực hiện', width: '180px', sortable: true },
        
        { selector: 'note', name: 'Ghi chú', width: '300px', sortable: true },
      ]
    }
  }
  renderRedirect = () => {
    if (this.state.redirect && this.state.idRedirect) {
      let tool = '/admin/bbdgkt-detail/' + this.state.idRedirect;
      return <Redirect to={tool} />
    }
  }
  componentDidMount() {
    const { bbdgktActionCreator, customerActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchBbdgkt } = bbdgktActionCreator;
    const { listAllCustomers } = customerActionCreator;
    let params = JSON.parse(JSON.stringify(dataSearch));
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    searchBbdgkt(params);
    listAllCustomers();
  }
  onClickDelete = (bbdgkt) => {
    let { user } = this.props;
    const { dataSearch } = this.state;
    if (!user.admin && user._id !== bbdgkt.userId._id) return;
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn xóa Phiếu thay đổi GSAT này?",
      ifOk: () => {
        const { bbdgktActionCreator } = self.props;
        const { deleteBbdgkt } = bbdgktActionCreator;
        let params = JSON.parse(JSON.stringify(dataSearch))
        deleteBbdgkt(bbdgkt, params);
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
    const { bbdgktActionCreator, user } = this.props;
    const { updateBbdgkt } = bbdgktActionCreator;
    const newBbdgkt = JSON.parse(JSON.stringify(data));
    switch (newBbdgkt.status) {
      case 'COMPLETE':
        if (user.pkt) {
          newBbdgkt.status = 'CLOSE'
        }
        break;
      default:
        break;
    }
    updateBbdgkt(newBbdgkt);
  };
  onClickEdit = (data) => {
    const { bbdgktActionCreator, modalActionsCreator, user } = this.props;
    const { setBbdgktEditing } = bbdgktActionCreator;
    if (!user.admin && user._id !== data.userId._id) return;
    setBbdgktEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Phiếu Đổi GSAT');
    changeModalContent(<BbdgktForm />);
  }
  handleSearch = (event) => {
    const { bbdgktActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchBbdgkt } = bbdgktActionCreator;
    let search = {
      ...dataSearch,
      skip: 0,
      limit: pagination.rowPerPage,
      [event.target.name]: event.target.value
    }
    this.setState({ dataSearch: search });
    searchBbdgkt(search);
  }
  handleChangePage = (page, total) => {
    const { bbdgktActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchBbdgkt } = bbdgktActionCreator;
    pagination.page = page;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchBbdgkt(params);
  }
  handleChangeRowsPerPage = (rowPerPage, total) => {
    const { bbdgktActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchBbdgkt } = bbdgktActionCreator;
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
    searchBbdgkt(params);
  }

  render() {
    const { bbdgkts, customers, BbdgktsTotal, classes } = this.props;
    const { columnsGrid, pagination, dataSearch } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_BBDGKT"
                name="bbdgkt"
                label="Biên bản ĐGKT"
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
                id="search_content"
                name="content"
                label="Nội dung công tác"
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
            <div className="field-search">
              <FormControl fullWidth variant="filled">
                <InputLabel htmlFor="status">Trạng thái</InputLabel>
                <Select
                  fullWidth
                  native
                  value={dataSearch.status}
                  onChange={this.handleSearch}
                  inputProps={{
                    name: 'status',
                    id: 'status',
                  }}
                >
                  <option value="ALL">Tất cả</option>
                  <option value="START">START</option>
                  <option value="READY">READY</option>
                  <option value="IN PROGRESS">IN PROGRESS</option>
                  <option value="INPRG NO TOOL">INPRG NO TOOL</option>
                  <option value="INPRG HAVE TOOL">INPRG HAVE TOOL</option>
                  <option value="COMPLETE">COMPLETE</option>
                  <option value="CLOSE">CLOSE</option>
                </Select>
              </FormControl>
            </div>
          </div>
          <Grid className={classes.dataTable}>
            <DataTable
              noHeader={true}
              keyField={'_id'}
              columns={columnsGrid}
              data={this.genData(bbdgkts)}
              striped={true}
              pagination
              paginationServer
              paginationDefaultPage={pagination.page}
              paginationPerPage={pagination.rowPerPage}
              paginationRowsPerPageOptions={pagination.rowPerPageOption}
              paginationTotalRows={BbdgktsTotal}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
          {this.renderRedirect()}
        </div>
      </Fragment>
    );
  }
  genData = (bbdgkts) => {
    let { user } = this.props;
    console.log(bbdgkts)
    if (!user) return [];
    return bbdgkts.filter(bbdgkt => bbdgkt.userId)
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    bbdgkts: state.bbdgkts.bbdgkts,
    bbdgktsTotal: state.bbdgkts.total,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    bbdgktActionCreator: bindActionCreators(bbdgktActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Bbdgkts);