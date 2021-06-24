import React, { Component } from 'react';
import { withStyles, Grid, Button, FormControl, InputLabel, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as modalActions from '../../actions/modal';
import * as bbdgktActions from '../../actions/bbdgktActions';
import * as customerActions from '../../actions/customerActions';
import Alert from '@material-ui/lab/Alert';

import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import styles from './style';
import renderTextField from '../../components/FormHelper/TextField';
import moment from 'moment';
import { ConsoleWriter } from 'istanbul-lib-report';

class BbdgktForm extends Component {
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
    const { bbdgktActionsCreator, bbdgktEditting, user } = this.props;
    const { addBbdgkt, updateBbdgkt } = bbdgktActionsCreator;
    const { WO, content, time, note } = data;
    const newBbdgkt = {
      ...(bbdgktEditting || {}),
      WO,
      content,
      time,
      note: note || '',
      userId: user._id,
      group: user.group,
    }
    if (bbdgktEditting) {
      // newBbdgkt.PCT = bbdgktEditting.PCT
      // newBbdgkt.WO = bbdgktEditting.WO
       newBbdgkt.userId = bbdgktEditting.userId
      // newBbdgkt.timeChange = bbdgktEditting.timeChange
      // newBbdgkt.note = bbdgktEditting.note
      if (user.admin || newBbdgkt.userId._id === user._id) {
        updateBbdgkt(newBbdgkt);
      }
    } else {
      addBbdgkt(newBbdgkt);
    }
  };
  handleChangeCustomer = (event) => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  };
  renderbbdgktFail = () => {
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
              label="Work Order"
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
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          {
            initialValues.WO ?
              <Grid style={{ fontSize: "16px", paddingTop: "16px" }} item md={12}>
                <label>Số Biên Bản ĐGKT: {initialValues.BBDGKT}</label>
              </Grid>
              : <></>
          }
          <Grid item md={12}>
            <Field
              id="time"
              name="time"
              label="Ngày thực hiện"
              type="date"
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
            {this.renderbbdgktFail()}
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

BbdgktForm.propTypes = {
  customerId: PropTypes.string,
  product: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    bbdgktEditting: state.bbdgkts.bbdgkt,
    initialValues: {
      WO: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.WO : null,
      content: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.content : null,
      BBDGKT: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.BBDGKT : null,
      note: state.bbdgkts.bbdgkt ? state.bbdgkts.bbdgkt.note : '',
      time: state.bbdgkts.bbdgkt ? moment(state.bbdgkts.bbdgkt.time).format('YYYY-MM-DD') : moment(Date.now()).format('YYYY-MM-DD'),
    },
    customers: state.customers ? state.customers.customers : [],
    user: state.auth.user,
    msgError: state.error.msg
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    bbdgktActionsCreator: bindActionCreators(bbdgktActions, dispatch),
    customerActionCreator: bindActionCreators(customerActions, dispatch)
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const FORM_NAME = 'bbdgkt_MANAGEMENT';
const withReduxForm = reduxForm({
  form: FORM_NAME,
  validate,
});
export default compose(
  withStyles(styles),
  withConnect,
  withReduxForm,
)(BbdgktForm);
