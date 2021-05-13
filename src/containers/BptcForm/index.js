import React, { Component } from 'react';
import { withStyles, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as modalActions from '../../actions/modal';
import * as bptcActions from '../../actions/bptcActions';
import * as customerActions from '../../actions/customerActions';
import Alert from '@material-ui/lab/Alert';

import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import styles from './style';
import renderTextField from '../../components/FormHelper/TextField';
import renderSelectField from '../../components/FormHelper/Select';
import moment from 'moment';
import { ConsoleWriter } from 'istanbul-lib-report';

class BptcForm extends Component {
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
    const { bptcActionsCreator, bptcEditting, user } = this.props;
    const { addBptc, updateBptc } = bptcActionsCreator;
    const { content, note } = data;
    const newBptc = {
      ...(bptcEditting || {}),
      content,
      note: note || '',
      userId: user._id,
      group: user.group,
    }
    if (bptcEditting) {
      // newBptc.PCT = bptcEditting.PCT
      // newBptc.WO = bptcEditting.WO
      newBptc.userId = bptcEditting.userId
      // newBptc.timeChange = bptcEditting.timeChange
      // newBptc.note = bptcEditting.note
      if (user.admin || newBptc.userId._id === user._id) {
        updateBptc(newBptc);
      }
    } else {
      addBptc(newBptc);
    }
  };
  handleChangeCustomer = (event) => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  };
  renderbptcFail = () => {
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
              id="content"
              name="content"
              label="Nội dung công tác"
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          {
            initialValues.BPTC ?
              <div>
                <Grid style={{ fontSize: "16px", paddingTop: "16px" }} item md={12}>
                  <label>Số Biện Pháp Thi Công: {initialValues.BPTC}</label>
                </Grid>
                <Grid style={{ fontSize: "16px", paddingTop: "16px", paddingBottom: "16px" }} item md={12}>
                  <label>Số JSA: {initialValues.JSA}</label>
                </Grid></div>

              : <></>
          }
          <Grid item md={12}>
            <Field
              id="note"
              name="note"
              component={renderSelectField}
              label="Ghi chú"
              className={classes.TextField}
            >
              <option value="" />
              <option value={'Cà Mau 1'}>Cà Mau 1</option>
              <option value={'Cà Mau 2'}>Cà Mau 2</option>
            </Field>
          </Grid>
          {
          }
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            {this.renderbptcFail()}
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

BptcForm.propTypes = {
  customerId: PropTypes.string,
  product: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    bptcEditting: state.bptcs.bptc,
    initialValues: {
      content: state.bptcs.bptc ? state.bptcs.bptc.content : null,
      BPTC: state.bptcs.bptc ? state.bptcs.bptc.BPTC : null,
      JSA: state.bptcs.bptc ? state.bptcs.bptc.JSA : null,
      note: state.bptcs.bptc ? state.bptcs.bptc.note : '',
    },
    customers: state.customers ? state.customers.customers : [],
    user: state.auth.user,
    msgError: state.error.msg
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    bptcActionsCreator: bindActionCreators(bptcActions, dispatch),
    customerActionCreator: bindActionCreators(customerActions, dispatch)
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const FORM_NAME = 'bptc_MANAGEMENT';
const withReduxForm = reduxForm({
  form: FORM_NAME,
  validate,
});
export default compose(
  withStyles(styles),
  withConnect,
  withReduxForm,
)(BptcForm);
