import React, { Component, Fragment, } from 'react';
import { connect } from 'react-redux';
import * as orderActions from '../../actions/orderActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, Fab, TextField, FormControl, Button, Table } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import { DeleteForever, ArrowBackIos, Edit, KeyboardReturn, Add } from '@material-ui/icons';
import DataTable from 'react-data-table-component';
import { API_ENDPOINT as URL } from '../../constants';
import OrderForm from '../OrderForm';
import moment from 'moment';
import { popupConfirm, popupConfirmYesNo } from '../../actions/ui';
import ImageGallery from 'react-image-gallery';
import { Multiselect } from 'multiselect-react-dropdown';
import { AlignmentType, Document, BorderStyle, HeadingLevel, Packer, Paragraph, TabStopPosition, TabStopType, TextRun, Table as TableD, TableCell as TableCellD, TableRow as TableRowD, WidthType, convertInchesToTwip } from 'docx';
import { saveAs } from "file-saver";

import "react-image-gallery/styles/css/image-gallery.css";

const PHONE_NUMBER = "02903 650140";
const PROFILE_URL = "https://www.pvps.vn";
const EMAIL = "info@pvps.vn";


class DocumentCreator {
  create([employees, workOrderInfo, listTool]) {
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
        this.createHeading("Thông tin Work Order:"),
        ...workOrderInfo
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

class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showRightPanel: false,
      redirect: false,
      urlRedirect: '',
      currentIdTool: {},
      isChange: false,
      orderAction: true,
      columnsGrid: [
        { selector: 'name', name: 'Tên công cụ', width: '100% - 300px', sortable: true },
        {
          selector: 'status', name: 'Trạng thái', width: '130px', sortable: true,
          cell: (param) => {
            let { order } = this.props;
            //if (!order.isAction) return <></>
            let status = 'READY'
            let className = 'ready'
            switch (param.status + "") {
              case "1":
                status = 'RETURNED';
                className = 'ready';
                break;
              case "2":
                status = 'IN USE';
                className = 'in-use';
                break;
              case "3":
                status = 'BAD'
                className = 'bad';
                break;
              case "4":
                status = 'LOST';
                className = 'lost';
                break;
              default:
                status = 'READY'
                break;
            }
            return <div className={'lb-status color-' + className}>{status}</div>;
          }
        },
        // { selector: 'type', name: 'Loại', width: 'calc((100% - 100px) / 3)', sortable: true },
        {
          name: 'Hành động', width: '100px',
          cell: (params) => {
            let { order } = this.props;
            console.log(order)
            
            if (!order.isAction) return <></>
            let data = JSON.parse(JSON.stringify(params))
            console.log(data)
            if (order.status === "START") {
              return <>
                <Fab
                  color="default"
                  aria-label="Remove"
                  size='small'
                  onClick={() => {
                    this.onClickRemoveTool(data)
                  }}
                >
                  <DeleteForever color="error" fontSize="small" />
                </Fab>
              </>
            }
            if (order.status === "READY" || order.status === "INPRG HAVE TOOL") {
              if (data.status === 1) {
                return <>
                  <Fab
                    color="default"
                    aria-label="Return"
                    size='small'
                    onClick={() => {
                      this.onClickAddToolInList(data)
                    }}
                  >
                    <Add color="primary" fontSize="small" />
                  </Fab>
            &nbsp;
                  <Fab
                    color="default"
                    aria-label="Remove"
                    size='small'
                    onClick={() => {
                      this.onClickRemoveTool(data)
                    }}
                  >
                    <DeleteForever color="error" fontSize="small" />
                  </Fab>
                </>
              }
              if (data.status === 2) {
                return <>
                  <Fab
                    color="default"
                    aria-label="Return"
                    size='small'
                    onClick={() => {
                      this.onClickReturnTool(data)
                    }}
                  >
                    <KeyboardReturn fontSize="small" />
                  </Fab>
            &nbsp;
                  <Fab
                    color="default"
                    aria-label="Remove"
                    size='small'
                    onClick={() => {
                      this.onClickRemoveTool(data)
                    }}
                  >
                    <DeleteForever color="error" fontSize="small" />
                  </Fab>
                </>
              }
            }
          }
        }
      ],
      columnsGridComplete: [
        { selector: 'name', name: 'Tên công cụ', width: '100% - 300px', sortable: true },
        // { selector: 'type', name: 'Loại', width: 'calc((100% - 100px) / 3)', sortable: true },
      ]
    }
  }

  generateDox = () => {
    const { order } = this.props;
    const nv = order.NV;
    const employees = [];
    var index = 1;
    nv.forEach(element => {
      employees.push({
        stt: index++,
        name: element.name
      })
    });
    const tool = order.toolId;
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
    const workOrderInfo = [
      {
        WO: order.WO,
        PCT: order.PCT,
        CHTT: order.userId.name,
      },
    ];
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create([
      employees,
      workOrderInfo,
      listTool
    ]);

    Packer.toBlob(doc).then(blob => {
      //console.log(blob);
      saveAs(blob, `${order.WO} ` + "_" + `${order.userId.name}` + ".docx");
      //console.log("Document created successfully");
    });
  }

  componentDidMount() {
    const { orderActionCreator, customerActionCreator, match: { params }, order } = this.props;
    const { getIdOrder } = orderActionCreator;
    const { listAllCustomers } = customerActionCreator;
    getIdOrder(params.orderId);
    listAllCustomers();
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
  onClickRemoveTool = (data) => {
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn bỏ công cụ này?",
      ifOk: () => {
        const { orderActionCreator, toolActionCreator, order } = self.props;
        const { currentIdTool } = self.state;
        const { updateOrder } = orderActionCreator;
        const { updateTool } = toolActionCreator;
        const newOrder = JSON.parse(JSON.stringify(order));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newOrder.toolId.findIndex(function (item, i) {
          return item._id === data._id
        });
        //let indexTool = newOrder.toolId.indexOf(data._id);
        newOrder.toolId.splice(indexTool, 1);
        newTool.wo = "";
        newTool.status = 1;
        if (currentIdTool._id === data._id) {
          self.setState({ currentIdTool: {} });
        }
        updateOrder(newOrder);
        updateTool(newTool);
      }
    })
  }
  onClickReturnTool = (data) => {
    let self = this
    popupConfirm({
      title: 'Trả tool',
      html: "Bạn muốn trả công cụ này về kho?",
      ifOk: () => {
        const { orderActionCreator, toolActionCreator, order } = self.props;
        const { currentIdTool } = self.state;
        const { updateOrder } = orderActionCreator;
        const { updateTool } = toolActionCreator;
        const newOrder = JSON.parse(JSON.stringify(order));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newOrder.toolId.findIndex(function (item, i) {
          return item._id === data._id
        });
        newTool.wo = "";
        newTool.status = 1;
        newOrder.toolId[indexTool].status = newTool.status;
        if (currentIdTool._id === data._id) {
          self.setState({ currentIdTool: {} });
        }
        updateOrder(newOrder);
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
        const { orderActionCreator, toolActionCreator, order } = self.props;
        const { currentIdTool } = self.state;
        const { updateOrder } = orderActionCreator;
        const { updateTool } = toolActionCreator;
        const newOrder = JSON.parse(JSON.stringify(order));
        const newTool = JSON.parse(JSON.stringify(data));
        let indexTool = newOrder.toolId.findIndex(function (item, i) {
          return item._id === data._id
        });
        newTool.wo = newOrder.WO;
        newTool.status = 2;
        newOrder.toolId[indexTool].status = newTool.status;
        if (currentIdTool._id === data._id) {
          self.setState({ currentIdTool: {} });
        }
        updateOrder(newOrder);
        updateTool(newTool);
      }
    })
  }
  onClickEdit = (data) => {
    const { orderActionCreator, modalActionsCreator } = this.props;
    const { setOrderEditing } = orderActionCreator;
    setOrderEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa Work Order');
    changeModalContent(<OrderForm />);
  }
  onClickVerify = (data) => {
    const { orderActionCreator, user, order } = this.props;
    const { updateOrder } = orderActionCreator;
    const newOrder = JSON.parse(JSON.stringify(data));
    const haveToolInList = data.toolId;
    switch (newOrder.status) {
      case 'START':
        if (haveToolInList.length === 0) {
          newOrder.status = 'INPRG NO TOOL'
          newOrder.statusTool = "INPRG NO TOOL"
        }
        else {
          newOrder.status = 'READY'
          newOrder.statusTool = 'READY'
        }
        break;
      case 'READY':
        if (user.admin) {
          newOrder.status = 'INPRG HAVE TOOL'
          newOrder.statusTool = 'INPRG HAVE TOOL'
        }
        break;
      case 'INPRG HAVE TOOL':
        if (user.admin) {
          newOrder.status = 'INPRG NO TOOL'
          newOrder.statusTool = "INPRG NO TOOL"
        }
        break;
      case 'INPRG NO TOOL':
        let self = this
        popupConfirmYesNo({
          title: 'Thông báo',
          html: "Bạn vui lòng kiểm tra lại ngày kết thúc theo phiếu công tác, nếu đúng nhấn 'Đúng', nếu sai chọn 'Sai' ",
          ifOk: () => {
            const { order } = self.props;
            const newOrder = JSON.parse(JSON.stringify(order));
            newOrder.status = 'COMPLETE'
            newOrder.statusTool = "COMPLETE"
            updateOrder(newOrder);
          },
          ifCancel: () => {
            this.onClickEdit(order)
          }
        })
        break;
      case 'COMPLETE':
        if (user.pkt) {
          newOrder.status = 'CLOSE'
        }
        break;
      default:
        break;
    }
    updateOrder(newOrder);
  };
  groupButtonActions = () => {
    const { order, user, orderActionCreator } = this.props
    const { updateOrder } = orderActionCreator;
    const newOrder = JSON.parse(JSON.stringify(order));
    let returnToolComplete = order.toolId.filter(tool => tool.status === 1)
    let countToolId = order.toolId.length;
    let haveTool = order.toolId;
    let toolComplete;
    if (returnToolComplete.length === countToolId) toolComplete = true;
    else toolComplete = false;
    if (!order.userId) return <></>;
    else if (order.status === 'START' && user._id === order.userId._id && order.toolId.length === 0) {
      return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(order) }}>Lấy PCT Không Tool</Button>;
    }
    switch (order.status) {
      case 'START':
        if (user._id !== order.userId._id) return <></>
        return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(order) }}>Gửi Duyệt</Button>;
      case 'READY':
        if (user.admin) {
          return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(order) }}>Duyệt</Button>;
        } else {
          return <></>;
        }
      case 'INPRG HAVE TOOL':
        if (user.admin && toolComplete) {
          return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(order) }}>Trả xong</Button>;
        } else {
          return <></>;
        }
      case 'INPRG NO TOOL':
        if (toolComplete && user._id === order.userId._id) {
          return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(order) }}>Hoàn Thành</Button>;
        }
      case 'COMPLETE':
        if (user.pkt) {
          return <Button variant="contained" color="primary" onClick={() => { this.onClickVerify(order) }}>Đóng WO</Button>;
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
  classAddTool = (order) => {
    const { user } = this.props
    if (!order.userId) return 'hide';
    if (!user.admin && (user._id !== order.userId._id || order.status !== 'START')) return 'hide';
    if (user.admin &&  order.status === 'INPRG NO TOOL') return 'hide';
    if (order.status === 'COMPLETE' || order.status === 'CLOSE') return 'hide';
    return ''
  }
  getImage = (images) => {
    return images.map(img => ({
      original: `${URL}/api/upload/image/${img.filename}`,
      thumbnail: `${URL}/api/upload/image/${img.filename}`
    }))
  }
  addandremoveUserNV = (data) => {
    const { orderActionCreator, order } = this.props;
    const { updateOrder } = orderActionCreator;
    const newOrder = JSON.parse(JSON.stringify(order));
    newOrder.NV = data
    updateOrder(newOrder);
  }
  onChangeNote = (event) => {
    const { orderActionCreator, order } = this.props;
    const { updateOrderNote } = orderActionCreator;
    const newOrder = JSON.parse(JSON.stringify(order));
    newOrder.note = event.target.value;
    this.setState({ isChange: true });
    updateOrderNote(newOrder);
  }
  onBlurNote = (event) => {
    const { orderActionCreator, order } = this.props;
    const { isChange } = this.state;
    const newOrder = JSON.parse(JSON.stringify(order));
    if (isChange) {
      const { updateOrder } = orderActionCreator;
      newOrder.note = event.target.value;
      updateOrder(newOrder);
      this.setState({ isChange: false });
    }
  }
  render() {
    const { classes, order, user, customers } = this.props
    const { showRightPanel, columnsGrid, columnsGridComplete, currentIdTool, orderAction } = this.state
    return (
      <Fragment>
        <div className={classes.containerPanel}>
          {this.renderRedirect()}
          <div className={order._id ? '' : classes.maskLoading}>
          </div>
          <Grid className={(showRightPanel ? 'box-panel show-right-panel' : 'box-panel')}>
            <Grid className='left-panel'>
              <div className='block'>
                <div className='header-action'>
                  <div className='group'>
                    <Button variant="contained" color="primary" onClick={() => { this.onClickGotoList('/admin/order') }}>
                      <ArrowBackIos style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Quay về danh sách
                    </Button>
                    &nbsp;
                    <Button className={order.userId && (user.admin || user._id === order.userId._id) ? '' : 'hide'} variant="contained" color="primary" onClick={() => { this.onClickEdit(order) }}>
                      <Edit style={{ 'color': '#fff' }} fontSize="small" />&nbsp;Chỉnh sửa
                    </Button>
                  </div>
                  <div className='group'>
                    <Button variant="contained" color="primary">
                      Trạng thái: {order.status}{this.renderStatusText(order.status)}
                    </Button>
                    &nbsp;
                    {this.groupButtonActions()}
                  </div>
                </div>
                {order.userId && user._id !== order.userId._id ? <div className='customer-field'>Người dùng: {order.userId ? order.userId.name : ''}</div> : ''}
                <div className='info-wo'>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="wo" value={order.WO} label="Work Order" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="pct" value={order.PCT} label="PCT" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-50'>
                    <FormControl className='field' fullWidth>
                      <TextField id="date_start" value={moment(order.timeStart).format('DD/MM/YYYY')} label="Ngày bắt đầu" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="date_stop" value={moment(order.timeStop).format('DD/MM/YYYY')} label="Ngày kết thúc" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="content" multiline value={order.content || ' '} label="Nội dung công tác" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo-100'>
                    <FormControl className='field' fullWidth>
                      <TextField id="note" multiline value={order.note || ''} label="Ghi chú" onBlur={this.onBlurNote} onChange={this.onChangeNote} InputProps={{ readOnly: this.classAddTool(order) === 'hide' }} />
                    </FormControl>
                  </div>
                </div>
                <Grid>
                  <Multiselect
                    options={(customers || []).filter(c => c._id !== user._id)}
                    selectedValues={order.NV}
                    onSelect={this.addandremoveUserNV}
                    onRemove={this.addandremoveUserNV}
                    displayValue="name"
                    placeholder={this.classAddTool(order) === 'hide' ? "" : "Nhân viên nhóm công tác"}
                    disable={this.classAddTool(order) === 'hide'}
                  />
                </Grid>
                <div className={classes.boxActions}>
                  <Button className={this.classAddTool(order)} variant="contained" color="secondary" onClick={() => this.generateDox(order)}>
                    IN PHIẾU
                  </Button> &nbsp;
                  <Button className={this.classAddTool(order)} variant="contained" color="primary" onClick={() => { this.onClickAddTool('/admin/tool/' + order._id) }}>
                    Thêm tool
                  </Button>
                </div>
                <Grid className={classes.dataTable}>
                  <DataTable
                    noHeader={true}
                    keyField={'_id'}
                    columns={order.status === "START"
                      || order.status === "READY"
                      || order.status === "INPRG HAVE TOOL"
                      ? columnsGrid : columnsGridComplete}
                    data={this.genarateTools(order)}
                    striped={true}
                    pagination
                    paginationPerPage={20}
                    paginationRowsPerPageOptions={[10, 20, 50]}
                    onRowClicked={this.onClickShowTool}
                    noDataComponent='Chưa thêm công cụ'
                  />
                </Grid>
              </div>
            </Grid>
            <Grid className='right-panel'>
              <div className='block'>
                <div>Tên công cụ: {currentIdTool.name}</div>
                <div>Hãng: {currentIdTool.manufacturer}</div>
                <div>Loại: {currentIdTool.type}</div>
                <div>Hình ảnh:</div>
                {
                  (currentIdTool.images || []).length === 0 ? <></>
                    : <ImageGallery items={this.getImage(currentIdTool.images)} />
                }
              </div>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
  genarateTools = (order) => {
    const { user } = this.props;
    if (!user && !user._id) return [];
    order.isAction = true
    if (!user.admin && order.userId && (order.status !== 'START' || user._id !== order.userId._id)) order.isAction = false;
    if (order.status === 'COMPLETE') order.isAction = false
    if (order && order.toolId && order.toolId.length > 0 && order.toolId[0]._id) {
      return order.toolId
    }
    return []
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    orders: state.orders.orders,
    order: {
      WO: state.orders.order ? state.orders.order.WO : '',
      PCT: state.orders.order ? state.orders.order.PCT : '',
      date: state.orders.order ? state.orders.order.date : '',
      status: state.orders.order ? state.orders.order.status : '',
      statusTool: state.orders.order ? state.orders.order.statusTool : '',
      timeStart: state.orders.order ? state.orders.order.timeStart : '',
      timeStop: state.orders.order ? state.orders.order.timeStop : '',
      toolId: state.orders.order ? state.orders.order.toolId : [],
      content: state.orders.order ? state.orders.order.content : '',
      location: state.orders.order ? state.orders.order.location : '',
      KKS: state.orders.order ? state.orders.order.KKS : '',
      userId: state.orders.order ? state.orders.order.userId : {},
      NV: state.orders.order ? state.orders.order.NV : [],
      note: state.orders.order ? state.orders.order.note : '',
      _id: state.orders.order ? state.orders.order._id : '',
      isAction: true
    },
    user: state.auth.user || {}
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    toolActionCreator: bindActionCreators(toolActions, dispatch),
    orderActionCreator: bindActionCreators(orderActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(OrderDetail);