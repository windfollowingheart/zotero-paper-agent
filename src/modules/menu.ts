import { getTabPdfPath } from "../utils/file";
import { getTabKeyAndPdfName } from "../utils/util";
import { ICONS } from "./svg";
import { config } from "../../package.json";
import { getPref, setPref } from "../utils/prefs";
import { decodeBase64, encodeBase64 } from "./chat";



function createAiSideBarMenu() {
    const aiSideBarMenuFolderDiv = document.createElement("div")
    aiSideBarMenuFolderDiv.classList.add("ai-sidebar-menu-folder-container")
    aiSideBarMenuFolderDiv.style.position = "relative"
    aiSideBarMenuFolderDiv.style.width = "0px"
    aiSideBarMenuFolderDiv.style.height = "0px"
    const styles = ztoolkit.UI.createElement(document, "link", {
        properties: {
            type: "text/css",
            rel: "stylesheet",
            href: `chrome://${config.addonRef}/content/loading.css`,
        },
    });
    aiSideBarMenuFolderDiv.appendChild(styles)


    const aiSideBarMenuContainerDiv = ztoolkit.UI.createElement(document, "div", {
        classList: ["ai-sidebar-menu-container-div"],
        // styles: {
        //     "display": "flex",
        //     "flexDirection": "column",
        //     "alignItems": "center",
        //     "justifyContent": "center",
        //     "width": "0",
        //     "height": "150px",
        //     "backgroundColor": "#fafafa",
        //     "borderRadius": "10px",
        //     "boxShadow": "0 2px 8px rgba(0, 0, 0,0.1)",
        //     "transition": "transform 3s ease",
        //     "transform": "translateX(0)"
        // }
    })

    // 创建三个按钮并加如容器
    const sendPdfFileButtonDiv = ztoolkit.UI.createElement(document, "div", {
        namespace: "html",
        classList: [
            "ai-sidebar-menu-send-pdf-file-button-div",
            "ai-sidebar-menu-button-div"
        ],
        properties: {

            title: "发送当前文章",
        },
        styles: {
            width: "30px",
            height: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "5px",
            margin: "5px 0",
            padding: "3px",
            // backgroundColor: "red",
        },
        listeners: [
            {
                type: "click",
                listener: async (ev: Event) => {
                    sendItemPdfFile()
                },
            },
        ],
    });
    sendPdfFileButtonDiv.innerHTML = `${ICONS.aiSendFileButtonIcon}`

    const translateSelectionTextButtonDiv = ztoolkit.UI.createElement(document, "div", {
        namespace: "html",
        classList: [
            "ai-sidebar-menu-translate-selection-text-button-div",
            "ai-sidebar-menu-button-div",
        ],
        properties: {

            title: "翻译所选文字",
        },
        styles: {
            width: "30px",
            height: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "5px",
            margin: "5px 0",
            padding: "3px",
        },
        listeners: [
            {
                type: "click",
                listener: async (ev: Event) => {
                    aiTranslateSelectionText()
                },
            },
        ],
    });
    translateSelectionTextButtonDiv.innerHTML = `${ICONS.aiTranslateSelectionButtonIcon}`

    const explainSelectionTextButtonDiv = ztoolkit.UI.createElement(document, "div", {
        namespace: "html",
        classList: [
            "ai-sidebar-menu-explain-selection-text-button-div",
            "ai-sidebar-menu-button-div",
        ],
        properties: {

            title: "解释所选文字",
        },
        styles: {
            width: "30px",
            height: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "5px",
            margin: "5px 0",
            padding: "3px",
        },
        listeners: [
            {
                type: "click",
                listener: async (ev: Event) => {
                    aiExplainSelectionText()
                },
            },
        ],
    });
    explainSelectionTextButtonDiv.innerHTML = `${ICONS.aiExplainSelectionButtonIcon}`


    const sidebarSettingsButtonDiv = ztoolkit.UI.createElement(document, "div", {
        namespace: "html",
        classList: [
            "ai-sidebar-menu-settings-button-div",
            "ai-sidebar-menu-button-div",
        ],
        properties: {
            title: "AI问答设置",
        },
        styles: {
            width: "30px",
            height: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "5px",
            margin: "5px 0",
            padding: "3px",
        },
        listeners: [
            {
                type: "click",
                listener: async (ev: Event) => {
                    aiSidebarSettingsClick()
                },
            },
        ],
    });
    sidebarSettingsButtonDiv.innerHTML = `${ICONS.aiSidebarSettingsIcon}`

    aiSideBarMenuContainerDiv.appendChild(sendPdfFileButtonDiv)
    aiSideBarMenuContainerDiv.appendChild(translateSelectionTextButtonDiv)
    aiSideBarMenuContainerDiv.appendChild(explainSelectionTextButtonDiv)
    aiSideBarMenuContainerDiv.appendChild(sidebarSettingsButtonDiv)

    aiSideBarMenuFolderDiv.appendChild(aiSideBarMenuContainerDiv)
    return aiSideBarMenuFolderDiv
}

async function sendItemPdfFile() {
    console.log("发送文件")
    if (addon.data.kimiApi?.isResponsing) {
        ztoolkit.getGlobal("alert")("当前正在回复")
        return
    }
    const pdfName = getTabKeyAndPdfName().pdfName
    const tabPdfPath = getTabPdfPath()
    const fileUint8Array = await IOUtils.read(tabPdfPath)
    console.log(fileUint8Array)
    await addon.data.kimiApi?.kimiUploadFile({
        file: {
            filePath: pdfName,
            fileUint8Array: fileUint8Array
        }
    })
}

async function aiTranslateSelectionText() {
    let selectionText = ztoolkit.Reader.getSelectedText(
        Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)
    )


    if (addon.data.kimiApi?.isResponsing) {
        ztoolkit.getGlobal("alert")("当前正在回复")
        return
    }
    if (selectionText.trim() === "") {
        ztoolkit.getGlobal("alert")("请选择一段文字")
        return
    }
    let aiTranslateFrontPrompt: string = ""
    let aiTranslateBehindPrompt: string = ""
    try {
        const aiSidebarSettings: Record<string, any> = JSON.parse((getPref("aiSidebarSettings") as string))
        aiTranslateFrontPrompt = aiSidebarSettings.aiTranslateFrontPrompt || ""
        aiTranslateBehindPrompt = aiSidebarSettings.aiTranslateBehindPrompt || ""
    } catch (e: any) {

    }
    selectionText = `${aiTranslateFrontPrompt}\n${selectionText}\n${aiTranslateBehindPrompt}`
    sendQueryMessageToKimi(selectionText)
}

async function aiExplainSelectionText() {
    let selectionText = ztoolkit.Reader.getSelectedText(
        Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)
    )
    if (addon.data.kimiApi?.isResponsing) {
        ztoolkit.getGlobal("alert")("当前正在回复")
        return
    }
    if (selectionText.trim() === "") {
        ztoolkit.getGlobal("alert")("请选择一段文字")
        return
    }

    let aiExplainFrontPrompt: string = ""
    let aiExplainBehindPrompt: string = ""
    try {
        const aiSidebarSettings: Record<string, any> = JSON.parse((getPref("aiSidebarSettings") as string))
        aiExplainFrontPrompt = aiSidebarSettings.aiExplainFrontPrompt || ""
        aiExplainBehindPrompt = aiSidebarSettings.aiExplainBehindPrompt || ""
    } catch (e: any) {

    }
    selectionText = `${aiExplainFrontPrompt}\n${selectionText}\n${aiExplainBehindPrompt}`
    await sendItemPdfFile()
    sendQueryMessageToKimi(selectionText)

}



function aiSidebarSettingsClick() {

    createAiSidebarSettingsDialog()?.open("AI问答设置", {
        centerscreen: true,
        width: 800,
        height: 270,
        resizable: true,
    })

}


async function sendQueryMessageToKimi(queryMessage: string) {
    const aiSidebarMenuContainerDivs = document.querySelectorAll(".ai-sidebar-menu-container-div") as NodeListOf<HTMLDivElement>
    const selectFileButtonDiv = addon.data.kimiApi?.kimiMainContainerDiv?.querySelector(".select-file-button-div") as HTMLDivElement
    const sendMessageButtonDiv = addon.data.kimiApi?.kimiMainContainerDiv?.querySelector(".send-message-button-div") as HTMLDivElement

    const res: any = await new Promise(async (resolve, reject) => {
        try {

            console.log("aiSidebarMenuContainerDiv", aiSidebarMenuContainerDivs)
            console.log("selectFileButtonDiv", selectFileButtonDiv)
            console.log("sendMessageButtonDiv", sendMessageButtonDiv)
            if (aiSidebarMenuContainerDivs) {
                aiSidebarMenuContainerDivs.forEach(item => {
                    item.classList.add("disabled")
                })
            }
            selectFileButtonDiv?.classList.remove("disabled")
            sendMessageButtonDiv?.classList.remove("disabled")

            console.log("aiSidebarMenuContainerDiv", aiSidebarMenuContainerDivs)
            console.log(addon.data.kimiApi)
            const chatResponse = await addon.data.kimiApi?.sendChatQueryMessageFunc({
                message: queryMessage
            })
            console.log("chatResponse", chatResponse)
            if (chatResponse.isok) {
                resolve(chatResponse)
            } else {
                reject(chatResponse)
            }
        } catch (e: any) {
            console.log(e)
            reject({ isok: false, result: {}, error: JSON.stringify(e) })
        }
    })
    console.log("res$$$$$$$", res)
    if (aiSidebarMenuContainerDivs) {
        aiSidebarMenuContainerDivs.forEach(item => {
            item.classList.remove("disabled")
        })
    }
}


function createAiSidebarSettingsDialog() {
    console.warn('getPref("aiSidebarSettings")', getPref("aiSidebarSettings"))
    let aiTranslateFrontPrompt: string = ""
    let aiTranslateBehindPrompt: string = ""
    let aiExplainFrontPrompt: string = ""
    let aiExplainBehindPrompt: string = ""
    try {
        const aiSidebarSettings: Record<string, any> = JSON.parse((getPref("aiSidebarSettings") as string))
        aiTranslateFrontPrompt = aiSidebarSettings.aiTranslateFrontPrompt || ""
        aiTranslateBehindPrompt = aiSidebarSettings.aiTranslateBehindPrompt || ""
        aiExplainFrontPrompt = aiSidebarSettings.aiExplainFrontPrompt || ""
        aiExplainBehindPrompt = aiSidebarSettings.aiExplainBehindPrompt || ""
    } catch (e: any) {

    }


    // 创建一个dialog
    const aiSiderbarSettingsDialog = new ztoolkit.Dialog(3, 1)
        .addCell(0, 0, {
            tag: "div",
            namespace: "html",
            styles: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                // backgroundColor: "red"
                fontSize: "16px",

            },
            children: [
                {
                    tag: "div",
                    styles: {
                        padding: "2.5px 15px",
                    },
                    properties: {
                        innerHTML: "AI翻译提示词设置: ",
                    },
                },
                {
                    tag: "textarea",
                    classList: ["ai-sidebar-settings-ai-translate-prompt-setting-textarea-front"],
                    styles: {
                        padding: "2.5px 15px",
                    },
                    properties: {
                        placeholder: "AI翻译前置提示词: ",
                        value: aiTranslateFrontPrompt
                    },
                },
                {
                    tag: "div",
                    styles: {
                        padding: "2.5px 15px",
                    },
                    properties: {
                        innerHTML: "${待翻译文本}",
                        title: "待翻译文本, 为pdf选择文本"
                    },
                },
                {
                    tag: "textarea",
                    classList: ["ai-sidebar-settings-ai-translate-prompt-setting-textarea-behind"],
                    styles: {
                        padding: "2.5px 15px",
                    },
                    properties: {
                        placeholder: "AI翻译后置提示词: ",
                        value: aiTranslateBehindPrompt
                    },
                },
            ],
        },
            false)
        .addCell(1, 0, {
            tag: "div",
            namespace: "html",
            styles: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                // backgroundColor: "red",
                fontSize: "16px",

            },
            children: [
                {
                    tag: "div",
                    styles: {
                        padding: "2.5px 15px",
                    },
                    properties: {
                        innerHTML: "AI解释提示词设置: ",
                    },
                },
                {
                    tag: "textarea",
                    classList: ["ai-sidebar-settings-ai-explain-prompt-setting-textarea-front"],
                    styles: {
                        padding: "2.5px 15px",
                    },
                    properties: {
                        placeholder: "AI解释前置提示词: ",
                        value: aiExplainFrontPrompt
                    },
                },
                {
                    tag: "div",
                    styles: {
                        padding: "2.5px 15px",
                    },
                    properties: {
                        innerHTML: "${待解释文本}",
                        title: "待解释文本, 为pdf选择文本, 会结合当前上下文"
                    },
                },
                {
                    tag: "textarea",
                    classList: ["ai-sidebar-settings-ai-explain-prompt-setting-textarea-behind"],
                    styles: {
                        padding: "2.5px 15px",
                    },
                    properties: {
                        placeholder: "AI解释后置提示词: ",
                        value: aiExplainBehindPrompt
                    },
                },
            ],
        },
            false)
        .addCell(2, 0, {
            tag: "div",
            namespace: "html",
            styles: {
                display: "flex",
                // justifyContent: "flex-end",
                width: "100%",
                padding: "5px"
            },
            children: [
                {
                    tag: "div",
                    styles: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "60px",
                        height: "40px",
                        backgroundColor: "#4072e5",
                        fontSize: "16px",
                        borderRadius: "5px",
                        // border: "1px solid #4072e5",
                        userSelect: "none",
                        cursor: "pointer",
                        color: "#fff",

                    },
                    properties: {
                        innerHTML: "确定",
                    },
                    classList: ["ai-sidebar-settings-confirm-button-div"],
                    listeners: [
                        {
                            type: "click",
                            listener: () => {
                                const aiSidebarSettingsTranslatePromptTextAreaFront = aiSiderbarSettingsDialog.window.document
                                    .querySelector(".ai-sidebar-settings-ai-translate-prompt-setting-textarea-front") as HTMLTextAreaElement
                                const aiSidebarSettingsTranslatePromptTextAreaBehind = aiSiderbarSettingsDialog.window.document
                                    .querySelector(".ai-sidebar-settings-ai-translate-prompt-setting-textarea-behind") as HTMLTextAreaElement
                                const aiSidebarSettingsExplainPromptTextAreaFront = aiSiderbarSettingsDialog.window.document
                                    .querySelector(".ai-sidebar-settings-ai-explain-prompt-setting-textarea-front") as HTMLTextAreaElement
                                const aiSidebarSettingsExplainPromptTextAreaBehind = aiSiderbarSettingsDialog.window.document
                                    .querySelector(".ai-sidebar-settings-ai-explain-prompt-setting-textarea-behind") as HTMLTextAreaElement

                                const newAiSidebarSettings = {
                                    "aiTranslateFrontPrompt": aiSidebarSettingsTranslatePromptTextAreaFront.value,
                                    "aiTranslateBehindPrompt": aiSidebarSettingsTranslatePromptTextAreaBehind.value,
                                    "aiExplainFrontPrompt": aiSidebarSettingsExplainPromptTextAreaFront.value,
                                    "aiExplainBehindPrompt": aiSidebarSettingsExplainPromptTextAreaBehind.value
                                }
                                setPref("aiSidebarSettings", (JSON.stringify(newAiSidebarSettings)))
                                aiSiderbarSettingsDialog?.window.close()
                            }
                        }
                    ]
                }
            ]
        }, false)

    return aiSiderbarSettingsDialog

}

export {
    createAiSideBarMenu,
    createAiSidebarSettingsDialog
}