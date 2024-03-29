import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as fastReportActions from '../../actions/fastReportActions';
import * as modalActions from '../../actions/modal';
import * as customerActions from '../../actions/customerActions';
import * as imageActions from '../../actions/imageActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import FastReportForm from '../FastReportForm';
import { Grid, withStyles, Fab, TextField, FormControl, InputLabel, Select, MenuItem, Input } from '@material-ui/core';
import { DeleteForever, Edit, Visibility, Lock } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { popupConfirm } from '../../actions/ui';

class FastReports extends Component {
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
        WO: '',
        PCT: '',
        userId: [],
        status: 'ALL'
      },
      columnsGrid: [
        {
          name: '', width: '100px', center: true,
          cell: (params) => {
            let { user } = this.props;
            let data = JSON.parse(JSON.stringify(params));
            let checkUser = (user.admin || user._id === params.userId._id);
            let checkVip = (user.vip)

            //console.log(user)
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
                checkUser ? (
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

                    {
                      checkVip && (
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
                      )
                    }
                  </>
                ) : <></>
              }
            </>
          }
        },
        { selector: 'WO', name: 'Work FastReport', width: '120px', sortable: true, center: true },
        // { selector: 'PCT', name: 'PCT', width: '120px', sortable: true, center: true },
        { selector: 'userId.name', name: 'Tạo bởi', width: '180px', sortable: true },
        // {
        //   selector: 'status', name: 'Trạng thái', width: '160px', sortable: true, center: true,
        //   cell: (param) => {
        //     let { user } = this.props;
        //     let checkPkt = (user.pkt);
        //     return <>
        //       <div className={'lb-status color-' + param.status.toLowerCase().split(' ').join('-')}>
        //         {param.status}
        //       </div>
        //       {/* { checkPkt && param.status === "COMPLETE" ? <>&nbsp; 
        //       <Fab
        //         color="default"
        //         aria-label="Đóng WO"
        //         size='small'
        //         onClick={() => {
        //           this.onCloseWo(param)
        //         }}
        //       >
        //         <Lock color="primary" />
        //       </Fab> </> : <></>} */}
        //     </>
        //   }
        // },
        { selector: 'location', name: 'Địa điểm công tác', width: '150px' },
        { selector: 'KKS', name: 'Hệ thống/KKS', width: '150px' },
        { selector: 'content', name: 'Nội dung công tác', width: '500px' },
        {
          selector: 'timeStart', name: 'Ngày bắt đầu', width: '130px', sortable: true, center: true,
          cell: (params) => moment(params.timeStart).format('DD/MM/YYYY')
        },
        {
          selector: 'timeStop', name: 'Ngày kết thúc', width: '130px', sortable: true, center: true,
          cell: (params) => moment(params.timeStop).format('DD/MM/YYYY')
        },

        { selector: 'userId.department', name: 'Phân xưởng', width: '150px', sortable: true },
      ]
    }
  }
  renderRedirect = () => {
    if (this.state.redirect && this.state.idRedirect) {
      let tool = '/admin/fastReport-detail/' + this.state.idRedirect;
      return <Redirect to={tool} />
    }
  }
  componentDidMount() {
    const { fastReportActionCreator, customerActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchFastReport } = fastReportActionCreator;
    const { listAllCustomers } = customerActionCreator;
    let params = JSON.parse(JSON.stringify(dataSearch));
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    searchFastReport(params);
    listAllCustomers();
  }
  onClickDelete = (fastReport) => {
    let { user } = this.props;
    const { dataSearch } = this.state;
    if (!user.admin && user._id !== fastReport.userId._id) return;
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn xóa Work FastReport này?",
      ifOk: () => {
        const { fastReportActionCreator } = self.props;
        const { deleteFastReport } = fastReportActionCreator;
        let params = JSON.parse(JSON.stringify(dataSearch))
        deleteFastReport(fastReport, params);
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
    const { fastReportActionCreator, user } = this.props;
    const { updateFastReport } = fastReportActionCreator;
    const newFastReport = JSON.parse(JSON.stringify(data));
    switch (newFastReport.status) {
      case 'COMPLETE':
        if (user.pkt) {
          newFastReport.status = 'CLOSE'
        }
        break;
      default:
        break;
    }
    updateFastReport(newFastReport);
  };
  onClickEdit = (data) => {
    const { fastReportActionCreator, modalActionsCreator, user, imageActionsCreator } = this.props;
    const { setFastReportEditing } = fastReportActionCreator;
    const { uploadImagesSuccess } = imageActionsCreator;
    if (!user.admin && user._id !== data.userId._id) return;
    uploadImagesSuccess(data.images);
    setFastReportEditing(data);
    console.log(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Work FastReport');
    changeModalContent(<FastReportForm />);
  }
  // handleSearch = (event) => {
  //   const { name, value } = event.target;
  //   const { fastReportActionCreator, customers } = this.props;
  //   const { pagination, dataSearch } = this.state;
  //   const { searchFastReport } = fastReportActionCreator;

  //   let selectedUserIds = [];
  //   let users = customers;

  //   let search = {
  //     ...dataSearch,
  //     skip: 0,
  //     limit: pagination.rowPerPage,
  //   };

  //   if (name === "userId") {
  //     if (value.length > 0) {
  //       console.log(value);
  //       selectedUserIds = users
  //         .filter(user => value.includes(user.group))
  //         .map(user => user._id);
  //     }
  //     search[name] = selectedUserIds;
  //   } else {
  //     search[name] = value;
  //   }

  //   console.log(search);

  //   this.setState({ dataSearch: search });
  //   searchFastReport(search);
  // };


  handleSearch = (event) => {
    const { name, value } = event.target;
    const { fastReportActionCreator, customers } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchFastReport } = fastReportActionCreator;

    let selectedUserIds = [];
    let users = customers;

    let search = {
      ...dataSearch,
      skip: 0,
      limit: pagination.rowPerPage,
    };

    if (name === "userId") {
      if (value.length > 0 && users.some(user => user._id === value[0])) {
        search[name] = value;
      } else {
        console.log(value);
        selectedUserIds = users
          .filter(user => value.includes(user.group) || value.includes(user.department))
          .map(user => user._id);
        search[name] = selectedUserIds;
      }
    } else {
      search[name] = value;
      if (name === "group") {
        search["userId"] = [];
      }
    }

    console.log(search);

    this.setState({ dataSearch: search });
    searchFastReport(search);
  };



  handleChangePage = (page, total) => {
    const { fastReportActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchFastReport } = fastReportActionCreator;
    pagination.page = page;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchFastReport(params);
  }
  handleChangeRowsPerPage = (rowPerPage, total) => {
    const { fastReportActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchFastReport } = fastReportActionCreator;
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
    searchFastReport(params);
  }

  render() {
    const { fastReports, customers, fastReportsTotal, classes } = this.props;
    const { columnsGrid, pagination, dataSearch } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_WO"
                name="wo"
                label="Work FastReport"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <FormControl fullWidth className="multiple-select">
                <InputLabel className="lb-user" id="lb-user">Tổ</InputLabel>
                <Select
                  labelId="lb-user"
                  id="userId"
                  className="sl-user"
                  //multiple
                  value={dataSearch.userId}
                  onChange={this.handleSearch}
                  inputProps={{
                    name: 'userId',
                    id: 'userId',
                  }}
                  input={<Input />}
                >
                  {customers && Array.from(new Set(customers.map(customers => customers.group))).map(group => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="field-search">
              <FormControl fullWidth className="multiple-select">
                <InputLabel className="lb-user" id="lb-user">Phân xưởng</InputLabel>
                <Select
                  labelId="lb-user"
                  id="userId"
                  className="sl-user"
                  //multiple
                  value={dataSearch.userId}
                  onChange={this.handleSearch}
                  inputProps={{
                    name: 'userId',
                    id: 'userId',
                  }}
                  input={<Input />}
                >
                  {customers && Array.from(new Set(customers.map(customers => customers.department))).map(department => (
                    <MenuItem key={department} value={department}>
                      {department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="field-search">
              <FormControl fullWidth className="multiple-select">
                <InputLabel className="lb-user" id="lb-user">Tạo bởi</InputLabel>
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
              <TextField
                fullWidth
                id="search_kks"
                name="kks"
                label="KKS"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_date_from"
                name="dateFrom"
                label="Từ ngày"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_date_to"
                name="dateTo"
                label="Đến ngày"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            {/* <div className="field-search">
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
            </div> */}
          </div>
          <Grid className={classes.dataTable}>
            <DataTable
              noHeader={true}
              keyField={'_id'}
              columns={columnsGrid}
              data={this.genData(fastReports)}
              striped={true}
              pagination
              paginationServer
              paginationDefaultPage={pagination.page}
              paginationPerPage={pagination.rowPerPage}
              paginationRowsPerPageOptions={pagination.rowPerPageOption}
              paginationTotalRows={fastReportsTotal}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
          {this.renderRedirect()}
        </div>
      </Fragment>
    );
  }
  genData = (fastReports) => {
    let { user } = this.props;
    if (!user) return [];
    return fastReports.filter(fastReport => fastReport.userId)
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    fastReports: state.fastReports.fastReports,
    fastReportsTotal: state.fastReports.total,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    fastReportActionCreator: bindActionCreators(fastReportActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    imageActionsCreator: bindActionCreators(imageActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(FastReports);