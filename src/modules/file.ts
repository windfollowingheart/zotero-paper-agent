import { getPref, setPref } from "../utils/prefs"
import { getAccessToken } from "./token"
import { sendUint8ArrayFile, getKimi } from "../utils/http"
import { getWindowSize } from "../utils/window"
import { config } from "../../package.json";
import { text } from "stream/consumers";
import { BASEURL } from '../utils/ip';
import { getTabPdfPath } from "../utils/file";
import { getTabKeyAndPdfName } from "../utils/util";
import { insertNewFileInfo } from "../utils/sqlite";



//建立一个文件和content-type对应表
const file_type_map: { [key: string]: [string, string, string] } = {
    "png": ["application/png", "image", "png"],
    "jpg": ["application/jpeg", "image", "jpeg"],
    "jpeg": ["application/jpeg", "image", "jpeg"],
    "bmp": ["application/bmp", "image", "bmp"],
    "pdf": ["application/pdf", "file", "pdf"],
    "doc": ["application/msword", "file", "png"],
    "docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "file", "png"],
    "ppt": ["application/vnd.ms-powerpoint", "file", "png"],
    "pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "file", "png"],
    "xls": ["application/vnd.ms-excel", "file", "xls"],
    "xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "file", "xlsx"],
    "csv": ["text/csv", "file", "csv"],
    "txt": ["text/plain", "file", "txt"],
}

function createUploadFileComp(fileName: string, fileType: string, fileSize: number,
    displayFileFrame: HTMLDivElement, isUploading: boolean = true, image_path: string = "", preview_url: string = "", preview: boolean = false) {
    const { baseWidth, baseHeight } = getWindowSize()
    const doc = ztoolkit.getGlobal("document")
    // ztoolkit.getGlobal("alert")(displayFileFrame.style.height)
    // ztoolkit.getGlobal("alert")(displayFileFrame.style.width)
    const uploadFileComp = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            marginTop: "5px",
            // height: `${0.4 * parseInt(displayFileFrame.style.height.slice(0, -2))}vh`,
            // width: `${0.4 * parseInt(displayFileFrame.style.width.slice(0, -2))}vw`,
            height: `${0.4 * (baseHeight * 0.25 - 6)}vh`,
            width: `${0.4 * (baseWidth - 4)}vw`,
            display: "flex",
            padding: "3px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            alignItems: "center"
        },
        classList: ["shallow_1"],
        children: [
            {
                tag: "div",
                styles: {
                    height: "80%",
                    width: "30%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    // backgroundColor: "#ccffee",
                    marginLeft: "3%"
                },
                children: [
                    {
                        properties: {
                            src: isUploading ? `chrome://${config.addonRef}/content/icons/loading.svg` : "",
                            class: "img_loading"
                        },
                        tag: "img",
                        classList: ["img_loading"],
                        styles: {
                            height: "50%",
                            width: "auto",
                            position: "absolute",
                            zIndex: "2"
                        }
                    },
                    {
                        properties: {
                            src: isUploading ? `chrome://${config.addonRef}/content/icons/file_upload.png` : image_path,
                            class: "img_back"
                        },
                        tag: "img",
                        classList: ["img_back"],
                        styles: {
                            height: "90%",
                            width: "auto",
                            position: "absolute",
                            zIndex: "1",
                            overflow: "hidden"
                        }
                    }
                ]
            },
            {
                tag: "div",
                namespace: "html",
                styles: {
                    color: "#000",
                    fontSize: "12px",
                    height: "80%",
                    width: "60%",
                    fontFamily: "Microsoft YaHei ",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    // backgroundColor: "#ddee66",
                    marginLeft: "2%"
                },
                classList: ["upload_file_info"],
                properties: {
                    class: "upload_file_info"
                },
                // children: [
                //     {
                //         properties: {
                //             class: "file_name"
                //         },
                //         namespace: "html",
                //         tag: "div",
                //         styles: {
                //             color: "#000",
                //             height: "50%",
                //             fontWeight: "blod",
                //             // textAlign: "center",
                //             backgroundColor: "green"
                //         },

                //     },
                //     {
                //         properties: {
                //             class: "file_type_and_size"
                //         },
                //         namespace: "html",
                //         tag: "div",
                //         styles: {
                //             height: "50%",
                //             // textAlign: "center",
                //             backgroundColor: "red"
                //         }
                //     }
                // ]
            },
            {
                tag: "div",
                styles: {
                    position: "relative",
                    width: "5%",
                    height: "100%"
                },
                children: [
                    {
                        tag: "img",
                        styles: {
                            right: "-12px",
                            top: "-12px",
                            width: "20px",
                            height: "20px",
                            position: "absolute",

                        },
                        classList: ["cancel_x_img"],
                        namespace: "html",
                        properties: {
                            class: "cancel_x_img",
                            src: isUploading ? `chrome://${config.addonRef}/content/icons/cancel_x.svg` : "",
                            hidden: true
                        }
                    }
                ]
            }
        ]
    })
    const fileNameDiv = ztoolkit.UI.createElement(doc, "div", {
        properties: {
            class: "file_name"
        },
        namespace: "html",
        tag: "div",
        styles: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            height: "50%",
            width: "100%",
            fontWeight: "blod",
            // textAlign: "center",
            // backgroundColor: "green"
        },

    })
    const fileNameBackUpDiv = ztoolkit.UI.createElement(doc, "div", {
        classList: ["file_backup_div"],
        namespace: "html",
        tag: "div",
        styles: {
            display: "none",

        },

    })

    const fileTypeSizeDiv = ztoolkit.UI.createElement(doc, "div", {

        namespace: "html",
        tag: "div",
        classList: ["file_type_size_div"],
        styles: {
            fontSize: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            height: "50%",
            width: "100%",
            // textAlign: "center",
            fontWeight: "small",
            // backgroundColor: "red"
        }

    })


    if (isUploading) {
        displayFileFrame.append(uploadFileComp)
    }
    const fileInfoDiv: any = uploadFileComp.getElementsByClassName("upload_file_info")[0]
    fileNameBackUpDiv.textContent = fileName
    fileNameDiv.textContent = fileName.length > 8 ? fileName.slice(0, 8) + "..." : fileName
    // ztoolkit.getGlobal("alert")(fileNameDiv.textContent)
    fileTypeSizeDiv.textContent = (fileType.split("/").length > 1 ? fileType.split("/")[1].toUpperCase() : fileType) + ", " + convertBytes(fileSize, 2)
    // ztoolkit.getGlobal("alert")(fileTypeSizeDiv.textContent[0])
    // ztoolkit.getGlobal("alert")(fileTypeSizeDiv.textContent.length)
    // ztoolkit.getGlobal("alert")(fileInfoDiv)
    fileInfoDiv.append(fileNameDiv, fileTypeSizeDiv, fileNameBackUpDiv)
    displayFileFrame.scrollTop = displayFileFrame.scrollHeight


    if (!isUploading && preview) {
        //给卡片添加点击事件
        uploadFileComp.addEventListener("click", () => {
            // ztoolkit.getGlobal("alert")(image_path)
            if (fileType.includes("image")) {
                const dialogHelper = new ztoolkit.Dialog(1, 1)
                    .addCell(0, 0, {
                        tag: "div",
                        styles: {
                            width: "100%",
                            height: "100%",
                            // padding: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",


                        },
                        children: [
                            {
                                tag: "img",
                                styles: {
                                    objectFit: "contain",
                                    height: "90%",
                                    width: "90%"
                                },
                                properties: {
                                    src: preview_url
                                },
                            },
                        ],

                    }).open("预览")
            } else {

                //将pdf链接复制到剪贴板
                new ztoolkit.Clipboard().addText(preview_url).copy()
                new ztoolkit.ProgressWindow("", { closeTime: 3000 }
                ).createLine({
                    text: "链接已复制到剪贴板,请打开浏览器预览",
                    type: "success",
                    progress: 100
                }).show();
                // new ztoolkit.ProgressWindow("PDF链接", { closeTime: 3000 }
                // ).createLine({
                //     text: "链接已复制到剪贴板,请打开浏览器预览",
                //     type: "success",
                // }).show();
                return


                const dialogHelper = new ztoolkit.Dialog(1, 1)
                    // .setDialogData({
                    //     title: "预览",
                    //     windowFeatures: {
                    //         width: "1000px",
                    //         height: "600px",
                    //         // fitContent: true,
                    //         top: "10%",
                    //         left: "10%"
                    //     }
                    // })
                    .addCell(0, 0, {
                        // tag: "div",
                        // styles: {
                        //     width: "100%",
                        //     height: "100%",
                        //     // // padding: "5px",
                        //     // display: "flex",
                        //     // alignItems: "center",
                        //     // justifyContent: "center",
                        //     // overflow: "hidden",
                        //     // overflowX: "auto",
                        //     // overflowY: "auto",
                        // },
                        // classList: ["pdf-preview-div"],
                        // // properties: {
                        // //     innerHTML: `<iframe src="https://mozilla.github.io/pdf.js/web/viewer.html" frameborder="0" width="100%" height="100%"></iframe>`
                        // // }
                        // children: [
                        //     {
                        //         tag: "div",
                        //         styles: {
                        //             width: "100%",
                        //             height: "100%",
                        //             overflowX: "auto",
                        //             overflowY: "auto",
                        //         },
                        //         properties: {
                        //             innerHTML: '<div style="position: absolute; top:0; width:100%; background-color:#ccc; \
                        //                 display: flex; align-items: center; justify-content: center;">\
                        //                 <div id="page-percent"></div>\
                        //                 <div style="display: flex; justify-content: space-between;">\
                        //                     <button id="page-back-button">Back</button>/\
                        //                     <button id="page-forward-button">Forward</button>\
                        //                 </div>\
                        //                 <div style="display: flex; justify-content: space-between;">\
                        //                     <button id="page-zoom-in">放大</button>\
                        //                     <button id="page-zoom-out">缩小</button>\
                        //                 </div>\
                        //             </div>'
                        //         }
                        //     },
                        //     {
                        tag: "iframe",
                        styles: {
                            width: "100%",
                            height: "100%",
                            overflowX: "auto",
                            overflowY: "auto",
                        },
                        classList: ["pdf-preview-iframe"],
                        properties: {
                            // src: `chrome://${config.addonRef}/content/pdfjs/web/viewer.html?file=` + `chrome://${config.addonRef}/content/pdfjs/web/compressed.tracemonkey-pldi-09.pdf`,
                            src: `chrome://${config.addonRef}/content/43.html`,
                            // scrolling: "no",
                            frameborder: "0"
                        },
                        // listeners: [
                        //     {
                        //         type: "load",
                        //         listener: (e: Event) => {
                        //             console.log("加载", e)
                        //             const iframe = e.target as HTMLIFrameElement;
                        //             const resizeObserver = new ResizeObserver(entries => {
                        //                 for (let entry of entries) {
                        //                     const { width, height } = entry.contentRect;
                        //                     ztoolkit.log('Element size1 changed to:', width, height);
                        //                     // ztoolkit.log(mainNode.offsetWidth, mainNode.offsetHeight);
                        //                     // graphContainerDiv.style.width = `${width * 0.9 - 0.03 * ztoolkit.getGlobal("window").innerWidth}px`
                        //                     // mainContainerDiv.style.width = `${width * 0.9}px`
                        //                 }
                        //             });
                        //             // 观察特定的元素
                        //             resizeObserver.observe(iframe);
                        //         }
                        //     }
                        // ]
                        //         },
                        //     ],
                    }

                    ).open(
                        "预览",
                        {
                            width: 1000,
                            height: 600,
                            // fitContent: true,
                            top: 50,
                            left: 50,
                            resizable: true
                        }
                    )


            }


        })
    }
    //
    // const clickXButton = uploadFileComp.getElementsByClassName("cancel_x_img")[0]
    // clickXButton.addEventListener("click", () => {
    //     // ztoolkit.getGlobal("alert")("clicked")

    // })
    return uploadFileComp
}



async function filePickerCallback(file: File, sendButton: HTMLDivElement, selectFileButton: HTMLDivElement,
    userInput: HTMLTextAreaElement, displayFileFrame: HTMLDivElement, isUploading: boolean = false) {

    //检查一下格式
    const filename = file.name
    const filetype = file.type
    const fileSize = file.size
    if (filename.split(".").length < 2) {
        return
    } else if (filetype.split("/")[0] != "image" && filetype.split("/")[1] != "pdf") {
        return
    }
    const uploadFileComp = createUploadFileComp(filename, filetype, fileSize, displayFileFrame)

    setPref("isResponsing", true) // 文件上传完之前不能发送消息

    sendButton.classList.add("disabled")
    selectFileButton.classList.add("disabled")
    const result: any = await getPreSignedUrl(file.name)
    const preSignedUrl = result.url
    const objectName = result.object_name
    const fileId = result.file_id
    const fileName = result.file_name
    const fileType = result.file_type
    // ztoolkit.getGlobal("alert")(preSignedUrl)
    // ztoolkit.getGlobal("alert")(objectName)
    // ztoolkit.getGlobal("alert")(fileId)
    if (preSignedUrl && (objectName || fileId)) {
        uploadImage(file, preSignedUrl).then((isUploadFinish: boolean) => {
            ztoolkit.log(`是否已经上传: ${isUploadFinish}`)
            //检查是否上传
            checkUploadResult(fileId, fileName, fileType, objectName).then((checkResult: any) => {
                if (checkResult.isok) {
                    // ztoolkit.getGlobal("alert")(JSON.stringify(checkResult));
                    ztoolkit.log(JSON.stringify(checkResult));
                    // new ztoolkit.ProgressWindow("ChatGPT")
                    //     .createLine({
                    //         text: "文件上传成功!",
                    //         type: "success",
                    //         progress: 100,
                    //     })
                    //     .show();


                    // saveUploadFileInfoToServer(checkResult).then((uploadServerResult: any) => {
                    //     if (uploadServerResult.isok) {
                    // new ztoolkit.ProgressWindow("ChatGPT")
                    //     .createLine({
                    //         text: "文件信息上传成功!",
                    //         type: "success",
                    //         progress: 100,
                    //     })
                    //     .show();
                    new ztoolkit.ProgressWindow("ChatGPT", { closeTime: 1000 })
                        .createLine({
                            text: "文件上传成功!",
                            type: "success",
                            progress: 100,
                        })
                        .show();
                    setPref("isResponsing", false) // 文件上传完之前不能发送消息
                    // const sendButton: any = ztoolkit.getGlobal("document").querySelector(".send_button")
                    // const userInput: any = ztoolkit.getGlobal("document").querySelector(".send_button")
                    // ztoolkit.getGlobal("alert")(userInput.innerText)
                    // ztoolkit.getGlobal("alert")(userInput.textLength)
                    // if (userInput.textLength != 0) {
                    //     // ztoolkit.getGlobal("alert")("sendButton.classList.remove('disabled')")
                    //     sendButton.classList.remove("disabled")
                    // }

                    //上传成功后将file_id设置到pref
                    let fileRefs: any = getPref("selected_tab_chat_file_refs")
                    // ztoolkit.getGlobal("alert")(`file_refs: ${ fileRefs }`);
                    const newfileRefs: any = fileRefs + checkResult.id + ";"
                    setPref("selected_tab_chat_file_refs", newfileRefs)
                    // ztoolkit.getGlobal("alert")(`file_refs: ${ getPref("selected_tab_chat_file_refs") }`);
                    // 显示cancel_x_img
                    const clickXButton: any = uploadFileComp.getElementsByClassName("cancel_x_img")[0]
                    //显示预览图
                    const backImage: any = uploadFileComp.getElementsByClassName("img_back")[0]
                    const loadingImage: any = uploadFileComp.getElementsByClassName("img_loading")[0]
                    if (file.type.split("/")[0] === "image") {
                        backImage.style.height = "100%"
                        backImage.style.width = "100%"
                        backImage.style.objectFit = "cover"
                        backImage.style.objectPosition = "center"
                        // ztoolkit.getGlobal("alert")(backImage)
                        // ztoolkit.getGlobal("alert")(loadingImage)
                        loadingImage.hidden = true
                        backImage.src = checkResult.mini_url
                    } else if (file.type === "application/pdf") {
                        backImage.src = `chrome://${config.addonRef}/content/icons/pdf_icon.png`
                        loadingImage.hidden = true
                    }
                    clickXButton.hidden = false
                    clickXButton.addEventListener("click", () => {
                        // ztoolkit.getGlobal("alert")("clicked")
                        displayFileFrame.removeChild(uploadFileComp)
                        // 删除file_id
                        let fileRefs: any = getPref("selected_tab_chat_file_refs")
                        fileRefs = fileRefs.replace(checkResult.id + ";", "")
                        setPref("selected_tab_chat_file_refs", fileRefs)
                    })
                } else {
                    new ztoolkit.ProgressWindow("ChatGPT", { closeTime: 3000 })
                        .createLine({
                            text: "文件信息上传失败!",
                            type: "fail",
                            progress: 0,
                        })
                        .show();
                }

                //最后将两个按钮enabele
                selectFileButton.classList.remove("disabled")
                if (userInput.textLength != 0) {
                    sendButton.classList.remove("disabled")
                }
                // })

                // }
            })
        })



    }
}

async function tabPdfUpload(filePath: string, isCreateDisplay: boolean = false, isExist: boolean = false): Promise<{ isok: boolean, file_id: string }> {
    return new Promise(async (resolve, reject) => {
        setPref("isResponsing", true) // 文件上传完之前不能发送消息
        const uploadProgressWindow = new ztoolkit.ProgressWindow("ChatGPT").createLine({
            text: "上传中...",
            progress: 0,
        }).show()
        let progress_num = 0
        const Interval_1_id = setInterval(() => {
            progress_num = progress_num > 99 ? 1 : progress_num + 1
            uploadProgressWindow.changeLine({
                text: "上传中...",
                progress: progress_num,
            })
        }, 10)

        const doc = ztoolkit.getGlobal("document")
        const sendButton = doc.querySelector(".send_button") as HTMLDivElement
        const selectFileButton = doc.querySelector(".select-file-button") as HTMLTextAreaElement
        sendButton.classList.add("disabled")
        selectFileButton.classList.add("disabled")
        // const path = getTabPdfPath()
        const result: any = await getPreSignedUrl(filePath)
        const preSignedUrl = result.url
        const objectName = result.object_name
        const fileId = result.file_id
        const fileName = result.file_name
        const fileType = result.file_type
        // ztoolkit.getGlobal("alert")(preSignedUrl)
        // ztoolkit.getGlobal("alert")(objectName)
        // ztoolkit.getGlobal("alert")(fileId)
        if (preSignedUrl && (objectName || fileId)) {
            uploadImage(filePath, preSignedUrl).then((isUploadFinish: boolean) => {
                ztoolkit.log(`是否已经上传: ${isUploadFinish}`)
                //检查是否上传
                checkUploadResult(fileId, fileName, fileType, objectName).then(async (checkResult: any) => {
                    if (checkResult.isok) {
                        ztoolkit.log(JSON.stringify(checkResult));

                        //改为保存到sqlite
                        if (await insertNewFileInfo(getTabKeyAndPdfName().tabKey, checkResult.id)) {
                            clearInterval(Interval_1_id)
                            uploadProgressWindow.changeLine({
                                text: "文件上传成功!",
                                type: "success",
                                progress: 100,
                            })
                            setTimeout(() => {
                                uploadProgressWindow.close()
                            }, 1000)
                            setPref("isResponsing", false) // 文件上传完之前不能发送消息

                            if (isCreateDisplay) {
                                const displayFileFrame = doc.querySelector(".display-file-frame") as HTMLDivElement
                                const image_url = `chrome://${config.addonRef}/content/icons/pdf_icon.png`
                                const uploadFileComp = createUploadFileComp(fileName, fileType, checkResult.size, displayFileFrame, false, image_url, "")
                                displayFileFrame.append(uploadFileComp)
                                const cancelXButton = uploadFileComp.querySelector(".cancel_x_img") as HTMLImageElement
                                cancelXButton.src = `chrome://${config.addonRef}/content/icons/cancel_x.svg`
                                cancelXButton.hidden = false
                                cancelXButton.addEventListener("click", () => {
                                    // ztoolkit.getGlobal("alert")("clicked")
                                    displayFileFrame.removeChild(uploadFileComp)
                                    // 删除file_id
                                    let fileRefs: any = getPref("selected_tab_chat_file_refs")
                                    fileRefs = fileRefs.replace(checkResult.id + ";", "")
                                    setPref("selected_tab_chat_file_refs", fileRefs)
                                })
                            }
                            resolve({ isok: true, file_id: checkResult.id })
                        }

                        else {
                            new ztoolkit.ProgressWindow("ChatGPT", { closeTime: 3000 })
                                .createLine({
                                    text: "文件信息上传失败!",
                                    type: "fail",
                                    progress: 0,
                                })
                                .show();
                            resolve({ isok: false, file_id: "" })
                        }

                        //最后将两个按钮enabele
                        selectFileButton.classList.remove("disabled")
                        const userInput = doc.getElementById("user-input") as HTMLInputElement
                        if (userInput.textLength != 0) {
                            sendButton.classList.remove("disabled")
                        }

                        // saveUploadTabPdfInfoToServer(checkResult).then((uploadServerResult: any) => {
                        //     if (uploadServerResult.isok) {

                        //         clearInterval(Interval_1_id)
                        //         uploadProgressWindow.changeLine({
                        //             text: "文件上传成功!",
                        //             type: "success",
                        //             progress: 100,
                        //         })
                        //         setTimeout(() => {
                        //             uploadProgressWindow.close()
                        //         }, 1000)

                        //         // new ztoolkit.ProgressWindow("ChatGPT", { closeTime: 1000 })
                        //         //     .createLine({
                        //         //         text: "文件上传成功!",
                        //         //         type: "success",
                        //         //         progress: 100,
                        //         //     })
                        //         //     .show();
                        //         setPref("isResponsing", false) // 文件上传完之前不能发送消息
                        //         resolve({ isok: true, file_id: uploadServerResult.field_id })

                        //     } else {
                        //         new ztoolkit.ProgressWindow("ChatGPT", { closeTime: 3000 })
                        //             .createLine({
                        //                 text: "文件信息上传失败!",
                        //                 type: "fail",
                        //                 progress: 0,
                        //             })
                        //             .show();
                        //         resolve({ isok: false, file_id: "" })
                        //     }

                        //     //最后将两个按钮enabele
                        //     selectFileButton.classList.remove("disabled")
                        //     const userInput = doc.getElementById("user-input") as HTMLInputElement
                        //     if (userInput.textLength != 0) {
                        //         sendButton.classList.remove("disabled")
                        //     }
                        // })

                    }
                })
            })



        }
    })

}

async function filePickerCallback1(sendButton: HTMLDivElement, selectFileButton: HTMLDivElement, userInput: HTMLTextAreaElement) {

    const path = await new ztoolkit.FilePicker(
        "Import File",
        "open",
        [
            // ["自定义文件(*.png; *.jpg; *.bmp; *.pdf; *.doc; *.docx; *.xls; *.xlsx; *.ppt; *.pptx; *.txt; *.csv)",
            //     "*.png; *.jpg; *.bmp; *.pdf; *.doc; *.docx; *.xls; *.xlsx; *.ppt; *.pptx; *.txt; *.csv"],
            ["自定义文件(*.png; *.jpg; *.bmp; *.pdf;)",
                "*.png; *.jpg; *.bmp; *.pdf;"],
            // ["JPG File(*.jpg)", "*.jpg"],
            // ["BMP File(*.bmp)", "*.bmp"],
            // ["TIF File(*.tif)", "*.tif"],
            // ["PDF File(*.pdf1)", "*.pdf"],
            // ["DOC File(*.doc)", "*.doc"],
            // ["XLSX File(*.xlsx)", "*.xlsx"],
            // ["PPT File(*.ppt)", "*.ppt"],
            // ["TXT File(*.txt)", "*.txt"],
            // ["Any", "*.*"],
        ],
        "",
    ).open();
    sendButton.classList.add("disabled")
    selectFileButton.classList.add("disabled")
    // ztoolkit.getGlobal("alert")(`Selected 11 ${path}`);
    // if (path) {
    //     // uploadImage(path)
    //     const result: any = await getPreSignedUrl(path)
    //     const preSignedUrl = result.url
    //     const objectName = result.object_name
    //     const fileId = result.file_id
    //     const fileName = result.file_name
    //     const fileType = result.file_type
    //     ztoolkit.getGlobal("alert")(preSignedUrl)
    //     ztoolkit.getGlobal("alert")(objectName)
    //     ztoolkit.getGlobal("alert")(fileId)
    //     if (preSignedUrl && (objectName || fileId)) {
    //         uploadImage(path, preSignedUrl).then((isUploadFinish: boolean) => {
    //             ztoolkit.log(`是否已经上传: ${isUploadFinish}`)
    //             //检查是否上传
    //             checkUploadResult(fileId, fileName, fileType, objectName).then((checkResult: any) => {
    //                 if (checkResult.isok) {
    //                     // ztoolkit.getGlobal("alert")(JSON.stringify(checkResult));
    //                     ztoolkit.log(JSON.stringify(checkResult));
    //                     new ztoolkit.ProgressWindow("ChatGPT")
    //                         .createLine({
    //                             text: "文件上传成功!",
    //                             type: "success",
    //                             progress: 100,
    //                         })
    //                         .show();
    //                     saveUploadFileInfoToServer(checkResult).then((uploadServerResult: any) => {
    //                         if (uploadServerResult.isok) {
    //                             new ztoolkit.ProgressWindow("ChatGPT")
    //                                 .createLine({
    //                                     text: "文件信息上传成功!",
    //                                     type: "success",
    //                                     progress: 100,
    //                                 })
    //                                 .show();
    //                             //上传成功后将file_id设置到pref
    //                             let fileRefs: any = getPref("selected_tab_chat_file_refs")
    //                             ztoolkit.getGlobal("alert")(`file_refs: ${fileRefs}`);
    //                             const newfileRefs: any = fileRefs + checkResult.id + ";"
    //                             setPref("selected_tab_chat_file_refs", newfileRefs)
    //                             ztoolkit.getGlobal("alert")(`file_refs: ${getPref("selected_tab_chat_file_refs")}`);
    //                         } else {
    //                             new ztoolkit.ProgressWindow("ChatGPT")
    //                                 .createLine({
    //                                     text: "文件信息上传失败!",
    //                                     type: "fail",
    //                                     progress: 0,
    //                                 })
    //                                 .show();
    //                         }

    //                         //最后将两个按钮enabele
    //                         selectFileButton.classList.remove("disabled")
    //                         if (userInput.textContent != "") {
    //                             sendButton.classList.remove("disabled")
    //                         }
    //                     })

    //                 }
    //             })
    //         })



    //     }

    // } else {
    //     //最后将两个按钮enabele
    //     selectFileButton.classList.remove("disabled")
    //     if (userInput.textContent != "") {
    //         sendButton.classList.remove("disabled")
    //     }
    // }
    // //最后将两个按钮enabele
    // selectFileButton.classList.remove("disabled")
    // if (userInput.textContent != "") {
    //     sendButton.classList.remove("disabled")
    // }


}


function uploadImage(file: File | string, uploadFileUrl: string): Promise<boolean> {

    return new Promise(async (resolve, reject) => {

        const hostName = new URL(uploadFileUrl).host
        if (typeof file === "object") { //File返回object类型
            // const fileBytes = await IOUtils.read(filePath)
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = function (e) {
                const content: any = e.target?.result
                const fileBytes = new Uint8Array(content)
                ztoolkit.log(`uint8长度: ${fileBytes.length}`)
                // const fileExtension = filePath.slice(((filePath.lastIndexOf(".") - 1) >>> 0) + 2);

                try {

                    const headers = {
                        "Host": hostName,
                        "Content-Type": file.type,
                        "Content-Length": file.size.toString(),
                    }
                    sendUint8ArrayFile(fileBytes, uploadFileUrl, "PUT", headers).then((responseText: string) => {
                        // const responseJson = JSON.parse(responseText)
                        ztoolkit.log(responseText)
                        // ztoolkit.getGlobal("alert")(`上传文件返回值: ${responseText}`);
                        // new ztoolkit.ProgressWindow("ChatGPT")
                        //     .createLine({
                        //         text: "上传完成!",
                        //         type: "success",
                        //         progress: 100,
                        //     })
                        //     .show();
                        // return true
                        resolve(true)
                    })
                } catch (e: any) {
                    ztoolkit.log(e)
                    new ztoolkit.ProgressWindow("ChatGPT")
                        .createLine({
                            text: e,
                            type: "fail",
                            progress: 0,
                        })
                        .show();
                    // return false
                    resolve(false)
                }
            }
        } else if (typeof file === "string") {
            const path = getTabPdfPath()
            // ztoolkit.getGlobal("alert")(path)
            const file_name = file.split("\\").pop() || ""
            const file_type = file_name?.split(".").pop() || ""
            IOUtils.read(path).then((uint8Array: Uint8Array) => {
                // ztoolkit.getGlobal("alert")(uint8Array)
                // ztoolkit.getGlobal("alert")(uint8Array.byteLength)
                try {

                    const headers = {
                        "Host": hostName,
                        "Content-Type": file_type_map[file_type][0],
                        "Content-Length": uint8Array.byteLength.toString(),
                    }
                    sendUint8ArrayFile(uint8Array, uploadFileUrl, "PUT", headers).then((responseText: string) => {
                        // const responseJson = JSON.parse(responseText)
                        ztoolkit.log(responseText)

                        resolve(true)
                    })
                } catch (e: any) {
                    ztoolkit.log(e)
                    new ztoolkit.ProgressWindow("ChatGPT")
                        .createLine({
                            text: e,
                            type: "fail",
                            progress: 0,
                        })
                        .show();
                    // return false
                    resolve(false)
                }

            })
        }

        // const uri = Zotero.File.generateDataURI(filePath, "image/png")
        // const uri = Zotero.File.generateDataURI("C:/Users/DELL/Desktop/12312132132131.jpg", "image/png")
        // ztoolkit.log(`uri: ${uri}`)

        // reader.readAsArrayBuffer()
        // new Blob()
        // new File()
        // reader.readAsArrayBuffer()
        // ztoolkit.getGlobal("console").log(filePath)
        // ztoolkit.getGlobal("fetch")("https://www.baidu.com").then(res => {
        //     res.text().then(text => {
        //         ztoolkit.getGlobal("alert")(text)
        //     })
        // })
        // const fliepath = filePath.split("\\").join('/')
        // ztoolkit.getGlobal("console").log(fliepath)
        // ztoolkit.getGlobal("fetch")(uri).then(async res => {
        //     if (res.ok) {
        //         res.arrayBuffer().then(arraybuffer => {
        //             const uint8Array = new Uint8Array(arraybuffer)
        //             ztoolkit.log(`uint8长度: ${uint8Array.length}`)
        //             const fileExtension = filePath.slice(((filePath.lastIndexOf(".") - 1) >>> 0) + 2);
        //             const hostName = new URL(uploadFileUrl).host
        //             try {

        //                 const headers = {
        //                     "Host": hostName,
        //                     "Content-Type": file_type_map[fileExtension][0],
        //                     "Content-Length": uint8Array.byteLength.toString(),
        //                 }
        //                 sendUint8ArrayFile(uint8Array, uploadFileUrl, "PUT", headers).then((responseText: string) => {
        //                     // const responseJson = JSON.parse(responseText)
        //                     ztoolkit.log(responseText)
        //                     // ztoolkit.getGlobal("alert")(`上传文件返回值: ${responseText}`);
        //                     new ztoolkit.ProgressWindow("ChatGPT")
        //                         .createLine({
        //                             text: "上传完成!",
        //                             type: "success",
        //                             progress: 100,
        //                         })
        //                         .show();
        //                     // return true
        //                     resolve(true)
        //                 })
        //             } catch (e: any) {
        //                 ztoolkit.log(e)
        //                 new ztoolkit.ProgressWindow("ChatGPT")
        //                     .createLine({
        //                         text: e,
        //                         type: "fail",
        //                         progress: 0,
        //                     })
        //                     .show();
        //                 // return false
        //                 resolve(false)
        //             }
        //         })
        //     }

        // })

        // IOUtils.read(filePath).then((fileBytes: Uint8Array) => {
        //     ztoolkit.log(fileBytes)
        //     ztoolkit.log(fileBytes.byteLength)
        //     ztoolkit.getGlobal("alert")(fileBytes.byteLength)
        //     ztoolkit.log(fileBytes.length)
        //     const fileExtension = filePath.slice(((filePath.lastIndexOf(".") - 1) >>> 0) + 2);
        //     const hostName = new URL(uploadFileUrl).host
        //     try {

        //         const headers = {
        //             "Host": hostName,
        //             "Content-Type": file_type_map[fileExtension][0],
        //             "Content-Length": fileBytes.byteLength.toString(),
        //         }
        //         sendUint8ArrayFile(fileBytes, uploadFileUrl, "PUT", headers).then((responseText: string) => {
        //             // const responseJson = JSON.parse(responseText)
        //             ztoolkit.log(responseText)
        //             // ztoolkit.getGlobal("alert")(`上传文件返回值: ${responseText}`);
        //             new ztoolkit.ProgressWindow("ChatGPT")
        //                 .createLine({
        //                     text: "上传完成!",
        //                     type: "success",
        //                     progress: 100,
        //                 })
        //                 .show();
        //             // return true
        //             resolve(true)
        //         })
        //     } catch (e: any) {
        //         ztoolkit.log(e)
        //         new ztoolkit.ProgressWindow("ChatGPT")
        //             .createLine({
        //                 text: e,
        //                 type: "fail",
        //                 progress: 0,
        //             })
        //             .show();
        //         // return false
        //         resolve(false)
        //     }
        // })

    })

}


// 上传后需要通过/file接口查询上传结果
async function checkUploadResult(fileId: string, fileName: string, fileType: string, fileObjectName: string): Promise<{}> {
    const maxRetryCount = 3
    const url = "https://kimi.moonshot.cn/api/file"
    const body = {
        "type": file_type_map[fileType][1],
        "name": fileName,
        "object_name": fileObjectName,
        "chat_id": "",
        "file_id": fileId
    }
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer {}`,
        "Host": "kimi.moonshot.cn",
    }
    for (let i = 0; i < maxRetryCount; i++) {
        let result: any = await getKimi(url, "POST", body, headers)
        if ("error" in result) {
            if (result.error === "其他错误") {
                return { isok: false }
            } else {
                await getAccessToken()
            }
        } else {
            // new ztoolkit.ProgressWindow("Check Upload File")
            //     .createLine({
            //         text: "检查文件上传成功!",
            //         type: "success",
            //         progress: 100,
            //     })
            //     .show();
            result['isok'] = true
            return result
        }
    }
    // new ztoolkit.ProgressWindow("Check Upload File")
    //     .createLine({
    //         text: "检查文件上传失败!",
    //         type: "fail",
    //         progress: 100,
    //     })
    //     .show();
    return { isok: false }
}

// 首先获取Pre-Signed-Url
async function getPreSignedUrl(filePath: string): Promise<{}> {
    const maxRetryCount = 3
    const file_name = filePath.split("\\").pop() || ""
    const file_type = file_name?.split(".").pop() || ""
    const url = "https://kimi.moonshot.cn/api/pre-sign-url"
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer {}`,
        "Host": "kimi.moonshot.cn",
    }
    const body = {
        "action": file_type_map[file_type][1],
        "name": file_name
    }
    for (let i = 0; i < maxRetryCount; i++) {
        let result: any = await getKimi(url, "POST", body, headers)
        if ("error" in result) {
            if (result.error === "其他错误") {
                return { isok: false }
            } else {
                await getAccessToken()
            }
        } else {
            // new ztoolkit.ProgressWindow("Uplaod File")
            //     .createLine({
            //         text: "获取预签名地址成功!",
            //         type: "success",
            //         progress: 100,
            //     })
            //     .show();
            result['file_name'] = file_name
            result['file_type'] = file_type
            result['isok'] = true
            return result
        }
    }
    // new ztoolkit.ProgressWindow("Uplaod File")
    //     .createLine({
    //         text: "获取预签名地址失败!",
    //         type: "fail",
    //         progress: 100,
    //     })
    //     .show();
    return { isok: false }
}


//将file数据提交到服务器,保存到数据库中
async function saveUploadTabPdfInfoToServer(fileInfo: any): Promise<{}> {
    const url = `${BASEURL}/save_tab_file_id/`
    const body = {
        user_id: getPref("userid"),
        selected_tab_key: getTabKeyAndPdfName().tabKey,
        file_id: fileInfo.id,
        file_name: fileInfo.name
    }

    ztoolkit.log(JSON.stringify(body))
    try {
        const uploadFileInfoToServerXHR = await Zotero.HTTP.request("POST", url, { body: JSON.stringify(body) })
        const response = JSON.parse(uploadFileInfoToServerXHR.responseText)
        if (response.status) {
            return { isok: true, file_id: fileInfo.id }
        } else {
            return { isok: false }
        }

    } catch (e: any) {
        return { isok: false }
    }


}

//将file数据提交到服务器,保存到数据库中
async function saveUploadFileInfoToServer(fileInfo: {}): Promise<{}> {
    const url = `${BASEURL}/save_upload_file_info/`
    let body: any = fileInfo
    body['user_id'] = getPref("userid")
    body['name'] = body['name'].slice(0, 512)
    ztoolkit.log(JSON.stringify(body))
    try {
        const uploadFileInfoToServerXHR = await Zotero.HTTP.request("POST", url, { body: JSON.stringify(body) })
        const response = JSON.parse(uploadFileInfoToServerXHR.responseText)
        if (response.status) {
            return { isok: true }
        } else {
            return { isok: false }
        }

    } catch (e: any) {
        return { isok: false }
    }


}


function convertBytes(bytes: number, precision: number): string {
    let units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let number = bytes;
    let unitIndex = 0;

    // 循环直到字节数小于1024或者达到TB
    while (number >= 1024 && unitIndex < units.length - 1) {
        number /= 1024;
        unitIndex++;
    }

    // 根据所需的精度四舍五入到指定的小数位数
    return number.toFixed(precision) + ' ' + units[unitIndex];
}

// 示例用法：


export {
    filePickerCallback,
    tabPdfUpload,
    createUploadFileComp,
}