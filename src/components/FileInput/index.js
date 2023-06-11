import React, { Component } from 'react';
// import { google } from 'googleapis';
import styles from './style';
import { withStyles } from '@material-ui/core';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import * as fileActions from '../../actions/fileActions';

class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: null,
        };
    }
    handleFileInputChange = (event) => {
        this.setState({ selectedFiles: event.target.files });
    };
    handleFileUpload = async () => {
        const { selectedFiles } = this.state;
        const { fileActionsCreator } = this.props;
        const { uploadFiles } = fileActionsCreator;
        console.log(selectedFiles)
        if (!selectedFiles) {
            console.error('No file selected');
            return;
        }
        if (selectedFiles.length > 0) {
            console.log('có file được chọn')
            uploadFiles(selectedFiles)
        }
    };

    render() {
        const { classes } = this.props;
        const { selectedFiles } = this.state;
        //console.log(selectedFiles)
        return (
            <div>
                <label htmlFor="file-input" className={classes.fileUpload}>
                    <input id="file-input" type="file" multiple onChange={this.handleFileInputChange} />
                </label>
                {selectedFiles && <p>{selectedFiles.length} file(s) selected</p>}
                <button onClick={this.handleFileUpload}> Tải lên </button>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        name: state.form.TOOL_MANAGEMENT ? state.form.TOOL_MANAGEMENT.values.name : null,
        kks: state.form.FASTREPORT_MANAGEMENT ? state.form.FASTREPORT_MANAGEMENT.values.KKS : null,
        files: state.fastReports.fastReport ? state.fastReports.fastReport.files : null,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fileActionsCreator: bindActionCreators(fileActions, dispatch),

    };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
    withStyles(styles),
    withConnect,
)(FileInput);


