import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as thongkeActions from '../../actions/thongkeActions';
import * as modalActions from '../../actions/modal';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, Fab, TextField, FormControl, InputLabel, Select, MenuItem, Input } from '@material-ui/core';
import { DeleteForever, Edit, Visibility, Lock } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { popupConfirm } from '../../actions/ui';

class ThongKes extends Component {
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
        {selector: 'status', name: 'Trạng Thái', width: '200px', sortable: true, center: true},
        { selector: 'KN', name: 'Kiểm Nhiệt', width: '200px', sortable: true, center: true },
        { selector: 'TD', name: 'Tự Động', width: '200px', sortable: true, center: true },
        { selector: 'MT', name: 'Máy Tĩnh', width: '200px', sortable: true, center: true },
        { selector: 'MD', name: 'Máy Động', width: '200px', sortable: true, center: true },
        { selector: 'HRSGBOP', name: 'HRSG-BOP', width: '200px', sortable: true, center: true },
        { selector: 'TBP', name: 'TBP', width: '200px', sortable: true, center: true },
        { selector: 'TB', name: 'Turbine', width: '200px', sortable: true, center: true },
      ]
    }
  }
  componentDidMount() {
    const { thongkeActionCreator, customerActionCreator } = this.props;
    const { pagination, dataSearch, thongkes } = this.state;
    const { searchThongke } = thongkeActionCreator;
    const { listAllCustomers } = customerActionCreator;
    let params = JSON.parse(JSON.stringify(dataSearch));
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    searchThongke(params);
    listAllCustomers();
  }

  handleSearch = (event) => {
    const { thongkeActionCreator } = this.props;
    const { pagination, dataSearch, thongkes } = this.state;
    const { searchThongke } = thongkeActionCreator;
    let search = {
      ...dataSearch,
      skip: 0,
      limit: pagination.rowPerPage,
      [event.target.name]: event.target.value
    }
    this.setState({ dataSearch: search });
    searchThongke(search);
  }
  handleChangePage = (page, total) => {
    const { thongkeActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchThongke } = thongkeActionCreator;
    pagination.page = page;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchThongke(params);
  }
  handleChangeRowsPerPage = (rowPerPage, total) => {
    const { thongkeActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchThongke } = thongkeActionCreator;
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
    searchThongke(params);
  }

  render() {
    const { thongkes, customers, ThongKeTotal, classes } = this.props;
    const { columnsGrid, pagination, dataSearch } = this.state;
    return (
      <Fragment>
         <div className={classes.content}>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_pct"
                name="pct"
                label="PCT"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
          </div>
        <Grid className={classes.dataTable}>
          <DataTable
            noHeader={true}
            keyField={'_id'}
            columns={columnsGrid}
            data={this.genData(thongkes)}
            striped={true}
            pagination
            paginationServer
            paginationDefaultPage={pagination.page}
            paginationPerPage={pagination.rowPerPage}
            paginationRowsPerPageOptions={pagination.rowPerPageOption}
            paginationTotalRows={10}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Grid>
        </div>
      </Fragment>
    );
  }
  genData = (thongkes) => {
    //var jsonData = JSON.parse(thongkes)
    //console.log(thongkes)
    let { user } = this.props;
    if (!user) return [];
    return thongkes.filter(thongke => thongke)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    thongkes: state.thongkes.thongkes,
    thongkesTotal: state.thongkes.total,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    thongkeActionCreator: bindActionCreators(thongkeActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(ThongKes);