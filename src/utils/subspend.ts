import { config } from "../../package.json";
import { create_bot_message_box, create_user_message_box, get_bot_response } from "../modules/chat";
import { tabPdfUpload } from "../modules/file";
import { getTabPdfPath } from "./file";
import { sendUint8ArrayFile } from "./http";
import { getPref, setPref } from "./prefs";
import { queryFileId } from "./sqlite";
import { getTabKeyAndPdfName } from "./util";


//创建悬浮窗
function createSubspendButton(doc: Document, text: string = "",
    sendButton: HTMLDivElement, selectFileButton: HTMLDivElement, displayFileFrame: HTMLDivElement, chatFrame: HTMLDivElement
): HTMLDivElement {


    //创建功能按钮

    const ButtonContainer = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "5px",
            width: "100%",
            // height: "180px",
            overflow: "hidden",
            padding: "10px",
            backgroundColor: "#fff"
        }
    })

    //1. ai翻译
    const translateButton = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
            height: "30px",
            backgroundColor: "#4CAF50",
            color: "white",
            // marginBottom: "10px",
            cursor: "pointer",
            borderRadius: "5px",
            userSelect: "none"
        },
        listeners: [
            {
                type: "click",
                listener: () => {
                    if (getPref("isResponsing")) {
                        return
                    }
                    // translateButton.textContent = "翻译中"
                    // translateButton.style.backgroundColor = "#d1694f"
                    // translateButton.style.color = "#edf3ee"
                    // translateButton.style.cursor = "wait"
                    // ztoolkit.getGlobal("alert")(text)
                    if (text) {
                        const message = text + "\n\n" + "请翻译为中文"
                        // ztoolkit.getGlobal("alert")(message)
                        sendAIMessage(message, sendButton, selectFileButton, displayFileFrame, chatFrame)
                    }
                }
            }
        ]
    })

    translateButton.textContent = "AI翻译"

    // 2.解释这段话(结合论文上下文)
    const explainButton = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
            height: "30px",
            backgroundColor: "#4CAF50",
            color: "white",
            // marginBottom: "10px",
            cursor: "pointer",
            borderRadius: "5px",
            userSelect: "none"
        },
        listeners: [
            {
                type: "click",
                listener: async () => {

                    if (getPref("isResponsing")) {
                        return
                    }
                    // translateButton.textContent = "翻译中"
                    // translateButton.style.backgroundColor = "#d1694f"
                    // translateButton.style.color = "#edf3ee"
                    // translateButton.style.cursor = "wait"


                    //这里改为sqlite查询
                    const item_key = getTabKeyAndPdfName().tabKey
                    const file_id = await queryFileId(item_key)
                    if (file_id != "") {
                        const message = text + "\n\n" + "请结合文章理解解释这段话"
                        const refs = [file_id]
                        // 然后发送请求给ai
                        sendAIMessage(message, sendButton, selectFileButton, displayFileFrame, chatFrame, refs)
                    } else {
                        const tabPdfPath = getTabPdfPath()
                        tabPdfUpload(tabPdfPath).then((isupload: { isok: boolean, file_id: string }) => {
                            if (isupload.isok) {
                                //说明上传成功了,并且已经将信息保存到了tabFileId表中
                                const message = text + "\n\n" + "请结合文章理解解释这段话"
                                const refs = [isupload.file_id]
                                sendAIMessage(message, sendButton, selectFileButton, displayFileFrame, chatFrame, refs)
                            }
                        })
                    }
                    return
                }
            }
        ]
    })

    explainButton.textContent = "AI解释"
    ButtonContainer.append(translateButton, explainButton)
    return ButtonContainer
}


function sendAIMessage(message: string, sendButton: HTMLDivElement,
    selectFileButton: HTMLDivElement, displayFileFrame: HTMLDivElement, chatFrame: HTMLDivElement,
    refs: string[] = [],) {

    const doc = ztoolkit.getGlobal("document")
    const userMessageDiv = create_user_message_box(doc, displayFileFrame, message)
    chatFrame.appendChild(userMessageDiv)
    const botMessageDiv = create_bot_message_box(doc, "")
    chatFrame.appendChild(botMessageDiv)
    get_bot_response(doc, chatFrame, botMessageDiv, sendButton, selectFileButton, message, refs)
    chatFrame.scrollTop = chatFrame.scrollHeight
    sendButton.classList.add("disabled")
    selectFileButton.classList.add("disabled")
}


export {
    createSubspendButton,
}