import React, { Component } from 'react';
import styles from './style';
import Resizer from 'react-image-file-resizer';
import { withStyles } from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';
import { limitSizeImage } from '../../constants';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import imageCompression from 'browser-image-compression';
import * as imageActions from '../../actions/imageActions';
//import sharp from 'sharp';

var resizeImage = function (settings) {
    var file = settings.file;
    var maxSize = settings.maxSize;
    var reader = new FileReader();
    var image = new Image();
    var canvas = document.createElement('canvas');
    var dataURItoBlob = function (dataURI) {
        var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
            atob(dataURI.split(',')[1]) :
            unescape(dataURI.split(',')[1]);
        var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var max = bytes.length;
        var ia = new Uint8Array(max);
        for (var i = 0; i < max; i++)
            ia[i] = bytes.charCodeAt(i);
        return new Blob([ia], { type: mime });
    };
    var resize = function () {
        var width = image.width;
        var height = image.height;
        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');
        return dataURItoBlob(dataUrl);
    };
    return new Promise(function (ok, no) {
        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }
        reader.onload = function (readerEvent) {
            image.onload = function () { return ok(resize()); };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
};

class DropzoneDialogExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            files: [],
            listFile: [],
            nameTool: null
        };
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    handleSave(files) {
        //Saving files to state for further use and closing Modal.
        this.setState({
            files: files,
            open: false,
        });

        const { imageActionsCreator } = this.props;
        const { uploadImages, uploadImagesSuccess } = imageActionsCreator;
        console.log('dropzone submit')
        if (this.state.listFile && this.state.listFile.length > 0) {
            var { listFile } = this.state;

            uploadImages(listFile[listFile.length - 1]);
            this.setState({
                listFile: []
            })
        } else {
            alert('Vui long chon anh ...')
        }
    }
    handleOpen = () => {
        this.setState({
            open: true,
        });
    }

    async compressImage(_image) {
        // return new Promise(async (resolve, reject) => {
        const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 3000,
            useWebWorker: true,
            fileType: 'image/*'
        }
        try {
            const compressedFile = await imageCompression(_image, options);
            return compressedFile
        } catch (error) {
            console.log(error);
        }
        // })
    }


    onChange = async (image) => {
        const { name, kks } = this.props;
        const width = 800;
        const height = 600;
        const quality = 80;
        console.log(kks)
        let arrayImage = [];
        // Read in file
        for (let i = 0; i < image.length; i++) {
            var fileCompress = await this.compressImage(image[i])

            console.log(kks)
            //var fileFinal = new File([fileCompress], image[i].name, { type: image[i].type, lastModified: Date.now() });
            if (name) var fileFinal = new File([fileCompress], `${name}.jpg`, { type: image[i].type, lastModified: Date.now() });
            if (kks) var fileFinal = new File([fileCompress], `${kks}.jpg`, { type: image[i].type, lastModified: Date.now() });

            // await promise.then(async function (result) {
            //     await arrayImage.push(result);
            // })
            arrayImage.push(fileFinal);
        }
        //@ after resize image success
        console.log(arrayImage);
        console.log("upload resized image")
        this.setState({
            listFile: [...this.state.listFile, [arrayImage]]
        })
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button className={classes.button} onClick={this.handleOpen}>
                    add images
                </Button>
                <DropzoneDialog
                    dialogTitle="Tải ảnh lên"
                    open={this.state.open}
                    onSave={this.handleSave.bind(this)}
                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                    showPreviews={true}
                    maxFileSize={10000000}
                    onChange={this.onChange}
                    onClose={this.handleClose.bind(this)}
                />
            </div >
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        name: state.form.TOOL_MANAGEMENT ? state.form.TOOL_MANAGEMENT.values.name : null,
        kks: state.form.FASTREPORT_MANAGEMENT ? state.form.FASTREPORT_MANAGEMENT.values.KKS : null,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        imageActionsCreator: bindActionCreators(imageActions, dispatch),
    };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
    withStyles(styles),
    withConnect,
)(DropzoneDialogExample);


