import { title } from "process"
import { createMessageBox } from "../utils/message"
import { formatDateTime, mathMLtoLaTeX } from "../utils/util"
import { getWindowSize } from "../utils/window"
import { config } from "../../package.json";



function createNoteButton() {
    const doc = ztoolkit.getGlobal("document")
    const { baseWidth, baseHeight } = getWindowSize()
    const noteButtonContainer = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // height: "20%",
            height: `${baseHeight * 0.15}vh`,
            // width: "100px",
            backgroundColor: "#EDEDED",

            position: "absolute",
            left: "0px",
            bottom: "0px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            overflow: "hidden",
            whiteSpace: "nowrap",

        },
        classList: ["note-button-div"],

    })



    const yesButton = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            padding: "2px 4px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
            width: "60%",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        listeners: [
            {
                type: "click",
                listener: () => {

                    if (!doc.querySelector(".add_message_to_notes")) {
                        ztoolkit.getGlobal("alert")("请先选择笔记")
                        return
                    } else {
                        // ztoolkit.getGlobal("alert")("正在创建笔记")
                        // console.log(doc.querySelector(".add_message_to_notes"))
                    }

                    const onYesFunc = () => {
                        // YesFunc()

                        const messageBoxInput = messageBox.querySelector("input")
                        if (messageBoxInput) {
                            // ztoolkit.getGlobal("alert")(messageBoxInput.value)
                            if (messageBoxInput.value.trim() && messageBoxInput.value.trim().length != 0) {
                                createNoteFromSelectedMessage(messageBoxInput.value)
                            }
                        }
                        noteButtonContainer.classList.remove("note-button-div-show")
                        removeNoteButtionStyle()
                    }

                    const messageBox = createMessageBox("请输入笔记标题", onYesFunc, () => { }, "input", "AI论文问答笔记 " + formatDateTime())




                }
            }
        ]
    })
    yesButton.textContent = "确定"

    const noButton = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            padding: "2px 4px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
            width: "60%",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"


        },
        listeners: [
            {
                type: "click",
                listener: () => {
                    noteButtonContainer.classList.remove("note-button-div-show")
                    // NoFunc()
                    removeNoteButtionStyle()
                }
            }
        ]
    })
    noButton.textContent = "取消"

    //从better-note创建笔记，需要zotero-butter-notes插件安装
    const betterNotesCreateButton = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            padding: "2px 4px",
            // backgroundColor: "green",
            border: "1px solid #ccc",
            color: "white",
            borderRadius: "3px",
            cursor: "pointer",
            width: "60%",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"


        },
        // classList: ["better-note-button"],
        children: [{
            tag: "img",
            styles: {
                width: "15px",
                height: "15px",
            },
            properties: {
                src: `chrome://${config.addonRef}/content/icons/bn.png`
            }
        }],
        properties: {
            title: "该功能还未开发"
        },
        listeners: [
            {
                type: "click",
                listener: () => {
                    if (!Zotero.BetterNotes) {
                        ztoolkit.getGlobal("alert")("该功能还未开发")
                        return
                    }
                    noteButtonContainer.classList.remove("note-button-div-show")
                    // NoFunc()
                    removeNoteButtionStyle()
                }
            }
        ]
    })
    // betterNotesCreateButton.textContent = "better note"

    // if (!Zotero.BetterNotes) {
    //     betterNotesCreateButton.classList.add("disabled")
    // }

    const buttonContainerDiv = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            width: "100%",
            padding: "2px",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px"
        },
    })


    buttonContainerDiv.append(yesButton, betterNotesCreateButton, noButton)
    noteButtonContainer.append(buttonContainerDiv)



    return noteButtonContainer
}


function createNoteFromSelectedMessage(noteTitle: string) {
    const doc = ztoolkit.getGlobal("document")
    const botMessageContainers = doc.querySelectorAll(".bot_message_container") as NodeListOf<HTMLDivElement>;
    const userMessageContainers = doc.querySelectorAll(".user_message_container") as NodeListOf<HTMLDivElement>;
    // console.log(botMessageContainers)
    // console.log(userMessageContainers)

    // const NoteContainer = ztoolkit.UI.createElement(doc, "div", {
    //     namespace: "html",
    //     styles: {
    //         padding: "2px 4px",
    //         // backgroundColor: "blue",
    //         // color: "white",
    //         border: "none",
    //         borderRadius: "3px",
    //         cursor: "pointer",
    //         width: "90%",
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //         justifyContent: "center"
    //     }
    // })



    // const editor = Zotero.Notes.registerEditorInstance
    let text: string = ""
    //然后给所有bot和user的messagebox添加样式
    for (let i = 0; i < botMessageContainers.length; i++) {
        if (userMessageContainers[i].classList.contains("add_message_to_notes")) {
            const userMessageDiv = userMessageContainers[i].querySelector(".user_text_message") as HTMLDivElement
            const userFileMessage = userMessageContainers[i].querySelector(".user_file_message") as HTMLDivElement
            if (userMessageDiv) {
                // text += `<h1>提问</h1>\n<blockquote>\n<p> ${userMessageDiv.innerHTML}</p>\n</blockquote>\n `
                text += `<h1>提问</h1>\n<blockquote>\n<p> ${userMessageDiv.innerHTML}</p>\n`
            }
            if (userFileMessage) {
                for (let i = 0; i < userFileMessage.childNodes.length; i++) {
                    const child = userFileMessage.childNodes[i] as HTMLDivElement
                    const fileNameDiv = child.querySelector(".file_backup_div")
                    const imageBackDiv = child.querySelector(".img_back")
                    if (fileNameDiv && imageBackDiv) {
                        const fileName = fileNameDiv.textContent || ""
                        const shuffix = fileName.split(".").pop()
                        console.log(shuffix)
                        let attachment_text = ""
                        if (shuffix == "pdf") {
                            // text += `<ul>\n<li>\nqqq\n</li>\n<li>\n${fileName}\n</li>\n</ul>\n`
                            attachment_text += `<ul>\n<li>\n${fileName}\n</li>\n`
                        } else {
                            const image_url = imageBackDiv.getAttribute("src")
                            if (image_url) {
                                attachment_text += `<li>\n<img alt="" src="${image_url}" width="50" height="50">\n</li>\n`
                            }
                        }
                        //如果有附件则添加标题: 附件
                        if (attachment_text) {
                            attachment_text = `<h2>附件</h2>\n${attachment_text}`
                            text += attachment_text
                        }

                    }
                }
                if (text) {
                    text += "<ul>\n"
                }

            }
            if (text) {
                text += "</blockquote>\n"
            }
        }
        if (botMessageContainers[i].classList.contains("add_message_to_notes")) {

            // const botMessageDiv = botMessageContainers[i].querySelector(".bot_message_1") as HTMLDivElement
            const botMessageDiv = botMessageContainers[i].querySelectorAll(".bot_message_1")[0] as HTMLDivElement
            // const responseText = botMessageContainers[i].querySelector(".response_text") as HTMLDivElement
            console.log("botmessagediv: ", botMessageDiv)
            console.log(botMessageDiv.innerHTML)
            if (botMessageDiv) {
                const tt = botMessageDiv.innerHTML.replace(/<div style="display:none" class="code-content">(.*?)<\/div>/g, "")
                const aa = tt.replace(/<div class="code-header">(.*?)复制代码<\/div><\/div>/g, "")
                text += `<h1>回答</h1>\n<blockquote>\n${aa}</blockquote>\n`
            }
        }

        // <div data-schema-version="9"><p>提问</p>\n<p> 你好</p>\n<p>回答</p>\n<p> 你好！😄 如果你有任何问题或者需要帮助，请随时告诉我，我在这里随时准备回答你的问题或者提供帮助。)}</p>\n</div>
        // <div data-schema-version="9"><h1>提问</h1>\n<blockquote>\n<p> 你好</p>\n</blockquote>\n<h1>回答</h1>\n<blockquote>\n<p> 你好！真的很有耐心地在打招呼呢。如果有什么可以帮你的，比如需要信息查询、文件阅读、知识解答等，随时告诉我，我在这里等着为你服务哦！)}</p>\n</blockquote>\n</div>

    }
    if (text.length === 0 || !text.trim()) {
        return
    }

    text = `<h1><strong>${noteTitle}</strong></h1>\n` + text
    text = mathMLtoLaTeX(text)

    //获取item
    // const item = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item
    // console.log(NoteContainer)
    // console.log(item)
    // const res = item.setNote(NoteContainer.innerHTML.toString())
    // item.saveTx().then((res) => {
    //     if (res) {
    //         new ztoolkit.ProgressWindow("保存笔记", { closeTime: 1000 }).createLine({
    //             text: "保存成功!",
    //             type: "success",
    //             progress: 100,
    //         }).show()
    //     } else {
    //         new ztoolkit.ProgressWindow("保存笔记", { closeTime: 1000 }).createLine({
    //             text: "保存失败!",
    //             type: "fail",
    //             progress: 100,
    //         }).show()
    //     }
    // })

    //新建note类型条目
    var noteItem = new Zotero.Item("note");
    // noteItem.updateDisplayTitle()
    const parentID = getReaderParentId() as number
    console.log(`parentID: ${parentID}`)
    noteItem.libraryID = Zotero.Items.get(parentID).libraryID;
    console.log(`libraryID: ${noteItem.libraryID}`)
    noteItem.parentID = parentID;
    const res = noteItem.setNote(text)
    noteItem.saveTx().then((res) => {
        if (res) {
            // noteItem.addToCollection(item.id)
            // noteItem.addLinkedItem(item)
            // if (res) {
            new ztoolkit.ProgressWindow("保存笔记", { closeTime: 1000 }).createLine({
                text: "保存成功!",
                type: "success",
                progress: 100,
            }).show()
            // } else {
            //     new ztoolkit.ProgressWindow("保存笔记", { closeTime: 1000 }).createLine({
            //         text: "保存失败!",
            //         type: "fail",
            //     })
            // }
        } else {
            new ztoolkit.ProgressWindow("保存笔记", { closeTime: 1000 }).createLine({
                text: "保存失败!",
                type: "fail",
                progress: 100,
            }).show()
        }
    })
    // if (res) {
    //     new ztoolkit.ProgressWindow("保存笔记", { closeTime: 1000 }).createLine({
    //         text: "保存成功!",
    //         type: "success",
    //         progress: 100,
    //     }).show()
    // } else {
    //     new ztoolkit.ProgressWindow("保存笔记", { closeTime: 1000 }).createLine({
    //         text: "保存失败!",
    //         type: "fail",
    //         progress: 100,
    //     }).show()
    // }
    // item.addLinkedItem(noteItem).then((res) => {
    //     if (res) {
    //         new ztoolkit.ProgressWindow("保存笔记", { closeTime: 1000 }).createLine({
    //             text: "保存成功!",
    //             type: "success",
    //             progress: 100,
    //         }).show()
    //     } else {
    //         new ztoolkit.ProgressWindow("保存笔记", { closeTime: 1000 }).createLine({
    //             text: "保存失败!",
    //             type: "fail",
    //             progress: 100,
    //         }).show()
    //     }
    // })



}


function getReaderParentId() {
    const currentReader = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID);
    const parentItemId = Zotero.Items.get(
        currentReader?.itemID || -1,
    ).parentItemID;
    return parentItemId;
}


function whenClickNewNoteButton() {
    const doc = ztoolkit.getGlobal("document")
    const noteButtonDiv = doc.querySelector(".note-button-div") as HTMLDivElement
    noteButtonDiv.classList.toggle("note-button-div-show")
    const chatFrame = doc.querySelector(".chat-frame")

    noteButtonDiv.classList.remove("chat-list-show")
    // 监听动画结束事件
    const botMessageContainers = doc.querySelectorAll(".bot_message_container") as NodeListOf<HTMLDivElement>;
    const userMessageContainers = doc.querySelectorAll(".user_message_container") as NodeListOf<HTMLDivElement>;
    console.log(botMessageContainers)
    console.log(userMessageContainers)
    if (noteButtonDiv.classList.contains("note-button-div-show")) {
        noteButtonDiv.style.zIndex = "1";

        //然后给所有bot和user的messagebox添加样式

        for (let i = 0; i < botMessageContainers.length; i++) {
            botMessageContainers[i].classList.add("message-border")
            userMessageContainers[i].classList.add("message-border")
            botMessageContainers[i].style.padding = "5px"
            userMessageContainers[i].style.padding = "5px"
        }
    }
    noteButtonDiv.addEventListener('transitionend', function handleTransitionEnd() {
        // 确保在动画结束后移除事件监听器
        noteButtonDiv.removeEventListener('transitionend', handleTransitionEnd);

        // 确保 z-index 在动画结束后生效
        if (!noteButtonDiv.classList.contains("note-button-div-show")) {
            noteButtonDiv.style.zIndex = "-1";
            for (let i = 0; i < botMessageContainers.length; i++) {
                botMessageContainers[i].classList.remove("message-border")
                botMessageContainers[i].classList.remove("add_message_to_notes")
                userMessageContainers[i].classList.remove("message-border")
                userMessageContainers[i].classList.remove("add_message_to_notes")
                botMessageContainers[i].style.padding = "0"
                userMessageContainers[i].style.padding = "0"
            }
        }
    })
    if (chatFrame && chatFrame.scrollTop + 1000 > chatFrame.scrollHeight) {
        // console.log(chatFrame.scrollHeight)
        // console.log(chatFrame.scrollTop)
        chatFrame.scrollTop = chatFrame.scrollHeight
    }

}


function removeNoteButtionStyle() {
    const doc = ztoolkit.getGlobal("document")
    const botMessageContainers = doc.querySelectorAll(".bot_message_container") as NodeListOf<HTMLDivElement>;
    const userMessageContainers = doc.querySelectorAll(".user_message_container") as NodeListOf<HTMLDivElement>;
    for (let i = 0; i < botMessageContainers.length; i++) {
        botMessageContainers[i].classList.remove("message-border")
        botMessageContainers[i].classList.remove("add_message_to_notes")
        userMessageContainers[i].classList.remove("message-border")
        userMessageContainers[i].classList.remove("add_message_to_notes")
    }
}


export {
    createNoteButton,
    whenClickNewNoteButton,
}