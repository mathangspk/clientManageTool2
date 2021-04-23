import React, { Component } from 'react';
import { withStyles, Grid, Button, FormControl, InputLabel, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as modalActions from '../../actions/modal';
import * as cchttActions from '../../actions/cchttActions';
import * as customerActions from '../../actions/customerActions';
import Alert from '@material-ui/lab/Alert';

import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import styles from './style';
import renderTextField from '../../components/FormHelper/TextField';
import moment from 'moment';
import { ConsoleWriter } from 'istanbul-lib-report';

class CchttForm extends Component {
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
    //     history.push('/admin/cchtt');
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
    const { cchttActionsCreator, cchttEditting, user } = this.props;
    console.log(user)
    const { addCchtt, updateCchtt } = cchttActionsCreator;
    const { WO, PCT, timeChange, note } = data;
    console.log(data)
    const newcchtt = {
      ...(cchttEditting || {}),
      WO,
      PCT,
      timeChange,
      note: note || '',
      userId: user._id,
    }
    if (cchttEditting) {
      newcchtt.PCT = cchttEditting.PCT
      newcchtt.WO = cchttEditting.WO
      newcchtt.userId = cchttEditting.userId
      newcchtt.timeChange = cchttEditting.timeChange
      newcchtt.note = cchttEditting.note
      if (user.admin || newcchtt.userId._id === user._id) {
        updateCchtt(newcchtt);
      }
    } else {
      addCchtt(newcchtt);
    }
  };
  handleChangeCustomer = (event) => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  };
  rendercchttFail = () => {
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
      // customers,
      // user,
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
              label="Work cchtt"
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
                <label>PCT: {initialValues.PCT}</label>
              </Grid>
              : <></>
          }
          <Grid item md={12}>
            <Field
              id="timeChange"
              name="timeChange"
              label="Thời gian thay đổi" 
              type="date"
              className={classes.TextField}
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

            {this.rendercchttFail()}

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

CchttForm.propTypes = {
  customerId: PropTypes.string,
  product: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    cchttEditting: state.cchtts.cchtt,
    initialValues: {
      WO: state.cchtts.cchtt ? state.cchtts.cchtt.WO : null,
      PCT: state.cchtts.cchtt ? state.cchtts.cchtt.PCT : null,
      note: state.cchtts.cchtt ? state.cchtts.cchtt.note : '',
      timeChange: state.cchtts.cchtt ? moment(state.cchtts.cchtt.timeChange).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      },
    customers: state.customers ? state.customers.customers : [],
    user: state.auth.user,
    msgError: state.error.msg
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    cchttActionsCreator: bindActionCreators(cchttActions, dispatch),
    customerActionCreator: bindActionCreators(customerActions, dispatch)
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const FORM_NAME = 'cchtt_MANAGEMENT';
const withReduxForm = reduxForm({
  form: FORM_NAME,
  validate,
});
export default compose(
  withStyles(styles),
  withConnect,
  withReduxForm,
)(CchttForm);
