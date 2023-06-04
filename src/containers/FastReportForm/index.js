import React, { Component, Fragment } from 'react';
import { withStyles, Grid, Button, Typography, Menu, MenuItem, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as modalActions from '../../actions/modal';
import * as FastReportActions from '../../actions/fastReportActions';
import * as customerActions from '../../actions/customerActions';
import * as imageActions from '../../actions/imageActions';
import * as fileActions from '../../actions/fileActions';
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
      msgError: '',
      imageInDB: []
    }
  }
  //@check login success adn error
  componentDidUpdate(nextprops) {
    const { msgError } = this.props;

    if (msgError !== nextprops.msgError) {
      this.setState({
        msgError
      })
    }
  }
  componentDidMount() {
    const { customerActionCreator, fastReportEditting } = this.props;
    const { listAllCustomers } = customerActionCreator;
    listAllCustomers();
    this.setState({
      imageInDB: fastReportEditting ? fastReportEditting.images : []
    })
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
      // newFastReport.PCT = fastReportEditting.PCT
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
    let { images, classes } = this.props;
    let xhtml = null;
    if (images) {
      if (images.length > 0) {
        xhtml = (
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {images.map((image, index) => (
              <div key={image.id} style={{ marginRight: '10px' }} >
                <img
                  src={`https://drive.google.com/uc?export=view&id=${image.idImage}`}
                  data-filename={image.idImage}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onClick={this.onClickPicture}
                />
              </div>
            ))}
          </div>
        );
      }
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
        <MenuItem onClick={this.deleteImage}>Xóa</MenuItem>
        <MenuItem onClick={this.cancelSelectImage}>Hủy bỏ</MenuItem>
      </Menu>
    );
  };
  compareArrays = (arr1, arr2) => {
    const differentElements = [];

    // Tìm các phần tử không giống nhau giữa hai mảng
    for (let i = 0; i < arr1.length; i++) {
      if (!arr2.includes(arr1[i])) {
        differentElements.push(arr1[i]);
      }
    }

    for (let i = 0; i < arr2.length; i++) {
      if (!arr1.includes(arr2[i])) {
        differentElements.push(arr2[i]);
      }
    }

    return differentElements;
  }

  renderFastReportFail = () => {
    const { msgError } = this.state;
    console.log(msgError);
    let xhtml = null;
    xhtml = msgError ? (<Alert variant="standard" severity="error">
      {msgError}
    </Alert>) : null
    return xhtml;
  }
  notSave = () => {
    const { modalActionsCreator, images, imageActionsCreator } = this.props;
    const { deleteImage } = imageActionsCreator;
    const { imageInDB } = this.state;
    console.log(imageInDB);
    let imageDif = []
    const { hideModal } = modalActionsCreator;
    imageDif = this.compareArrays(imageInDB, images)
    console.log(imageDif)
    // Loop through imageDif and delete images
    imageDif.forEach((image) => {
      deleteImage(image.idImage); // Assuming deleteImage takes an image as an argument
    });

    hideModal();
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
      initialValues,
      fastReportEditting
    } = this.props;


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
            {
              fastReportEditting ?
                <Fragment>
                  <Grid item md={12}>
                    <Grid item md={12}>
                      <DropzoneDialog />
                    </Grid>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <Grid item>
                      <Typography variant="h6" >Hình ảnh hiện tượng lỗi</Typography>
                    </Grid>
                  </Grid>
                  {this.renderToolImages()}
                </Fragment>

                : <></>
            }

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
              <Button onClick={this.notSave}>Hủy</Button>
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
    fastReportEditting: state.fastReports.fastReport ? state.fastReports.fastReport : null,
    initialValues: {
      WO: state.fastReports.fastReport ? state.fastReports.fastReport.WO : null,
      PCT: state.fastReports.fastReport ? state.fastReports.fastReport.PCT : null,
      location: state.fastReports.fastReport ? state.fastReports.fastReport.location : null,
      KKS: state.fastReports.fastReport ? state.fastReports.fastReport.KKS : '',
      content: state.fastReports.fastReport ? state.fastReports.fastReport.content : '',
      error: state.fastReports.fastReport ? state.fastReports.fastReport.error : '',
      result: state.fastReports.fastReport ? state.fastReports.fastReport.result : '',
      employ: state.fastReports.fastReport ? state.fastReports.fastReport.employ : '',
      time: state.fastReports.fastReport ? state.fastReports.fastReport.time : '',
      timeStart: state.fastReports.fastReport ? moment(state.fastReports.fastReport.timeStart).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      timeStop: state.fastReports.fastReport ? moment(state.fastReports.fastReport.timeStop).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      image: state.fastReports.fastReport ? state.fastReports.fastReport.image : '',
      files: state.fastReports.fastReport ? state.fastReports.fastReport.files : '',
    },
    customers: state.customers ? state.customers.customers : [],
    user: state.auth.user,
    msgError: state.error.msg,
    images: state.images.images
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    fastReportActionsCreator: bindActionCreators(FastReportActions, dispatch),
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    imageActionsCreator: bindActionCreators(imageActions, dispatch),
    fileActionsCreator: bindActionCreators(fileActions, dispatch),
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
