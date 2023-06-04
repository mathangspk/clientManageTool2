import React, { Component, Fragment, } from 'react';
import { connect } from 'react-redux';
import * as fastReportActions from '../../actions/fastReportActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import * as imageActions from '../../actions/imageActions';
import * as fileActions from '../../actions/fileActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, Fab, TextField, FormControl, Button, Table } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import { DeleteForever, ArrowBackIos, Edit, KeyboardReturn, Add } from '@material-ui/icons';
import CancelIcon from '@material-ui/icons/Cancel';
import DataTable from 'react-data-table-component';
import { API_ENDPOINT as URL } from '../../constants';
import FastReportForm from '../FastReportForm';
import moment from 'moment';
import { popupConfirm, popupConfirmYesNo } from '../../actions/ui';
import ImageGallery from 'react-image-gallery';
import { Multiselect } from 'multiselect-react-dropdown';
import { AlignmentType, Document, BfastReportStyle, HeadingLevel, Packer, Paragraph, TabStopPosition, TabStopType, TextRun, Table as TableD, TableCell as TableCellD, TableRow as TableRowD, WidthType, convertInchesToTwip } from 'docx';
import { saveAs } from "file-saver";
import FileInput from '../../components/FileInput';
import "react-image-gallery/styles/css/image-gallery.css";

const PHONE_NUMBER = "02903 650140";
const PROFILE_URL = "https://www.pvps.vn";
const EMAIL = "info@pvps.vn";


class DocumentCreator {
  create([employees, workFastReportInfo, listTool]) {
    const document = new Document();

    document.addSection({
      children: [
        new Paragraph({
          text: "BIÊN BẢN BÀN GIAO CÔNG CỤ DỤNG CỤ",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER
        }),
        this.createContactInfo(PHONE_NUMBER, PROFILE_URL, EMAIL),
        new Paragraph("\n"),
        this.createHeading("Thông tin Work FastReport:"),
        ...workFastReportInfo
          .map((wo) => {
            const arr = [];
            arr.push(
              this.createInstitutionHeader(`WO: ${wo.WO}`, `PCT: ${wo.PCT}`),
            );
            arr.push(this.createRoleText(`Chỉ huy trực tiếp: ${wo.CHTT}`));
            return arr;
          })
          .reduce((prev, curr) => prev.concat(curr), []),
        new Paragraph("\n"),
        this.createHeading("Nhân viên nhóm công tác"),
        new Paragraph("\n"),
        this.createHeaderTableNV("STT", "HỌ VÀ TÊN"),

        ...employees
          .map((nv) => {
            const arr = [];
            arr.push(this.createContentTableNV(nv));
            return arr;
          })
          .reduce((prev, curr) => prev.concat(curr), []),
        new Paragraph("\n"),
        this.createHeading("Danh sách Công cụ dụng cụ mượn"),
        new Paragraph("\n"),
        this.createHeaderTable("STT", "TÊN CÔNG CỤ", "SỐ LƯỢNG"),

        ...listTool
          .map((tool) => {
            const arr = [];
            arr.push(this.createContentTableTool(tool));
            return arr;
          }).reduce((prev, curr) => prev.concat(curr), []),
        new Paragraph("\n"), new Paragraph("\n"), new Paragraph("\n"),
        //this.createInstitutionHeader("", "Ngày....tháng....năm......."),
        this.createInstitutionHeader("Bên Giao", "Bên nhận"),

        // this.createSubHeading("Skills"),
        // this.createSkillList(skills),
        // this.createSubHeading("Achievements"),
        // ...this.createAchivementsList(achivements),
        // this.createSubHeading("Interests"),
        // this.createInterests("Programming, Technology, Music Production, Web Design, 3D Modelling, Dancing."),
        // this.createHeading("References"),
        // new Paragraph(
        //   "Dr. Dean Mohamedally Director of Postgraduate Studies Department of Computer Science, University College London Malet Place, Bloomsbury, London WC1E d.mohamedally@ucl.ac.uk",
        // ),
        // new Paragraph("More references upon request"),
        // new Paragraph({
        //   text: "This CV was generated in real-time based on my Linked-In profile from my personal website www.dolan.bio.",
        //   alignment: AlignmentType.CENTER,
        // }),
      ],
    });

    return document;
  }

  createContactInfo(phoneNumber, profileUrl, email) {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun(`Phone: ${phoneNumber} | Website: ${profileUrl} | Email: ${email}`),
        new TextRun("Address: Khanh An commune, U Minh dis., Ca Mau province ").break(),
      ],
    });
  }

  createHeading(text) {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_3,
      thematicBreak: true,
    });
  }

  createSubHeading(text) {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2,
    });
  }

  createInstitutionHeader(institutionName, dateText) {
    return new Paragraph({
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX,
        },
      ],
      children: [
        new TextRun({
          text: institutionName,
          bold: true,
        }),
        new TextRun({
          text: `\t${dateText}`,
          bold: true,
        }),
      ],
    });
  }

  createRoleText(roleText) {
    return new Paragraph({
      children: [
        new TextRun({
          text: roleText,
          italics: true,
        }),
      ],
    });
  }

  createBullet(text) {
    return new Paragraph({
      text: text,
      bullet: {
        level: 0,
      },
    });
  }

  // tslint:disable-next-line:no-any
  createSkillList(skills) {
    return new Paragraph({
      children: [new TextRun(skills.map((skill) => skill.name).join(", ") + ".")],
    });
  }

  // tslint:disable-next-line:no-any
  createAchivementsList(achivements) {
    return achivements.map(
      (achievement) =>
        new Paragraph({
          text: achievement.name,
          bullet: {
            level: 0,
          },
        }),
    );
  }

  createInterests(interests) {
    return new Paragraph({
      children: [new TextRun(interests)],
    });
  }

  splitParagraphIntoBullets(text) {
    return text.split("\n\n");
  }

  // tslint:disable-next-line:no-any
  createPositionDateText(startDate, endDate, isCurrent) {
    const startDateText = this.getMonthFromInt(startDate.month) + ". " + startDate.year;
    const endDateText = isCurrent ? "Present" : `${this.getMonthFromInt(endDate.month)}. ${endDate.year}`;

    return `${startDateText} - ${endDateText}`;
  }
  createTableCell(data) {
    return new TableCellD({
      children: [new Paragraph({
        text: data,
        alignment: AlignmentType.CENTER
      })]
    })
  }
  createTableRowTool(data) {
    return new TableRowD({
      children: [
        this.createTableCell(String(data.stt)),
        this.createTableCell(data.name),
        this.createTableCell(String(data.quantity)),
      ],
    })
  }
  createTableRowNV(data) {
    return new TableRowD({
      children: [
        this.createTableCell(String(data.stt)),
        this.createTableCell(data.name),
      ],
    })
  }

  createContentTableTool(data) {
    return new TableD({
      rows: [
        this.createTableRowTool(data)
      ],
      width: {
        size: 200,
        type: WidthType.AUTO,
      },
      columnWidths: [10, 10, 10],
    });
  }
  createContentTableNV(data) {
    return new TableD({
      rows: [
        this.createTableRowNV(data)
      ],
      width: {
        size: 200,
        type: WidthType.AUTO,
      },
      columnWidths: [10, 10, 10],
    });
  }
  createHeaderTable(firstCol, secondCol, thirCol) {
    return new TableD({

      rows: [
        new TableRowD({
          tableHeader: true,
          children: [
            new TableCellD({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                  text: `${firstCol}`,
                  bold: true,
                  size: 16
                })]
              })], columnSpan: 1,
            }),
            new TableCellD({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                  text: `${secondCol}`,
                  bold: true,
                  size: 16
                })]
              })], columnSpan: 1,
            }),
            new TableCellD({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                  text: `${thirCol}`,
                  bold: true,
                  size: 16
                })]
              })], columnSpan: 1,
            })
          ],
        })
      ],
      width: {
        size: 200,
        type: WidthType.AUTO,
      },
      columnWidths: [10, 10, 10],
    });
  }
  createHeaderTableNV(firstCol, secondCol) {
    return new TableD({

      rows: [
        new TableRowD({
          tableHeader: true,
          children: [
            new TableCellD({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                  text: `${firstCol}`,
                  bold: true,
                  size: 16
                })]
              })], columnSpan: 1,
            }),
            new TableCellD({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                  text: `${secondCol}`,
                  bold: true,
                  size: 16
                })]
              })], columnSpan: 1,
            }),
          ],
        })
      ],
      width: {
        size: 200,
        type: WidthType.AUTO,
      },
      columnWidths: [10, 10, 10],
    });
  }
  getMonthFromInt(value) {
    switch (value) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sept";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
      default:
        return "N/A";
    }
  }
}

class FastReportDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showRightPanel: false,
      redirect: false,
      urlRedirect: '',
      currentIdTool: {},
      isChange: false,
      addFile: false,
      fileInDB: [],
      fastReportAction: true,
      selectedImage: null,
      columnsGrid: [
        { selector: 'name', name: 'Tên tài liệu', width: '100% - 300px', sortable: true },
        {
          selector: 'idFile', name: 'Link xem', width: 'calc((100% - 100px) / 3)',
          cell: (params) => {
            console.log(params.idFile)
            return <>
              <div>
                <a href={`https://drive.google.com/file/d/${params.idFile}`} target="_blank">Click me</a>
              </div>

            </>
          },
          sortable: true
        },
        {
          name: 'Hành động', width: '100px',
          cell: (params) => {
            let { fastReport } = this.props;
            console.log(fastReport)

            let data = JSON.parse(JSON.stringify(params))
            console.log(data)
            return <>
              <div>
                {/* <a href={`https://drive.google.com/file/d/${params.idFile}`} target="_blank">Click me</a> */}
                <Fab
                  size='small'
                  onClick={() => {
                    this.onClickRemoveDoc(data)
                  }}>
                  <DeleteForever color="error" fontSize="small" /></Fab>
              </div>

            </>
          }
        }
      ],
    }
  }

  generateDox = () => {
    const { fastReport } = this.props;
    const nv = fastReport.NV;
    const employees = [];
    var index = 1;
    nv.forEach(element => {
      employees.push({
        stt: index++,
        name: element.name
      })
    });
    const tool = fastReport.toolId;
    let toolName = [];
    tool.forEach(element => { toolName.push(element.name) });
    let sortToolName = toolName.sort();
    console.log(sortToolName);

    const listTool = [];
    var indexT = 1;
    let elementCurrent = '';
    let quantity = 0;

    for (let i = 0; i < sortToolName.length; i++) {
      if (sortToolName[i] !== elementCurrent) {
        if (quantity > 0) {
          listTool.push({
            stt: indexT++,
            name: elementCurrent,
            quantity: quantity
          });
        }
        elementCurrent = sortToolName[i];
        quantity = 1;
      } else {
        quantity++;
      }
    }
    if (quantity > 0) {
      listTool.push({
        stt: indexT++,
        name: elementCurrent,
        quantity: quantity
      });
    }
    const workFastReportInfo = [
      {
        WO: fastReport.WO,
        PCT: fastReport.PCT,
        CHTT: fastReport.userId.name,
      },
    ];
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create([
      employees,
      workFastReportInfo,
      listTool
    ]);

    Packer.toBlob(doc).then(blob => {
      //console.log(blob);
      saveAs(blob, `${fastReport.WO} ` + "_" + `${fastReport.userId.name}` + ".docx");
      //console.log("Document created successfully");
    });
  }

  componentDidMount() {
    const { fastReportActionCreator, customerActionCreator, match: { params }, fastReport } = this.props;
    const { getIdFastReport } = fastReportActionCreator;
    const { listAllCustomers } = customerActionCreator;
    getIdFastReport(params.fastReportId);
    listAllCustomers();
    console.log(fastReport)
    this.setState({
      fileInDB: fastReport.files
    })
  }
  onClickShowTool = (data) => {
    if (data._id === this.state.currentIdTool._id) {
      this.setState({ showRightPanel: false, currentIdTool: {} });
    } else {
      this.setState({ showRightPanel: true, currentIdTool: data })
    }
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.urlRedirect} />
    }
  }
  onClickAddTool = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }
  onClickGotoList = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }
  onClickRemoveDoc = (data) => {
    let self = this
    console.log(data)
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn bỏ tài liệu này?",
      ifOk: () => {
        const { fastReportActionCreator, toolActionCreator, fastReport, fileActionsCreator } = self.props;
        const { currentIdTool } = self.state;
        console.log(currentIdTool)
        const { updateFastReport } = fastReportActionCreator;
        const { deleteFile } = fileActionsCreator;
        const newFastReport = JSON.parse(JSON.stringify(fastReport));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newFastReport.files.findIndex(function (item, i) {
          return item._id === data._id
        });
        newFastReport.files.splice(indexTool, 1);
        newTool.wo = "";
        newTool.status = 1;
        updateFastReport(newFastReport);
        deleteFile(data.idFile);
      }
    })
  }
  onClickReturnTool = (data) => {
    let self = this
    popupConfirm({
      title: 'Trả tool',
      html: "Bạn muốn trả công cụ này về kho?",
      ifOk: () => {
        const { fastReportActionCreator, toolActionCreator, fastReport } = self.props;
        const { currentIdTool } = self.state;
        const { updateFastReport } = fastReportActionCreator;
        const { updateTool } = toolActionCreator;
        const newFastReport = JSON.parse(JSON.stringify(fastReport));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newFastReport.toolId.findIndex(function (item, i) {
          return item._id === data._id
        });
        newTool.wo = "";
        newTool.status = 1;
        newFastReport.toolId[indexTool].status = newTool.status;
        if (currentIdTool._id === data._id) {
          self.setState({ currentIdTool: {} });
        }
        updateFastReport(newFastReport);
        updateTool(newTool);
      }
    })
  }
  onClickAddToolInList = (data) => {
    let self = this
    popupConfirm({
      title: 'Mượn tool lại',
      html: "Bạn muốn mượn lại công cụ này không?",
      ifOk: () => {
        const { fastReportActionCreator, toolActionCreator, fastReport } = self.props;
        const { currentIdTool } = self.state;
        const { updateFastReport } = fastReportActionCreator;
        const { updateTool } = toolActionCreator;
        const newFastReport = JSON.parse(JSON.stringify(fastReport));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newFastReport.toolId.findIndex(function (item, i) {
          return item._id === data._id
        });
        newTool.wo = newFastReport.WO;
        newTool.status = 2;
        newFastReport.toolId[indexTool].status = newTool.status;
        if (currentIdTool._id === data._id) {
          self.setState({ currentIdTool: {} });
        }
        updateFastReport(newFastReport);
        updateTool(newTool);
      }
    })
  }
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

  notSave = () => {
    const { files, fileActionsCreator } = this.props;
    const { deleteFile } = fileActionsCreator;
    const { fileInDB } = this.state;
    console.log(fileInDB);
    console.log(files)
    let fileDif = []

    fileDif = this.compareArrays(fileInDB, files)
    console.log(fileDif)
    // Loop through imageDif and delete images
    fileDif.forEach((file) => {
      deleteFile(file.idFile); // Assuming deleteImage takes an image as an argument
    });
  }
  onClickEdit = (data) => {
    const { fastReportActionCreator, modalActionsCreator, imageActionsCreator } = this.props;
    const { setFastReportEditing } = fastReportActionCreator;
    const { uploadImagesSuccess } = imageActionsCreator;
    setFastReportEditing(data);
    //console.log(data)
    uploadImagesSuccess(data.images);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Work FastReport');
    changeModalContent(<FastReportForm />);
  }
  saveFileToData = (data) => {
    this.setState({
      addFile: false,
    })
    const { fastReportActionCreator, fastReportEditting, user, images, files } = this.props;
    const { addFastReport, updateFastReport } = fastReportActionCreator;
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
      files
    }
    console.log(files)
    console.log(newFastReport)
    //console.log(fastReportEditting)
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
  addFile = (data) => {
    const { fileActionsCreator } = this.props;
    const { uploadFilesSuccess } = fileActionsCreator;
    console.log(data)
    uploadFilesSuccess(data.files)
    this.setState({
      addFile: true,
    })
  };
  onClickVerify = (data) => {
    const { fastReportActionCreator, user, fastReport } = this.props;
    const { updateFastReport } = fastReportActionCreator;
    const newFastReport = JSON.parse(JSON.stringify(data));
    const haveToolInList = data.toolId;
    switch (newFastReport.status) {
      case 'START':
        if (haveToolInList.length === 0) {
          newFastReport.status = 'INPRG NO TOOL'
          newFastReport.statusTool = "INPRG NO TOOL"
        }
        else {
          newFastReport.status = 'READY'
          newFastReport.statusTool = 'READY'
        }
        break;
      case 'READY':
        if (user.admin) {
          newFastReport.status = 'INPRG HAVE TOOL'
          newFastReport.statusTool = 'INPRG HAVE TOOL'
        }
        break;
      case 'INPRG HAVE TOOL':
        if (user.admin) {
          newFastReport.status = 'INPRG NO TOOL'
          newFastReport.statusTool = "INPRG NO TOOL"
        }
        break;
      case 'INPRG NO TOOL':
        let self = this
        popupConfirmYesNo({
          title: 'Thông báo',
          html: "Bạn vui lòng kiểm tra lại ngày kết thúc theo phiếu công tác, nếu đúng nhấn 'Đúng', nếu sai chọn 'Sai' ",
          ifOk: () => {
            const { fastReport } = self.props;
            const newFastReport = JSON.parse(JSON.stringify(fastReport));
            newFastReport.status = 'COMPLETE'
            newFastReport.statusTool = "COMPLETE"
            updateFastReport(newFastReport);
          },
          ifCancel: () => {
            this.onClickEdit(fastReport)
          }
        })
        break;
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
  groupButtonActions = () => {
    const { fastReport, user, fastReportActionCreator } = this.props
    const { updateFastReport } = fastReportActionCreator;
    const newFastReport = JSON.parse(JSON.stringify(fastReport));
    let returnToolComplete = fastReport.toolId.filter(tool => tool.status === 1)
    let countToolId = fastReport.toolId.length;
    let haveTool = fastReport.toolId;
    let toolComplete;
    if (returnToolComplete.length === countToolId) toolComplete = true;
    else toolComplete = false;
    // if (!fastReport.userId) return <></>;
    // else if (fastReport.status === 'START' && user._id === fastReport.userId._id && fastReport.toolId.length === 0) {
    //   return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(fastReport) }}>Lấy PCT Không Tool</Button>;
    // }
    switch (fastReport.status) {
      case 'START':
        if (user._id !== fastReport.userId._id) return <></>
        return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(fastReport) }}>Gửi Duyệt</Button>;
      case 'READY':
        if (user.admin) {
          return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(fastReport) }}>Duyệt</Button>;
        } else {
          return <></>;
        }
      case 'INPRG HAVE TOOL':
        if (user.admin && toolComplete) {
          return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(fastReport) }}>Trả xong</Button>;
        } else {
          return <></>;
        }
      case 'INPRG NO TOOL':
        if (toolComplete && user._id === fastReport.userId._id) {
          return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(fastReport) }}>Hoàn Thành</Button>;
        }
      case 'COMPLETE':
        if (user.pkt) {
          return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(fastReport) }}>Đóng WO</Button>;
        }

      default:
        return <></>;
    }
  }
  renderStatusText = (status) => {
    const { user } = this.props
    if (!user) return '';
    switch (status) {
      case 'READY':
        return user.admin ? '' : ' - CHỜ DUYỆT'
      case 'INPRG':
        return user.admin ? '' : ' - ĐANG XỬ LÝ'
      default:
        return ''
    }
  }
  classAddTool = (fastReport) => {
    const { user } = this.props
    if (!fastReport.userId) return 'hide';
    if (!user.admin && (user._id !== fastReport.userId._id || fastReport.status !== 'START')) return 'hide';
    if (user.admin && fastReport.status === 'INPRG NO TOOL') return 'hide';
    if (fastReport.status === 'COMPLETE' || fastReport.status === 'CLOSE') return 'hide';
    return ''
  }
  getImage = (images) => {
    //console.log(images)
    //console.log(`https://drive.google.com/uc?export=view&id=${images[0].idImage}`)
    return images.map(image => ({
      original: `https://drive.google.com/uc?export=view&id=${image.idImage}`,
      thumbnail: `https://drive.google.com/uc?export=view&id=${image.idImage}`
    }))
  }
  addandremoveUserNV = (data) => {
    const { fastReportActionCreator, fastReport } = this.props;
    const { updateFastReport } = fastReportActionCreator;
    const newFastReport = JSON.parse(JSON.stringify(fastReport));
    newFastReport.NV = data
    updateFastReport(newFastReport);
  }
  onChangeNote = (event) => {
    const { fastReportActionCreator, fastReport } = this.props;
    const { updateFastReportNote } = fastReportActionCreator;
    const newFastReport = JSON.parse(JSON.stringify(fastReport));
    newFastReport.note = event.target.value;
    this.setState({ isChange: true });
    updateFastReportNote(newFastReport);
  }
  onBlurNote = (event) => {
    const { fastReportActionCreator, fastReport } = this.props;
    const { isChange } = this.state;
    const newFastReport = JSON.parse(JSON.stringify(fastReport));
    if (isChange) {
      const { updateFastReport } = fastReportActionCreator;
      newFastReport.note = event.target.value;
      updateFastReport(newFastReport);
      this.setState({ isChange: false });
    }
  }
  generateDocs = (fastReport) => {
    console.log('generate bang')
    console.log(fastReport)
    const { user } = this.props;
    if (!user && !user._id) return [];
    fastReport.isAction = true
    if (!user.admin && fastReport.userId && (user._id !== fastReport.userId._id)) fastReport.isAction = false;
    if (fastReport && fastReport.files && fastReport.files.length > 0) {
      return fastReport.files
    }
    return []
  }
  renderToolImages = () => {
    let { images, classes } = this.props;
    let { selectedImage } = this.state;
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
                  style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => this.onClickPicture(image)}
                />
              </div>
            ))}
          </div>
        );
      }
    }
    return xhtml;
  };
  onClickPicture = (image) => {
    this.setState({ selectedImage: image });
  };
  onCloseFullScreen = () => {
    this.setState({ selectedImage: null });
  };
  renderFullScreenImage = () => {
    let { selectedImage } = this.state;

    if (selectedImage) {
      return (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={this.onCloseFullScreen}
        >
          <img
            src={`https://drive.google.com/uc?export=view&id=${selectedImage.idImage}`}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>
      );
    }

    return null;
  };
  render() {
    const { classes, fastReport, user, images, upFileSuccess } = this.props
    const { showRightPanel, columnsGrid, addFile } = this.state
    let dataTable = this.generateDocs(fastReport)
    console.log(dataTable)
    return (
      <Fragment>
        <div className={classes.containerPanel}>
          {this.renderRedirect()}
          <div className={fastReport._id ? '' : classes.maskLoading}>
          </div>
          <Grid className={(showRightPanel ? 'box-panel show-right-panel' : 'box-panel')}>
            <Grid className='left-panel'>
              <div className='block'>
                <div className='header-action'>
                  <div className='group'>
                    <Button variant="contained" color="primary" onClick={() => { this.onClickGotoList('/admin/fastReport') }}>
                      <ArrowBackIos style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Quay về danh sách
                    </Button>
                    &nbsp;
                    <Button className={fastReport.userId && (user.admin || user._id === fastReport.userId._id) ? '' : 'hide'} variant="contained" color="primary" onClick={() => { this.onClickEdit(fastReport) }}>
                      <Edit style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Chỉnh sửa
                    </Button>
                    &nbsp;
                  </div>
                </div>
                {fastReport.userId && user._id !== fastReport.userId._id ? <div className='customer-field'>Người dùng: {fastReport.userId ? fastReport.userId.name : ''}</div> : ''}
                <div className='info-wo'>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="wo" value={fastReport.WO} label="Work FastReport" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="employ" value={fastReport.employ} label="Nhân sự" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="kks" value={fastReport.KKS} label="KKS/ Hệ thống" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="time" value={fastReport.time} label="Tổng thời gian thực hiện" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="date_start" value={moment(fastReport.timeStart).format('DD/MM/YYYY')} label="Ngày bắt đầu" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="date_stop" value={moment(fastReport.timeStop).format('DD/MM/YYYY')} label="Ngày kết thúc" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="content" multiline value={fastReport.content || ' '} label="Nội dung công tác" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="content" multiline value={fastReport.error || ' '} label="Hiện tượng lỗi" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="result" multiline value={fastReport.result || ' '} label="Kết quả xử lý" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  {addFile ? <></> : <Button className={fastReport.userId && (user.admin || user._id === fastReport.userId._id) ? '' : 'hide'} variant="contained" color="primary" onClick={() => { this.addFile(fastReport) }}>
                    <Edit style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Thêm File
                  </Button>}
                  {addFile ? <FileInput /> : <></>}
                  &nbsp;
                </div>
                <Grid className={classes.dataTable}>
                  <DataTable
                    noHeader={true}
                    keyField={'_id'}
                    columns={columnsGrid}
                    data={dataTable}
                    striped={true}
                    pagination
                    paginationPerPage={20}
                    paginationRowsPerPageOptions={[10, 20, 50]}
                    //onRowClicked={this.onClickShowTool}
                    noDataComponent='Chưa thêm tài liệu'
                  />
                </Grid>
              </div>
            </Grid>
            <Grid>
              <div>
                <div>Hình ảnh:</div>
                {(images || []).length === 0 ? (
                  <></>
                ) : (
                  <>
                    {this.renderToolImages()}
                    {this.renderFullScreenImage()}
                  </>
                )}
              </div>

            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }

}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    fastReportEditting: state.fastReports.fastReport,
    fastReports: state.fastReports.fastReport,
    fastReport: {
      WO: state.fastReports.fastReport ? state.fastReports.fastReport.WO : '',
      PCT: state.fastReports.fastReport ? state.fastReports.fastReport.PCT : '',
      date: state.fastReports.fastReport ? state.fastReports.fastReport.date : '',
      status: state.fastReports.fastReport ? state.fastReports.fastReport.status : '',
      statusTool: state.fastReports.fastReport ? state.fastReports.fastReport.statusTool : '',
      timeStart: state.fastReports.fastReport ? state.fastReports.fastReport.timeStart : '',
      timeStop: state.fastReports.fastReport ? state.fastReports.fastReport.timeStop : '',
      toolId: state.fastReports.fastReport ? state.fastReports.fastReport.toolId : [],
      content: state.fastReports.fastReport ? state.fastReports.fastReport.content : '',
      error: state.fastReports.fastReport ? state.fastReports.fastReport.error : '',
      employ: state.fastReports.fastReport ? state.fastReports.fastReport.employ : '',
      result: state.fastReports.fastReport ? state.fastReports.fastReport.result : '',
      time: state.fastReports.fastReport ? state.fastReports.fastReport.time : '',
      location: state.fastReports.fastReport ? state.fastReports.fastReport.location : '',
      KKS: state.fastReports.fastReport ? state.fastReports.fastReport.KKS : '',
      userId: state.fastReports.fastReport ? state.fastReports.fastReport.userId : {},
      NV: state.fastReports.fastReport ? state.fastReports.fastReport.NV : [],
      note: state.fastReports.fastReport ? state.fastReports.fastReport.note : '',
      _id: state.fastReports.fastReport ? state.fastReports.fastReport._id : '',
      isAction: true,
      images: state.fastReports.fastReport ? state.fastReports.fastReport.images : [],
      files: state.fastReports.fastReport ? state.fastReports.fastReport.files : []
    },
    images: state.fastReports.fastReport ? state.fastReports.fastReport.images : [],
    files: state.files.files ? state.files.files : [],
    upFileSuccess: state.files.files ? state.files.upFileSuccess : [],
    user: state.auth.user || {},
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    toolActionCreator: bindActionCreators(toolActions, dispatch),
    fastReportActionCreator: bindActionCreators(fastReportActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    imageActionsCreator: bindActionCreators(imageActions, dispatch),
    fileActionsCreator: bindActionCreators(fileActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(FastReportDetail);