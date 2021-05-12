import React, { Component } from 'react';
import { withStyles, Grid, Button, FormControl, InputLabel, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as modalActions from '../../actions/modal';
import * as cgsatActions from '../../actions/cgsatActions';
import * as customerActions from '../../actions/customerActions';
import Alert from '@material-ui/lab/Alert';

import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import styles from './style';
import renderTextField from '../../components/FormHelper/TextField';
import moment from 'moment';
import { ConsoleWriter } from 'istanbul-lib-report';

class CgsatForm extends Component {
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
    const { cgsatActionsCreator, cgsatEditting, user } = this.props;
    const { addCgsat, updateCgsat } = cgsatActionsCreator;
    const { WO, PCT, timeChange, note } = data;
    const newCgsat = {
      ...(cgsatEditting || {}),
      WO,
      PCT,
      timeChange,
      note: note || '',
      userId: user._id,
    }
    if (cgsatEditting) {
      // newCgsat.PCT = cgsatEditting.PCT
      // newCgsat.WO = cgsatEditting.WO
       newCgsat.userId = cgsatEditting.userId
      // newCgsat.timeChange = cgsatEditting.timeChange
      // newCgsat.note = cgsatEditting.note
      if (user.admin || newCgsat.userId._id === user._id) {
        updateCgsat(newCgsat);
      }
    } else {
      addCgsat(newCgsat);
    }
  };
  handleChangeCustomer = (event) => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  };
  rendercgsatFail = () => {
    const { msgError } = this.state;
    console.log(msgError);
    let xhtml = null;
    xhtml = msgError ? (<Alert variant="standard" severity="error">
      {msgError}
    </Alert>) : null
    return xhtml;
  }
  render() {
    var {
      classes,
      modalActionsCreator,
      handleSubmit,
      invalid,
      submitting,

      initialValues
    } = this.props;

    const { hideModal } = modalActionsCreator;
    return (
      <form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <Grid container className={classes.form}>

          <Grid item md={12}>
            <Field
              id="WO"
              name="WO"
              label="Work cgsat"
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid item md={12}>
            <Field
              id="PCT"
              name="PCT"
              label="Tại PCT"
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          {
            initialValues.WO ?
              <Grid style={{ fontSize: "16px", paddingTop: "16px" }} item md={12}>
                <label>Phiếu Thay Đổi GSAT: {initialValues.PCGSAT}</label>
              </Grid>
              : <></>
          }
          <Grid item md={12}>
            <Field
              id="timeChange"
              name="timeChange"
              label="Thời gian thay đổi"
              type="datetime-local"
              //type="date"
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid item md={12}>
            <Field
              id="note"
              name="note"
              label="Ghi chú"
              multiline
              rowsMax={4}
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          {
          }
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            {this.rendercgsatFail()}
            <Button onClick={hideModal}>Hủy</Button>
            <Button disabled={invalid || submitting} type="submit">
              Lưu
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

CgsatForm.propTypes = {
  customerId: PropTypes.string,
  product: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    cgsatEditting: state.cgsats.cgsat,
    initialValues: {
      WO: state.cgsats.cgsat ? state.cgsats.cgsat.WO : null,
      PCT: state.cgsats.cgsat ? state.cgsats.cgsat.PCT : null,
      PCGSAT: state.cgsats.cgsat ? state.cgsats.cgsat.PCGSAT : null,
      note: state.cgsats.cgsat ? state.cgsats.cgsat.note : '',
      timeChange: state.cgsats.cgsat ? moment(state.cgsats.cgsat.timeChange).format('YYYY-MM-DDTHH:mm:SS') : moment(Date.now()).format('YYYY-MM-DDThh:mm:ss'),
    },
    customers: state.customers ? state.customers.customers : [],
    user: state.auth.user,
    msgError: state.error.msg
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    cgsatActionsCreator: bindActionCreators(cgsatActions, dispatch),
    customerActionCreator: bindActionCreators(customerActions, dispatch)
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const FORM_NAME = 'cgsat_MANAGEMENT';
const withReduxForm = reduxForm({
  form: FORM_NAME,
  validate,
});
export default compose(
  withStyles(styles),
  withConnect,
  withReduxForm,
)(CgsatForm);
