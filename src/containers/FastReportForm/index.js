import React, { Component, Fragment } from 'react';
import { withStyles, Grid, Button, Typography, Menu, MenuItem, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as modalActions from '../../actions/modal';
import * as FastReportActions from '../../actions/fastReportActions';
import * as customerActions from '../../actions/customerActions';
import * as imageActions from '../../actions/imageActions';
import Alert from '@material-ui/lab/Alert';

import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import styles from './style';
import renderTextField from '../../components/FormHelper/TextField';
import moment from 'moment';
import { ConsoleWriter } from 'istanbul-lib-report';
import DropzoneDialog from '../../components/DropzoneDialog';
const menuId = 'primary-search-account-menu';
class FastReportForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSearch: true,
      openSelectCustomer: false,
      nameCustomer: '',
      userIdSelect: '',
      msgError: ''
    }
  }
  //@check login success adn error
  componentDidUpdate(nextprops) {
    const { msgError } = this.props;

    // if (isAuthenticated !== nextprops.isAuthenticated) {
    //   if (isAuthenticated) {
    //     history.push('/admin/fastReport');
    //   }
    // }
    if (msgError !== nextprops.msgError) {
      this.setState({
        msgError
      })
    }
  }
  componentDidMount() {
    const { customerActionCreator } = this.props;
    const { listAllCustomers } = customerActionCreator;
    listAllCustomers();
  }
  handleSubmitForm = (data) => {
    const { fastReportActionsCreator, fastReportEditting, user, images } = this.props;
    // const { userIdSelect } = this.state;
    const { addFastReport, updateFastReport } = fastReportActionsCreator;
    const { WO, timeStart, timeStop, content, location, KKS, error, result, employ, time, imageError, imageSuccess } = data;
    const newFastReport = {
      ...(fastReportEditting || {}),
      WO,
      timeStart,
      timeStop,
      location,
      KKS,
      userId: user._id,
      status: 'START',
      statusTool: 'START',
      content: content || '',
      error,
      result,
      employ,
      time,
      images,
    }
    console.log(data)
    console.log(newFastReport)
    console.log(fastReportEditting)
    if (fastReportEditting) {
      newFastReport.PCT = fastReportEditting.PCT
      newFastReport.toolId = fastReportEditting.toolId
      newFastReport.userId = fastReportEditting.userId
      newFastReport.status = fastReportEditting.status
      newFastReport.statusTool = fastReportEditting.statusTool
      if (user.admin || newFastReport.userId._id === user._id) {
        updateFastReport(newFastReport);
      }
    } else {
      newFastReport.status = 'START'
      newFastReport.statusTool = 'START'
      addFastReport(newFastReport);
    }
  };
  handleChangeCustomer = (event) => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  };
  renderToolImages = () => {
    let { images } = this.props;
    let xhtml = null;
    //console.log(link.webViewLink);
    if (images.length > 0) {
      xhtml = images.map((image, index) => {
        console.log(image)
        return <Grid item key={image.id} >
          <Paper>
            <img
              //src={`${API_ENDPOINT}/api/upload/image/${image.filename}`}
              src={`https://drive.google.com/uc?export=view&id=${image.idImage}`}
              // alt={image.name}
              // className={classes.picture}
              data-filename={image.idImage}
              onClick={this.onClickPicture}
            />
          </Paper>
        </Grid>
      })
    }
    return xhtml;
  };
  onClickPicture = (event) => {
    console.log(event.currentTarget.dataset.filename)
    this.setState({
      anchorEl: event.currentTarget,
      filename: event.currentTarget.dataset.filename,
    });
  };

  cancelSelectImage = () => {
    this.setState({
      anchorEl: null,
    });
  };
  deleteImage = () => {
    const { imageActionsCreator, images } = this.props;
    const { deleteImage } = imageActionsCreator;
    const { filename } = this.state;
    console.log(filename)
    deleteImage(filename);
    this.setState({
      anchorEl: null,
    });
  }


  renderDetailPicture = () => {
    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        {/* <MenuItem onClick={this.deleteImage}>Xóa</MenuItem> */}
        <MenuItem onClick={this.deleteImage}>Hủy bỏ</MenuItem>
      </Menu>
    );
  };


  renderFastReportFail = () => {
    const { msgError } = this.state;
    console.log(msgError);
    let xhtml = null;
    xhtml = msgError ? (<Alert variant="standard" severity="error">
      {msgError}
    </Alert>) : null
    return xhtml;
  }
  render() {
    const {
      classes,
      modalActionsCreator,
      handleSubmit,
      invalid,
      submitting,
      // customers,
      // user,
      initialValues
    } = this.props;

    const { hideModal } = modalActionsCreator;
    return (
      <Fragment>
        {this.renderDetailPicture()}
        <form onSubmit={handleSubmit(this.handleSubmitForm)}>
          <Grid container className={classes.form}>

            <Grid item md={12}>
              <Field
                id="WO"
                name="WO"
                label="Work FastReport"
                className={classes.TextField}
                margin="normal"
                component={renderTextField}
              ></Field>
            </Grid>
            <Grid item md={12}>
              <Field
                id="location"
                name="location"
                label="Địa điểm công tác"
                className={classes.TextField}
                margin="normal"
                component={renderTextField}
              ></Field>
            </Grid>
            <Grid item md={12}>
              <Field
                id="KKS"
                name="KKS"
                label="Hệ thống / KKS"
                className={classes.TextField}
                margin="normal"
                component={renderTextField}
              ></Field>
            </Grid>
            {
              initialValues.WO ?
                <Grid style={{ fontSize: "16px", paddingTop: "16px" }} item md={12}>
                  <label>PCT: {initialValues.PCT}</label>
                </Grid>
                : <></>
            }
            <Grid item md={12}>
              <Field
                id="timeStart"
                name="timeStart"
                label={initialValues.WO == null ? "Ngày bắt đầu dự kiến" : "Ngày bắt đầu thực tế"}
                type="date"
                className={classes.TextField}
                margin="normal"
                component={renderTextField}
              ></Field>
            </Grid>
            <Grid item md={12}>
              <Field
                id="timeStop"
                name="timeStop"
                label={initialValues.WO == null ? "Ngày kết thúc dự kiến" : "Ngày kết thúc thực tế"}
                type="date"
                className={classes.TextField}
                margin="normal"
                component={renderTextField}
              ></Field>
            </Grid>
            <Grid item md={12}>
              <Field
                id="content"
                name="content"
                label="Nội dung công tác"
                multiline
                rowsMax={4}
                className={classes.TextField}
                margin="normal"
                component={renderTextField}
              ></Field>
            </Grid>
            <Grid item md={12}>
              <Field
                id="error"
                name="error"
                label="Hiện tượng lỗi"
                multiline
                rowsMax={4}
                className={classes.TextField}
                margin="normal"
                component={renderTextField}
              ></Field>
            </Grid>
            <Grid item md={12}>
              <Grid item md={12}>
                <DropzoneDialog />
              </Grid>
            </Grid>
            <Grid item md={12} xs={12} className={classes.showImage}>
              <Grid item>
                <Typography variant="h6" >Hình ảnh hiện tượng lỗi</Typography>
              </Grid>
              <Grid container spacing={3} className={classes.showImage} >
                {this.renderToolImages()}
              </Grid>
            </Grid>
            <Grid item md={12}>
              <Field
                id="result"
                name="result"
                label="Cách khắc phục, kết quả"
                multiline
                rowsMax={4}
                className={classes.TextField}
                margin="normal"
                component={renderTextField}
              ></Field>
            </Grid>
            <Grid item md={12}>
              <Field
                id="employ"
                name="employ"
                label="Nhân sự"
                multiline
                rowsMax={4}
                className={classes.TextField}
                margin="normal"
                component={renderTextField}
              ></Field>
            </Grid>
            <Grid item md={12}>
              <Field
                id="time"
                name="time"
                label="Thời gian"
                multiline
                rowsMax={4}
                className={classes.TextField}
                margin="normal"
                component={renderTextField}
              ></Field>
            </Grid>
            {
              // user && user.admin && !initialValues.WO ?
              //   <Grid item md={12}>
              //     <FormControl className={classes.TextFieldCustomer}>
              //       <InputLabel htmlFor="age-native-simple">Người dùng</InputLabel>
              //       <Select
              //         native
              //         fullWidth
              //         value={userIdSelect}
              //         onChange={this.handleChangeCustomer}
              //         inputProps={{
              //           name: 'userIdSelect',
              //           id: 'userId',
              //         }}
              //       >
              //         <option aria-label="None" value="" />
              //         {
              //           customers.map((customer) => {
              //             return <option key={customer._id} value={customer._id}>{customer.name}</option>
              //           })
              //         }
              //       </Select>
              //     </FormControl>
              //   </Grid>
              //   : <></>
            }
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="flex-end"
            >

              {this.renderFastReportFail()}

              <Button onClick={hideModal}>Hủy</Button>
              <Button disabled={invalid || submitting} type="submit">
                Lưu
              </Button>
            </Grid>
          </Grid>
        </form>
      </Fragment>

    );
  }
}

FastReportForm.propTypes = {
  customerId: PropTypes.string,
  product: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    fastReportEditting: state.fastReports.fastReport,
    initialValues: {
      WO: state.fastReports.fastReport ? state.fastReports.fastReport.WO : null,
      PCT: state.fastReports.fastReport ? state.fastReports.fastReport.PCT : null,
      location: state.fastReports.fastReport ? state.fastReports.fastReport.location : null,
      KKS: state.fastReports.fastReport ? state.fastReports.fastReport.KKS : null,
      content: state.fastReports.fastReport ? state.fastReports.fastReport.content : '',
      error: state.fastReports.fastReport ? state.fastReports.fastReport.error : '',
      result: state.fastReports.fastReport ? state.fastReports.fastReport.result : '',
      employ: state.fastReports.fastReport ? state.fastReports.fastReport.employ : '',
      time: state.fastReports.fastReport ? state.fastReports.fastReport.time : '',
      timeStart: state.fastReports.fastReport ? moment(state.fastReports.fastReport.timeStart).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      timeStop: state.fastReports.fastReport ? moment(state.fastReports.fastReport.timeStop).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      image: state.fastReports.fastReport ? state.fastReports.fastReport.image : '',
    },
    customers: state.customers ? state.customers.customers : [],
    user: state.auth.user,
    msgError: state.error.msg,
    images: state.images.images,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    fastReportActionsCreator: bindActionCreators(FastReportActions, dispatch),
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    imageActionsCreator: bindActionCreators(imageActions, dispatch)
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const FORM_NAME = 'FASTREPORT_MANAGEMENT';
const withReduxForm = reduxForm({
  form: FORM_NAME,
  validate,
});
export default compose(
  withStyles(styles),
  withConnect,
  withReduxForm,
)(FastReportForm);
