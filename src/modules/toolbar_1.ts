// import { config } from "../../package.json"
// import { getTabPdfPath } from "../utils/file";
// import { getPref, setPref } from "../utils/prefs";
// import { queryFileId } from "../utils/sqlite";
// import { getTabKeyAndPdfName } from "../utils/util";
// import { createUploadFileComp, tabPdfUpload } from "./file";
// import { ICONS } from "./svg";

// export async function initReaderMenu() {

//     Zotero.Reader.registerEventListener(
//         "renderToolbar",
//         readerToolbarCallback,
//         config.addonID,
//     );

//     Zotero.Reader._readers.forEach(buildReaderMenuButton);
// }


// async function buildReaderMenuButton(reader: _ZoteroTypes.ReaderInstance) {
//     await reader._initPromise;
//     const customSections = reader._iframeWindow?.document.querySelector(
//         ".toolbar .custom-sections",
//     );
//     if (!customSections) {
//         return;
//     }
//     const append = (...args: (string | Node)[]) => {
//         customSections.append(
//             ...Components.utils.cloneInto(args, reader._iframeWindow, {
//                 wrapReflectors: true,
//                 cloneFunctions: true,
//             }),
//         );
//     };

//     readerToolbarCallback({
//         append,
//         reader,
//         doc: customSections.ownerDocument,
//         type: "renderToolbar",
//         params: {},
//     });
// }


// async function readerToolbarCallback(
//     event: Parameters<_ZoteroTypes.Reader.EventHandler<"renderToolbar">>[0],
// ) {
//     const { append, doc, reader } = event;
//     // getReaderMenuPopup(reader);
//     const button = ztoolkit.UI.createElement(doc, "button", {
//         namespace: "html",
//         classList: [
//             "toolbar-button",
//             "toolbar-dropdown-button",
//             `${config.addonRef}-reader-button`,
//         ],
//         properties: {
//             tabIndex: -1,
//             title: "发送当前文章",
//         },
//         listeners: [
//             {
//                 type: "click",
//                 listener: async (ev: Event) => {
//                     //首先查询数据库中是否已经上传过这个文件
//                     const item_key = getTabKeyAndPdfName().tabKey;
//                     const file_id = await queryFileId(item_key) as string;
//                     const tabPdfPath = getTabPdfPath()
//                     // const fileInof = await IOUtils.stat(tabPdfPath)
//                     // console.log(fileInof)
//                     // return
//                     if (file_id) {
//                         //说明上传过
//                         //调用kimi的api查询文件信息
//                         const displayFileFrame = document.querySelector(".display-file-frame") as HTMLDivElement
//                         const image_url = `chrome://${config.addonRef}/content/icons/pdf_icon.png`
//                         const fileInof = await IOUtils.stat(tabPdfPath)
//                         // console.log(fileInof)
//                         const size = fileInof.size || 0
//                         const uploadFileComp = createUploadFileComp(tabPdfPath.split(/[\\/]/).pop() || "", "application/pdf", size, displayFileFrame, false, image_url, "")
//                         console.log("hello")
//                         displayFileFrame.append(uploadFileComp)
//                         const cancelXButton = uploadFileComp.querySelector(".cancel_x_img") as HTMLImageElement
//                         cancelXButton.src = `chrome://${config.addonRef}/content/icons/cancel_x.svg`
//                         cancelXButton.hidden = false
//                         const refs = getPref("selected_tab_chat_file_refs") + file_id + ";"
//                         setPref("selected_tab_chat_file_refs", refs)
//                         cancelXButton.addEventListener("click", () => {
//                             // ztoolkit.getGlobal("alert")("clicked")
//                             displayFileFrame.removeChild(uploadFileComp)
//                             // 删除file_id
//                             let fileRefs: any = getPref("selected_tab_chat_file_refs")
//                             fileRefs = fileRefs.replace(file_id + ";", "")
//                             setPref("selected_tab_chat_file_refs", fileRefs)
//                         })
//                     } else {
//                         //说明没有上传过
//                         // return

//                         tabPdfUpload(tabPdfPath, true).then((isupload: { isok: boolean, file_id: string }) => {
//                             if (isupload.isok) {
//                                 new ztoolkit.ProgressWindow("Kimi", { closeTime: 2000 })
//                                     .createLine({
//                                         text: "已上传pdf",
//                                         type: "success",
//                                         progress: 100
//                                     }).show()
//                                 const refs = getPref("selected_tab_chat_file_refs") + isupload.file_id + ";"
//                                 setPref("selected_tab_chat_file_refs", refs)
//                             }
//                         })

//                     }
//                 },
//             },
//         ],
//     });


//     // const buttonIcon = await getIcon(`chrome://${config.addonRef}/content/icons/send.svg`)
//     // const iconImg = ztoolkit.UI.createElement(doc, "img", {
//     //     properties: {
//     //         src: `chrome://${config.addonRef}/content/icons/send.svg`,
//     //     },
//     // })
//     // button.append(iconImg);

//     button.innerHTML = `${ICONS.sendICON}`;
//     append(button);
// }

