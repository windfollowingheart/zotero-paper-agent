import { BASEURL } from "../utils/ip"
import { getTabKeyAndPdfName } from "../utils/util"
import { getPref, setPref } from "../utils/prefs"
import { create } from "domain"
import { getTabPdfPath } from "../utils/file"
import { config } from "../../package.json";
import { createMessageBox } from "../utils/message"
import { queryChatInfo, updateChatInfo } from "../utils/sqlite"
import { getChatHistory } from "./history"
import { create_bot_message_box, create_user_message_box, getChatId, markdown } from "./chat"
import { getKimi } from "../utils/http"
import { getAccessToken } from "./token"
import { createUploadFileComp } from "./file"
import { get } from "http"

function createChatListDiv(): HTMLDivElement {
    const doc = ztoolkit.getGlobal("document")
    const chatListDiv = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            height: "100%",
            // width: "100px",
            backgroundColor: "#EDEDED",
            // backgroundColor: "rgba(202, 202, 202, 0.5)",
            // backgroundColor: "linear-gradient(0deg,rgba(202, 202, 202, 1.0) 0%, rgba(202, 202, 202, 0.9) 100%)",
            position: "absolute",
            left: "0px",
            top: "0px",
            overflow: "hidden",
            overflowY: "auto",
            scrollbarWidth: "thin",
            fontFamily: "Helvetica",

        },
        classList: ["chat-list"],
    })
    // searchChatList(chatListDiv)
    return chatListDiv
}

async function searchChatList(chatListDiv: HTMLDivElement) {
    //先清空之前的记录
    chatListDiv.innerHTML = ""

    const doc = ztoolkit.getGlobal("document")
    const chatInfoList = await queryChatInfo()
    chatInfoList.reverse()

    chatInfoList.forEach((chatInfo: any, index: number) => {
        if (chatInfo.is_del) return
        const create_time = chatInfo.create_time
        const final_str = ` ${index}.  ${create_time}`
        const chatItem = ztoolkit.UI.createElement(doc, "div", {
            namespace: "html",
            styles: {
                height: "30px",
                width: "100%",
                backgroundColor: "#f3f3f3",
                border: "1px solid #e6e6e6",
                // margin: "5px 0px",
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
                // fontFamily: "Microsoft YaHei",
                // fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace",
                overflow: "hidden",
                whiteSpace: "nowrap",
                // justifyContent: "space-between",
                // padding: "0px 10px",
                // cursor: "pointer"
            },
            classList: ["chat-list-item"]

        })

        if (chatInfo.chat_id === getPref("selected_tab_chat_id")) {
            chatItem.style.backgroundColor = "#91A6F5"
        }

        const chatItemText = ztoolkit.UI.createElement(doc, "div", {
            namespace: "html",
            styles: {
                width: "70%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: "0px 10px",
                // cursor: "pointer",
            },
            classList: ["chat-item-text"]
        })
        chatItemText.textContent = final_str
        chatItemText.addEventListener("click", () => {
            const win = ztoolkit.getGlobal("window")
            // ztoolkit.log(win.getSelection()?.toString())
            // ztoolkit.getGlobal("alert")(win.getSelection()?.toString())
        })


        const chatItemContinue = ztoolkit.UI.createElement(doc, "div", {
            namespace: "html",
            styles: {
                width: "20%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // cursor: "pointer",

            },
            children: [
                {
                    tag: "div",
                    styles: {
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        // fontFamily: "SimSun"

                    },
                    classList: ["chat-continue-btn"],
                },
                {
                    tag: "div",
                    namespace: "html",
                    styles: {
                        display: "none"
                    },
                    classList: ["chat-info-div"],
                }
            ],

        })

        const chatContinueBtn = chatItemContinue.childNodes[0]
        // chatContinueBtn.textContent = "接着聊"
        chatContinueBtn.textContent = "continue"
        const chatInfoDiv: any = chatItemContinue.childNodes[1]
        chatInfoDiv.textContent = JSON.stringify(chatInfo)

        chatContinueBtn.addEventListener("click", () => {
            // new ztoolkit.Clipboard().addText(chatInfoDiv.textContent).copy()
            const chat_id = chatInfo.chat_id
            if (chat_id === getPref("selected_tab_chat_id") && (doc.querySelector(".user_text_message"))) {
                new ztoolkit.ProgressWindow("切换聊天", { closeTime: 1000 }).createLine({
                    text: "已经切换",
                    type: "success",
                    progress: 100
                }).show()
                chatListDiv.classList.toggle("chat-list-show")
                return
            }
            changeChatHistory(chat_id, chatListDiv, true)
        })

        const chatItemDelete = ztoolkit.UI.createElement(doc, "div", {
            namespace: "html",
            styles: {
                width: "15%",
                height: "100%",
                display: "flex",
                marginLeft: "10px",
                alignItems: "center",
                cursor: "pointer",
                // pointerEvents: "none",
                // display: "none"

            },
            classList: ["chat-delete-btn"]

        })

        // chatItemDelete.textContent = "删除"
        chatItemDelete.textContent = "delete"
        chatItemDelete.addEventListener("click", () => {
            const yesFunc = async () => {
                //发送请求向数据库删除记录
                const chat_id = JSON.parse(chatInfoDiv.textContent).chat_id
                const isUpdateChatInfo = await updateChatInfo(chat_id, "", 0, 1)
                if (isUpdateChatInfo) {
                    console.log("更新tabchatinfo成功")
                    //删除完成后需要更新chatList
                    searchChatList(chatListDiv)


                    new ztoolkit.ProgressWindow("删除成功", { closeTime: 1000 })
                        .createLine({
                            text: "",
                            type: "success",
                            progress: 100
                        }).show()

                } else {
                    ztoolkit.log("更新tabchatinfo失败")
                }
            }
            createMessageBox("确定删除该对话吗？", yesFunc)

        })


        const overTokenStatusDiv = ztoolkit.UI.createElement(doc, "div", {
            namespace: "html",
            styles: {
                width: "30%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
            children: [
                {
                    tag: "div",
                    namespace: "html",
                    styles: {
                        height: "60%",
                        width: "90%",
                        borderRadius: "3px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "9px",
                        fontWeight: "bold",
                        userSelect: "none",
                        pointerEvents: "none",
                        color: "#fff",
                    },
                    classList: ["chat-over-token-status-icon"],
                }
            ],
            classList: ["chat-over-token-status-div"]
        })
        const overTokenStatusIcon = overTokenStatusDiv.childNodes[0] as HTMLDivElement
        if (chatInfo.is_over_token) {
            overTokenStatusIcon.textContent = "TOKEN"
            overTokenStatusIcon.style.backgroundColor = "red"
        } else {
            overTokenStatusIcon.textContent = "NORMAL"
            overTokenStatusIcon.style.backgroundColor = "green"
        }

        // chatItem.append(chatItemText, chatItemContinue, chatItemDelete)
        chatItem.append(chatItemText, overTokenStatusDiv, chatItemContinue, chatItemDelete)
        chatListDiv.append(chatItem)

    })
}

async function searchChatList1(chatListDiv: HTMLDivElement) {
    const doc = ztoolkit.getGlobal("document")
    const url = `${BASEURL}/get_chat_list/`
    const body = {
        user_id: getPref("userid"),
        selected_tab_key: getTabKeyAndPdfName().tabKey,
        // get_number: 50 //单次最多返回50条记录
    }
    Zotero.HTTP.request("POST", url, {
        body: JSON.stringify(body),
        requestObserver: (xhr: XMLHttpRequest) => {
            xhr.onload = (e) => {
                if (xhr.status === 200) {
                    // ztoolkit.getGlobal("alert")(xhr.responseText)
                    const chatList = JSON.parse(xhr.responseText).chat_list
                    chatList.reverse()
                    ztoolkit.log(chatList)

                    chatList.forEach((chat: any, index: number) => {
                        const create_time = chat.chat_created_at
                        const day = create_time.split("T")[0]
                        const time = create_time.split("T")[1].split(".")[0]
                        const time_str = day + " " + time
                        const chat_name = chat.chat_name.length > 20 ? chat.chat_name.slice(0, 17) + "..." : chat.chat_name
                        // const final_str = ` ${index}.` + ' ' + `${chat_name}` + '   ' + `${time_str}`
                        const final_str = ` ${index}.  ${time_str}`
                        const chatItem = ztoolkit.UI.createElement(doc, "div", {
                            namespace: "html",
                            styles: {
                                height: "30px",
                                width: "100%",
                                backgroundColor: "#f3f3f3",
                                border: "1px solid #e6e6e6",
                                // margin: "5px 0px",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "12px",
                                // fontFamily: "Microsoft YaHei",
                                // fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace"
                                // justifyContent: "space-between",
                                // padding: "0px 10px",
                                // cursor: "pointer"
                            },
                            classList: ["chat-list-item"]

                        })

                        if (chat.chat_id === getPref("selected_tab_chat_id")) {
                            chatItem.style.backgroundColor = "#91A6F5"
                        }

                        const chatItemText = ztoolkit.UI.createElement(doc, "div", {
                            namespace: "html",
                            styles: {
                                width: "85%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                padding: "0px 10px",
                                // cursor: "pointer",

                            },
                            classList: ["chat-item-text"]
                        })
                        chatItemText.textContent = final_str
                        chatItemText.addEventListener("click", () => {
                            const win = ztoolkit.getGlobal("window")
                            // ztoolkit.log(win.getSelection()?.toString())
                            // ztoolkit.getGlobal("alert")(win.getSelection()?.toString())
                        })
                        // chatItemText.addEventListener("click", () => {
                        //     // const displayIframe = ztoolkit.UI.createElement(doc, "iframe", {
                        //     //     namespace: "html",
                        //     //     styles: {
                        //     //         position: "fixed",
                        //     //         backgroundColor: "white",
                        //     //         top: "50%",
                        //     //         left: "50%",
                        //     //         transform: "translate(-50%,-50%)",
                        //     //         width: "500px",
                        //     //         height: "500px",
                        //     //         overflowY: "auto",
                        //     //         overflowX: "auto",
                        //     //     },
                        //     //     attributes: {
                        //     //         src: ""
                        //     //     }
                        //     // })
                        //     // const aa = ztoolkit.UI.createElement(doc, "div", {
                        //     //     namespace: "html",
                        //     //     styles: {
                        //     //         position: "fixed",
                        //     //         backgroundColor: "white",
                        //     //         top: "50%",
                        //     //         left: "50%",
                        //     //         transform: "translate(-50%,-50%)",
                        //     //         width: "500px",
                        //     //         height: "500px",
                        //     //         overflowY: "auto",
                        //     //         overflowX: "auto",
                        //     //     }
                        //     // })
                        //     // 
                        // })


                        const chatItemContinue = ztoolkit.UI.createElement(doc, "div", {
                            namespace: "html",
                            styles: {
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                // cursor: "pointer",

                            },
                            children: [
                                {
                                    tag: "div",
                                    styles: {
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",

                                    },
                                    classList: ["chat-continue-btn"],
                                },
                                {
                                    tag: "div",
                                    namespace: "html",
                                    styles: {
                                        display: "none"
                                    },
                                    classList: ["chat-info-div"],
                                }
                            ],

                        })

                        const chatContinueBtn = chatItemContinue.childNodes[0]
                        // chatContinueBtn.textContent = "接着聊"
                        chatContinueBtn.textContent = "con"
                        const chatInfoDiv: any = chatItemContinue.childNodes[1]
                        chatInfoDiv.textContent = JSON.stringify(chat)

                        chatContinueBtn.addEventListener("click", () => {

                            new ztoolkit.Clipboard().addText(chatInfoDiv.textContent).copy()
                        })



                        const chatItemDelete = ztoolkit.UI.createElement(doc, "div", {
                            namespace: "html",
                            styles: {
                                width: "15%",
                                height: "100%",
                                // display: "flex",
                                marginLeft: "5px",
                                alignItems: "center",
                                cursor: "pointer",
                                pointerEvents: "none",
                                display: "none"

                            },
                            classList: ["chat-delete-btn"]

                        })

                        chatItemDelete.textContent = "删除"
                        chatItemDelete.addEventListener("click", () => {
                            // const path = getTabPdfPath()
                            // const path = "C:\\\\Users\\\\DELL\\\\Desktop\\\\Multi-focus image fusion with a deep convolutional neural network.pdf"
                            // ztoolkit.getGlobal("alert")(path)
                            // IOUtils.read(path).then((uint8Array: Uint8Array) => {
                            //     ztoolkit.getGlobal("alert")(uint8Array)
                            //     ztoolkit.getGlobal("alert")(uint8Array.byteLength)

                            // })
                            const yesFunc = () => {
                                //发送请求向数据库删除记录

                            }


                            createMessageBox("确定删除该对话吗？", yesFunc)

                        })
                        chatItem.append(chatItemText, chatItemContinue, chatItemDelete)
                        chatListDiv.append(chatItem)

                        // const chatInfoDiv: any = chatItemContinue.getElementsByClassName("chat-info-div")[0]
                        // chatInfoDiv.textContent = JSON.stringify(chat)
                        // chatItemContinue.addEventListener("click", () => {
                        //     // const chatInfoDiv: any = chatItemContinue.getElementsByClassName("chat-info-div")[0]
                        //     // chatInfoDiv.textContent = JSON.stringify(chat)
                        //     new ztoolkit.Clipboard().addText(chatInfoDiv.textContent).copy()
                        // })
                        // chatItemContinue.addEventListener("click", (e: any) => {
                        //     ztoolkit.getGlobal("console").log(chatItemContinue.childNodes)
                        //     ztoolkit.getGlobal("console").log(e)
                        //     // const chatInfoDiv1: any = chatItemContinue.childNodes[0]
                        //     // ztoolkit.getGlobal("alert")(chatInfoDiv1.textContent)
                        //     new ztoolkit.Clipboard().addText(e).copy()
                        // })



                    })
                }
            }

        }
    })
}


async function changeChatHistory(chat_id: string, chatListDiv: HTMLDivElement, is_toggle=true) {
    //首先查一查是否有chat_id
    if(!chat_id){
        getChatId(true)
        return
    }
    console.log("正在初始化聊天历史记录")
    getChatHistory(chat_id).then((results: any[]) => {
        if (results.length === 0) {
            // // ztoolkit.getGlobal("alert")("获取历史错误")
            // new ztoolkit.ProgressWindow("", { closeTime: 1000 })
            //     .createLine({
            //         text: "当前聊条没有历史记录",
            //         type: "error",
            //         progress: 100
            //     }).show()
            if (is_toggle) chatListDiv.classList.toggle("chat-list-show")
            return
        } else {
            const mainContainer = document.querySelector(".main-container") as HTMLDivElement
            const displayFileFrame = mainContainer?.querySelector(".display-file-frame") as HTMLDivElement
            const chatFrame = mainContainer?.querySelector(".chat-frame") as HTMLDivElement
            if (mainContainer && displayFileFrame && chatFrame) {
                //首先清空聊天框
                while (chatFrame.childNodes.length != 0) {
                    chatFrame.removeChild(chatFrame.childNodes[0])
                }

                //更新pref当前chat_id
                setPref("selected_tab_chat_id", chat_id)
                console.log("获取到历史", results)
                results.forEach((res: any) => {
                    const content = res.content
                    const role = res.role
                    if (role === "user") {
                        const userMessageDiv = create_user_message_box(document, displayFileFrame, content)
                        const userFileMessage: any = userMessageDiv.querySelector(".user_file_message")
                        chatFrame.appendChild(userMessageDiv)
                        if (res.file_refs) {
                            res.file_refs.forEach(async (file_info: any) => {
                                if (!file_info) return
                                let uploadImageComp: HTMLDivElement
                                if (file_info.type === "image") {
                                    //说明是图片
                                    uploadImageComp = createUploadFileComp(file_info.name, file_info.content_type, file_info.size, displayFileFrame, false, file_info.mini_url, file_info.presigned_url, true)

                                } else {
                                    //说明是pdf
                                    const image_url = `chrome://${config.addonRef}/content/icons/pdf_icon.png`
                                    uploadImageComp = createUploadFileComp(file_info.name, file_info.content_type, file_info.size, displayFileFrame, false, image_url, file_info.presigned_url, true)
                                    // uploadImageComp = createUploadFileComp(file_info.name, file_info.content_type, file_info.size, displayFileFrame, false, file_info.mini_url)
                                }
                                userFileMessage.append(uploadImageComp)
                            })
                        }
                    } else {
                        // const botMessageDiv = create_bot_message_box(doc, markdown.render(content))
                        const botMessageDiv = create_bot_message_box(document, content)
                        chatFrame.appendChild(botMessageDiv)
                    }
                    chatFrame.scrollTop = chatFrame.scrollHeight


                })
                if (is_toggle) chatListDiv.classList.toggle("chat-list-show")


            }
        }
    })
}


export {
    createChatListDiv,
    searchChatList,
    changeChatHistory
}