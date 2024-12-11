const hljs = require('highlight.js');
import { Buffer } from 'buffer'
import { sendUint8ArrayFile, getKimi } from "../utils/http"
import { getAccessToken } from "./token"
import { getPref, setPref, clearPref } from "../utils/prefs"
import { get } from 'http';
import { formatDateTime, getTabKeyAndPdfName } from "../utils/util"
import { config } from "../../package.json";
import { title } from 'process';
import { BASEURL } from '../utils/ip';
import { insertNewChatInfo, queryChatInfo, updateChatInfo } from '../utils/sqlite';
import { cancelBotResponse } from '../utils/kimi_api';

export const markdown = require("markdown-it")({
    breaks: true, // 将行结束符\n转换为 <br> 标签
    xhtmlOut: true, // 使用 /> 关闭标签，而不是 >
    typographer: true,
    html: true,
    highlight: function (str: any, lang: any) {

        if (!lang || !hljs.getLanguage(lang)) {
            // lang = "bash"
            lang = "javascript"
        }
        try {
            const languageName = lang
            const highlightedCode = hljs.highlight(
                str,
                { language: languageName },
                // true
            ).value

            return '<div class="code-header">' +
                '<div class="language">' + languageName + '</div>' + `<div class="copy-button">复制代码</div>` +
                '</div>' +
                '<div><pre class="hljs"><code>' +
                highlightedCode +
                // '</code></pre></div>' + `<div hidden="true" class="code-content">${encodeBase64(str)}</div>`;
                '</code></pre></div>' + `<div style="display:none" class="code-content">${encodeBase64(str)}</div>`;
        } catch (e: any) {
            // ztoolkit.log(e.toString())
        }
        // }

        return '<pre style="display:none" class="hljs"><code>' + "" + '</code></pre>';
        // return '<pre style="display:none" class="hljs"><code>' + markdown.utils.escapeHtml(str) + '</code></pre>';
        // return markdown.render(str);
        // return " "

    }


});
const mathjax3 = require('markdown-it-mathjax3');
markdown.use(mathjax3);

function create_user_message_box(doc: Document, displayFileFrame: HTMLDivElement, message: string, isUploading: boolean = false): HTMLDivElement {
    // 创建一个div元素, 用于用户消息容器
    const userMessageContainer = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            display: "flex",
            width: "100%",
            justifyContent: "flex-end", // 将消息左对齐
            // margin: "5px",
            // backgroundColor: "red"
        },
        classList: ["user_message_container"]

    });

    //添加笔记监听
    userMessageContainer.addEventListener("click", function (e: any) {
        if (userMessageContainer.classList.contains("message-border")) {
            userMessageContainer.classList.toggle("add_message_to_notes")
            // ztoolkit.getGlobal("alert")(`add_message_to_notes`)
        }
    })



    //然后创建一个用户头像区域
    const userAvator = ztoolkit.UI.createElement(doc, "img", {
        namespace: "html",
        styles: {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center",
            margin: "10px",
        },
        attributes: {
            src: `chrome://${config.addonRef}/content/icons/akali.jpg`,
            alt: "user",
        },
    });
    //然后创建消息体区域
    const userMessage = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        attributes: {
            class: "markdown-body"
        },
        styles: {
            display: "flex",
            flexDirection: "column",
            maxWidth: "70%",
            padding: "5px",
            backgroundColor: "rgba(92, 108, 254, 0)",
            // // borderRadius: "10px",
            wordBreak: "break-all",
            fontSize: "14px",
            fontWeight: "normal", // 设置字体的粗细
            color: "#fff", // 设置字体颜色
            // border: "1px solid #ccc",// 设置边框
            userSelect: "text",
            justifyContent: "center",
            alignItems:"flex-end"

        },
        children: [
            {
                tag: "div",
                namespace: "html",
                styles: {
                    display: "flex",
                    // display: "inline-block",
                    flexDirection: "column",
                    minHeight: "40px",
                    // maxWidth: "70%",
                    // width: "auto",
                    padding: "5px",
                    wordBreak: "break-all",
                    fontSize: "14px",
                    fontFamily: "Arial", // 设置字体
                    borderRadius: "10px",
                    backgroundColor: "#5C6CFE",
                    border: "1px solid #ccc",// 设置边框
                    justifyContent: "center",
                    alignItems: "center",
                    // textAlign: "center"
                },
                classList: ["user_message_text_container"],
                children: [{
                    tag: "div",
                    styles: {
                        display: "flex",
                        // maxWidth: "30vw",
                        alignItems: "center",
                        justifyContent: "center",
                        // width: "100%",
                        // height: "100%",
                        wordBreak: "break-all",
                        fontSize: "14px",
                        fontFamily: "Arial", // 设置字体
                        // borderRadius: "10px",
                        // backgroundColor: "red",
                    },
                    classList: ["user_text_message"]

                },
                {
                    tag: "div",
                    namespace: "html",
                    styles: {
                        width: "100%",
                        height: "25px",
                        borderRadius: "5px",
                        marginRight: "10px",
                        display: "none",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        // backgroundColor: "#5C6CFE",
                        cursor: "pointer",
                        userSelect: "none",

                        // visibility: "hidden"
                    },
                    // attributes: {
                    //     hidden: "true"
                    // },
                    properties: {
                        hidden: true
                        // visibility: true
                    },
                    classList: ["copy_user_message_div"],
                    children: [
                        {
                            tag: "div",
                            namespace: "html",
                            properties: {
                                hidden: true
                                // visibility: true
                            },
                            styles: {
                                width: "25px",
                                height: "25px",
                                borderRadius: "5px",
                                marginLeft: "10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                // backgroundColor: "#5C6CFE",
                                cursor: "pointer",
                                userSelect: "none",

                            },
                            classList: ["svg-container-1"],
                            children: [{
                                tag: "img",
                                namespace: "html",
                                classList: ["copy_user_message_btn"],
                                attributes: {
                                    src: `chrome://${config.addonRef}/content/icons/copy.svg`
                                },
                                styles: {
                                    width: "80%",
                                    height: "80%",

                                },

                            }]
                        }
                    ]

                }]
            },
            {
                tag: "div",
                styles: {
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "70%",
                    padding: "5px",
                    alignItems:"flex-end",
                    // backgroundColor: "red",

                },
                classList: ["user_file_message"]
            }
        ]
    })

    /**创建一个user消息复制*/
    const userCopyButtonDiv: any = userMessage.getElementsByClassName("copy_user_message_div")[0]
    const userMessageTextContainer: any = userMessage.querySelector(".user_message_text_container")
    userMessageTextContainer.addEventListener("mouseenter", () => {
        userCopyButtonDiv.style.display = "flex"
        // userCopyButtonDiv.setAttribute("hidden", false)
        // ztoolkit.getGlobal("alert")(`userCopyButtonDiv: ${userCopyButtonDiv}`)
    })
    userMessageTextContainer.addEventListener("mouseleave", () => {
        // userCopyButtonDiv.hidden = true
        userCopyButtonDiv.style.display = "none"
        // userCopyButtonDiv.innerHTML = "ll"
        // ztoolkit.getGlobal("alert")(`userCopyButtonDiv: ${userCopyButtonDiv}`)
        // userCopyButtonDiv.setAttribute("hidden", true)
    })

    //复制
    const userCopyButton: any = userMessage.getElementsByClassName("copy_user_message_btn")[0]
    userCopyButton.addEventListener("click", () => {
        new ztoolkit.Clipboard().addText(
            userTextMessage.textContent
        ).copy()
        new ztoolkit.ProgressWindow("复制", { closeTime: 1000 }).createLine({
            text: "复制成功!",
            type: "success",
            // progress: 100,
        }).show();
    })


    const userTextMessage: any = userMessage.querySelector(".user_text_message")

    userTextMessage.textContent = message;
    const userFileMessage: any = userMessage.querySelector(".user_file_message")
    // ztoolkit.getGlobal("alert")(`displayFileFrame.childNodes.length: ${displayFileFrame.childNodes.length}`)
    while (displayFileFrame.childNodes.length != 0) {
        const child: any = displayFileFrame.childNodes[0]
        const clickXButton: any = child.getElementsByClassName("cancel_x_img")[0]
        clickXButton.hidden = true
        userFileMessage.append(child)
    }
    // for (let i = 0; i < displayFileFrame.childNodes.length; i++) {
    //     try {
    //         ztoolkit.getGlobal("alert")(`${displayFileFrame.childNodes.length}`)
    //         ztoolkit.getGlobal("alert")(`${i}`)
    //         const child: any = displayFileFrame.childNodes[i]
    //         const clickXButton: any = child.getElementsByClassName("cancel_x_img")[0]
    //         clickXButton.hidden = true
    //         userFileMessage.append(child)
    //         ztoolkit.getGlobal("alert")(`${displayFileFrame.childNodes.length}`)
    //         ztoolkit.getGlobal("alert")(`${i}`)
    //     } catch (e) {
    //         ztoolkit.getGlobal("alert")(e)
    //     }

    // }
    //清空displayFileFrame所有子节点
    while (displayFileFrame.childNodes.length != 0) {
        displayFileFrame.removeChild(displayFileFrame.childNodes[0])
    }
    userMessageContainer.append(userMessage, userAvator)
    return userMessageContainer;
}

function create_bot_message_box(doc: Document, message: string, isQuerying: boolean = true): HTMLDivElement {
    // 创建一个div元素, 用于用户消息容器
    const botMessageContainer = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            display: "flex",
            // width: "80%",
            justifyContent: "flex-start", // 将消息左对齐
            // margin: "5px",
            // backgroundColor: "red"
        },
        classList: ["bot_message_container"]
    })

    //添加笔记监听
    botMessageContainer.addEventListener("click", function (e: any) {
        if (botMessageContainer.classList.contains("message-border")) {
            botMessageContainer.classList.toggle("add_message_to_notes")
            // ztoolkit.getGlobal("alert")(`add_message_to_notes`)
        }
    })

    const botAvator = ztoolkit.UI.createElement(doc, "img", {
        namespace: "html",
        styles: {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center",
            margin: "10px",
        },
        attributes: {
            src: `chrome://${config.addonRef}/content/icons/akali.jpg`
        }
    })
    const botMessage = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        attributes: {
            // id: "bot_message",
            // class: "bot_message"
        },
        styles: {
            display: "flex",
            flexDirection: "column",
            // maxWidth: "100%",
            // maxWidth: "70%",
            // maxWidth: "calc(70% >30vw?30vw:70%)",
            // maxWidth: "30vw",
            padding: "5px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            margin: "0",
            wordBreak: "break-all",
            fontSize: "14px",
            fontFamily: "Arial", // 设置字体
            fontWeight: "normal", // 设置字体的粗细
            lineHeight: "1.5", // 设置行高
            letterSpacing: "0.5px", // 设置字间距
            color: "#000", // 设置字体颜色
            userSelect: "text",
            whiteSpace: "pre-wrap",
            // overflow: "hidden"
            // alignItems: "center",
            // justifyContent: "center",
        },
        children: [{
            tag: "div",
            styles: {
                display: "flex",
                flexDirection: "column",
                maxWidth: "100%",
                padding: "5px",
                // backgroundColor: "#fff",
                // borderRadius: "10px",
                // padding: "5px",
                // backgroundColor: "red",
                // borderRadius: "10px",
                margin: "0",
                wordBreak: "break-all",
                fontSize: "14px",
                fontFamily: "Arial", // 设置字体
                fontWeight: "normal", // 设置字体的粗细
                lineHeight: "1.5", // 设置行高
                letterSpacing: "0.5px", // 设置字间距
                color: "#000", // 设置字体颜色
                userSelect: "text",
                whiteSpace: "pre-wrap",
                // alignItems: "center",
                justifyContent: "center",
            },
            classList: ["bot_message_1"]
        }],
        classList: ["bot_message"]
    })


    // 调用函数，从容器元素开始递归删除所有SVG元素
    // removeSVGElements(botMessage);
    botMessageContainer.append(botAvator, botMessage)
    // const botMessage1: any = botMessage.querySelector(".bot_message_1")
    // message = replace_math_symbols(message)
    // botMessage1.innerHTML = markdown.render(message);
    // removeSVGElements(botMessage1);
    
    if (message) {
        const botMessageMarkdown = botMessage.childNodes[0] as HTMLDivElement
        botMessageMarkdown.innerHTML = markdown.render(message);

        const allResponseTextDiv = ztoolkit.UI.createElement(doc, "div", {
            id: "responseText",
            styles: {
                display: "none"
            },
            properties: {
                // hidden: true
            },
            classList: ['response_text']
        })
        allResponseTextDiv.textContent = encodeBase64(message)
        botMessageContainer.appendChild(allResponseTextDiv)
        const codeContents = botMessageContainer.querySelectorAll(".code-content");
        const copyButtons = botMessageContainer.querySelectorAll(".copy-button");
        copyButtons.forEach((copyButton, index) => {
            copyButton?.addEventListener('click', function () {
                new ztoolkit.Clipboard()
                    .addText(
                        codeContents[index]?.textContent ? decodeBase64(codeContents[index].textContent) : ""
                    )
                    .copy();
                new ztoolkit.ProgressWindow("复制", { closeTime: 1000 })
                    .createLine({
                        text: "复制成功!",
                        type: "success",
                    })
                    .show();
            });
        });
        create_copy_all_response_text_button(doc, botMessageContainer);

        
        return botMessageContainer;
    }

    //在开始前创建一个加载动画添加到botMessage中，知道responseText长度大于1的时候取消加载动画
    const beginBotMessageLoadingDiv = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "25px",
            // backgroundColor: "red",
            // marginTop: "12px"
            transform: "translateY(50%)",
            // backgroundColor: "rgba(255, 255, 255, 0.5)",
        },
        attributes: {
            hidden: false
        },
        classList: ["begin_bot_message_loading_div"]
    })
    beginBotMessageLoadingDiv.innerHTML = '<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>'
    if(isQuerying){
        botMessage.children[0].append(beginBotMessageLoadingDiv)
    }
    return botMessageContainer;
}

function create_copy_all_response_text_button(doc: Document, botMessageContainer: HTMLDivElement): HTMLDivElement {
    const copyAllResponseTextDiv = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            width: "100%",
            height: "30px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            // margin: "5px",
            padding: "5px",
            // position: "relative",
            // borderRadius: "10px",
            // backgroundColor: "#fff",
            // color: "#fff",
            // fontSize: "14px",
            // fontWeight: "normal", // 设置字体的粗细
            // lineHeight: "1.5", // 设置行高
        },
        classList: ["copy_all_response_text_div"]
    })
    const copyAllResponseTextButton = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        properties: {
            title: "复制内容"
        },
        classList: ["svg-container"],
        styles: {
            width: "25px",
            height: "25px",
            borderRadius: "5px",
            marginRight: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "#5C6CFE",
            cursor: "pointer",
            userSelect: "none",
            // top: "50%",
            // left: "50%",
            // transform: "translate(-50%, -50%)",
            // position: "absolute",

            // borderRadius: "10px",
            // backgroundColor: "#fff",
            // color: "#fff",
            // fontSize: "14px",
            // fontWeight: "normal", // 设置字体的粗细
            // lineHeight: "1.5", // 设置行高
        },
        children: [
            {
                tag: "img",
                classList: ["copy_all_response_text_img"],
                properties: {
                    src: `chrome://${config.addonRef}/content/icons/copy.svg`,
                },
                styles: {
                    width: "80%",
                    height: "80%",

                },
            }
        ]
    })
    copyAllResponseTextDiv.append(copyAllResponseTextButton)
    const botMessage: any = botMessageContainer.querySelector(".bot_message")
    botMessage.append(copyAllResponseTextDiv)

    const allResponseTextDiv: any = botMessageContainer.querySelector(".response_text")
    // if (allResponseTextDiv.textContent.length === 0){
    //     copyAllResponseTextDiv.style.display = "none"
    // }

    //给copyAllResponseTextButton添加点击事件
    copyAllResponseTextButton.addEventListener("click", () => {
        //获取botMessage中的所有文本
        // const allResponseTextDiv: any = botMessageContainer.querySelector(".response_text")
        //复制到剪贴板
        new ztoolkit.Clipboard().addText(decodeBase64(allResponseTextDiv.textContent)).copy()
        new ztoolkit.ProgressWindow("复制整个botmessage", { closeTime: 1000 })
            .createLine({
                text: "复制成功!",
                type: "success",
            })
            .show();
    })


    const cancelDiv =  ztoolkit.UI.createElement(document, "div", {
        classList: ["cancel-div"],
        styles:{
            display: "none",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
            backgroundColor: "#f5f5f5",
            height:"20px",
            width:"100px",
            fontSize:"10px",
            marginLeft: "0",
            color: "#BFBFBF",
            // marginRight:
            
        },
        
    })
    // const cancelDivPar = ztoolkit.UI.createElement(document, "div", {
    //     styles:{
    //         maxWidth:"100%",
    //         backgroundColor:"#000",
    //     }
    // })
    // cancelDivPar.append(cancelDiv)
    // cancelDiv.textContent = "用户取消了回复"
    // botMessageDiv.append(cancelDiv)
    const allResCopyDiv = botMessageContainer.querySelector(".copy_all_response_text_div")
    cancelDiv.textContent = "用户取消了回复"
    if(allResCopyDiv){
        allResCopyDiv.insertBefore(cancelDiv, allResCopyDiv.firstChild)
    }
    return copyAllResponseTextDiv
}



async function get_bot_response(doc: Document, chatFrame: HTMLDivElement, botMessageContainer: HTMLDivElement,
    sendButton: HTMLDivElement, selectFileButton: HTMLDivElement,
    query: string, refs: string[] = []) {

    // 找到停止按钮:
    const stopResponseDiv: any = doc.querySelector(".stop-response-div")
    const stopResponseButton: any = doc.querySelector(".stop-response-button")
    

    //从pref获取chat_id和refs
    setPref("isResponsing", true)
    let chat_id = getPref("selected_tab_chat_id")
    if (chat_id === "") {
        const chatIdInfo: any = await getChatId()
        if (!chatIdInfo.isok) {
            ztoolkit.getGlobal("alert")("chatIdInfo.isok is false");
            return
        } else {
            chat_id = getPref("selected_tab_chat_id")
        }
    }
    if (refs.length === 0) {
        const refs1: string = getPref("selected_tab_chat_file_refs")?.toString() || ""
        refs = refs1.split(";")
        refs = refs.filter(item => item != "")
        if (refs.length - 1 < 0) {
            refs = []
        }
    }

    const url = `https://kimi.moonshot.cn/api/chat/${chat_id}/completion/stream`
    const body = {
        "messages": [
            {
                "role": "user",
                "content": query
            }
        ],
        "use_search": true,
        "extend": {
            "sidebar": false
        },
        "kimiplus_id": "kimi",
        "use_research": false,
        "refs": refs,
        "refs_file": []
    }

    const maxRetryCount = 3
    for (let i = 0; i < maxRetryCount; i++) {
        const result: any = await sendRequest()
        // ztoolkit.getGlobal("alert")(JSON.stringify(result.message))
        if (result.message.includes("error")) {
            await getAccessToken()
        
        } 
        
        else if (result.message === "token is over") {
            //改为更新sqlite
            const chat_id = getPref("selected_tab_chat_id") as string
            const isUpdateChatInfo = await updateChatInfo(chat_id, "", 1, 0)
            if (!isUpdateChatInfo) {
                console.log("更新tabchatinfo失败")
            } else {
                ztoolkit.log("更新tabchatinfo成功")
            }
            break

            const isUpdateTabChatInfo = await updateTabChatInfoToServer()
            // return

            // const chatInfo: any = await getChatId()
            // url = `https://kimi.moonshot.cn/api/chat/${chat_id}/completion/stream`
            // if (chatInfo.isok) {
            //     ztoolkit.log("已经更新chat_id")
            //     chat_id = getPref("selected_tab_chat_id")
            // }
            if (isUpdateTabChatInfo.isok) {
                ztoolkit.log("更新tabchatinfo成功")
            } else {
                ztoolkit.log("更新tabchatinfo失败")
            }
            break
        }
        else {
            new ztoolkit.ProgressWindow("Chat", { closeTime: 1000 })
                .createLine({
                    text: "回答完毕!",
                    type: "success",
                    progress: 100,
                })
                .show();
            //清理prefs中的file_refs
            clearPref("selected_tab_chat_file_refs")
            setPref("isResponsing", false)
            // sendButton.classList.remove("disabled")
            // selectFileButton.classList.remove("disabled")
            //最后将两个按钮enabele
            selectFileButton.classList.remove("disabled")
            const userInput: any = doc.querySelector(".user-input")
            if (userInput.textLength != 0) {
                sendButton.classList.remove("disabled")
            }
            create_copy_all_response_text_button(doc, botMessageContainer)
            chatFrame.scrollTop = chatFrame.scrollHeight

            if (result.message === "stop"){
                const cancelDiv = botMessageContainer.querySelector(".cancel-div") as HTMLDivElement
                console.log("cancel",cancelDiv)
                if(cancelDiv){
                    cancelDiv.style.display = "flex"
                }
            }
            return
        }
    }
    new ztoolkit.ProgressWindow("Chat", { closeTime: 3000 })
        .createLine({
            text: "回答失败!",
            type: "fail",
            progress: 100,
        })
        .show();
    //清理prefs中的file_refs
    const botMessage = botMessageContainer.querySelectorAll(".bot_message_1")[0]
    if (!botMessage.innerHTML.includes("token超限制, 需开启新会话。")) {
        botMessage.innerHTML = markdown.render("回答失败😓😓")
    }
    clearPref("selected_tab_chat_file_refs")
    setPref("isResponsing", false)
    sendButton.classList.remove("disabled")
    selectFileButton.classList.remove("disabled")

    async function sendRequest(): Promise<{ isok: boolean, message: string }> {
        return new Promise((resolve, reject) => {
            const headers: { [key: string]: string } = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getPref("access_token")}`,
                "Host": "kimi.moonshot.cn",
            }

            // segment_id的event值是resp
            let segment_id: string = ""

            //绑定停止按钮
            
            if(stopResponseDiv && stopResponseButton){
                // ztoolkit.getGlobal("alert")("绑定了停止按钮")
                console.info("绑定了停止按钮")
                stopResponseDiv.style.display = "flex"
                stopResponseButton.onclick = async () => {
                    // ztoolkit.getGlobal("alert")("点击了停止按钮")
                    // console.log(xhr.responseText)

                    //必须获取到segment_id后才可以cancel
                    // 先cancel，然后xhr.abort()
                    if(!segment_id) return
                    console.info(segment_id)
                    const xhr = await cancelBotResponse(segment_id)
                    console.log(xhr)
                    await xhrOnloadProcess(xhr.responseText)

                    

                    resolve({ isok: false, message: "stop" })
                }
            }else{
                // ztoolkit.getGlobal("alert")("没有找到stopResponseDiv和stopResponseButton")
                // ztoolkit.getGlobal("alert")(JSON.stringify(stopResponseDiv))
                // ztoolkit.getGlobal("alert")(JSON.stringify(stopResponseButton))
                console.warn("没有找到stopResponseDiv和stopResponseButton")
                resolve({ isok: false, message: "stop" })
            }

            const xhr = new XMLHttpRequest()
            xhr.open('POST', url, true)
            for (let key in headers) {
                xhr.setRequestHeader(key, headers[key])
            }
            xhr.onprogress = function (e: any) {
                process_response(e.target.response)
            }

            async function xhrOnloadProcess(e: any){
                //最后再处理一遍
                // const responseText = await process_response(e.target.response)
                if(!e) return
                const responseText = await process_response(e)
                //创建一个hidden的div存储responseText
                const allResponseTextDiv = ztoolkit.UI.createElement(doc, "div", {
                    id: "responseText",
                    styles: {
                        display: "none"
                    },
                    properties: {
                        // hidden: true
                    },
                    classList: ['response_text']
                })
                allResponseTextDiv.textContent = encodeBase64(responseText)
                botMessageContainer.appendChild(allResponseTextDiv)

                const codeContents = botMessageContainer.querySelectorAll(".code-content");
                const copyButtons = botMessageContainer.querySelectorAll(".copy-button") as NodeListOf<HTMLDivElement>;
                copyButtons.forEach((copyButton, index) => {
                    if (codeContents[index] && codeContents[index].textContent?.length === 0) {
                        copyButton.style.display = "none";
                        
                    }
                    copyButton?.addEventListener('click', function () {
                        new ztoolkit.Clipboard()
                            .addText(
                                codeContents[index]?.textContent ? decodeBase64(codeContents[index].textContent) : ""
                            )
                            .copy();
                        new ztoolkit.ProgressWindow("复制", { closeTime: 1000 })
                            .createLine({
                                text: "复制成功!",
                                type: "success",
                            })
                            .show();
                    });
                });
                xhr.abort()
                stopResponseDiv.style.display = "none"

                //删除loading图标
                const beginBotMessageLoadingDiv = doc.querySelector(".begin_bot_message_loading_div")
                console.log(beginBotMessageLoadingDiv)
                if(beginBotMessageLoadingDiv){
                    console.info("删除了loading图标")
                    beginBotMessageLoadingDiv.remove()
                }
            }

            xhr.onload = async function (e: any) {

                if (xhr.status === 200) {
                    // ztoolkit.getGlobal("alert")(`xmlhttp.status: ${xhr.status}`)
                    // 请求成功完成
                    // 这里可以处理响应内容 xhr.responseText
                    // new ztoolkit.ProgressWindow("ChatGPT")
                    //     .createLine({
                    //         text: "回答完毕!",
                    //         type: "success",
                    //         progress: 100,
                    //     })
                    //     .show();
                    //然后最后要清空Prefs中的file_refs
                    // clearPref("selected_tab_chat_file_refs")
                    await xhrOnloadProcess(e.target.response)
                    
                    resolve({ isok: true, message: "" })
                } else {
                    // 请求失败
                    // 这里可以处理错误情况

                    // maxRetryCount -= 1
                    // ztoolkit.getGlobal("alert")(`当前maxRetryCount:${maxRetryCount}`)
                    // if (maxRetryCount <= 0) {
                    //     clearPref("selected_tab_chat_file_refs")
                    //     return
                    // }
                    // await getAccessToken()
                    resolve({ isok: false, message: xhr.responseText })
                }
            };
            xhr.send(JSON.stringify(body))


            // Zotero.HTTP.request("POST", url, {
            //     body: JSON.stringify(body),
            //     headers: headers,
            //     requestObserver: (xmlhttp: XMLHttpRequest) => {
            async function process_response(text: any): Promise<string> {
                const textArr = text.match(/data: (.+)/g).filter((s: string) => (s.indexOf("text") >= 0 && s.indexOf("cmpl") >= 0) 
                || s.indexOf("error_type") 
                || s.indexOf("resp")).map((s: string) => {
                    try {
                        const json1 = JSON.parse(s.replace("data: ", ""))
                        if ("event" in json1) {
                            // ztoolkit.getGlobal("alert")(json1.event)
                            if (json1.event === "error") {
                                if (json1.error.error_type === "long_text_flash_catcher_limit" || json1.error.error_type === "kimi.completion.token_length_too_long"
                                ) {
                                    return "token超限制, 需开启新会话。"
                                } else if (json1.error.error_type === "kimi.completion.overloaded") {
                                    return json1.error.message
                                }
                                // ztoolkit.getGlobal("alert")(json1.error.error_type)
                            } else if (json1.event === "cmpl") {
                                return json1.text.replace(/\n+/g, "\n")
                            } 
                            else if(json1.event === "resp"){
                                segment_id = json1.id
                            }
                            else {
                                return ""
                            }
                        }
                        return ""
                    } catch {
                        return ""
                    }
                })
                try {
                    let responseText = textArr.join("")
                    if (responseText.length <= 10) return ""
                    responseText = replace_math_symbols(responseText)
                    responseText = removeOnlineCite(responseText)
                    // responseText = fixMarkdownCodeBlocks(responseText)
                    const botMessage = botMessageContainer.querySelectorAll(".bot_message_1")[0]
                    // ztoolkit.log(markdown.render(responseText))
                    botMessage.innerHTML = markdown.render(responseText)
                    // ztoolkit.log(botMessageContainer.querySelectorAll(".bot_message_1")[0])
                    removeSVGElements(botMessage);
                    chatFrame.scrollTop = chatFrame.scrollHeight
                    if (responseText.includes("token超限制, 需开启新会话。") || responseText.includes("长文本对话 20 轮/三个小时")) {
                        resolve({ isok: false, message: "token is over" })
                    }
                    return responseText
                } catch (e: any) {
                    ztoolkit.log(textArr)
                    ztoolkit.log(e.toString())
                    ztoolkit.log(botMessageContainer.querySelectorAll(".bot_message_1")[0])
                    ztoolkit.log(botMessageContainer.innerHTML)
                    return ""
                }
            }


            //         xmlhttp.onprogress = (e: any) => {
            //             process_response(e.target.response)

            //         };
            //         // 请求完成事件处理程序
            // xmlhttp.onload = async function (e: any) {

            //     if (xmlhttp.status === 200) {
            //         ztoolkit.getGlobal("alert")(`xmlhttp.status: ${xmlhttp.status}`)
            //         // 请求成功完成
            //         // 这里可以处理响应内容 xhr.responseText
            //         // new ztoolkit.ProgressWindow("ChatGPT")
            //         //     .createLine({
            //         //         text: "回答完毕!",
            //         //         type: "success",
            //         //         progress: 100,
            //         //     })
            //         //     .show();
            //         //然后最后要清空Prefs中的file_refs
            //         // clearPref("selected_tab_chat_file_refs")

            //         //最后再处理一遍
            //         await process_response(e.target.response)
            //         const codeContents = botMessageContainer.querySelectorAll(".code-content");
            //         const copyButtons = botMessageContainer.querySelectorAll(".copy-button");
            //         copyButtons.forEach((copyButton, index) => {
            //             copyButton?.addEventListener('click', function () {
            //                 new ztoolkit.Clipboard()
            //                     .addText(
            //                         codeContents[index]?.textContent ? decodeBase64(codeContents[index].textContent) : ""
            //                     )
            //                     .copy();
            //                 new ztoolkit.ProgressWindow("复制")
            //                     .createLine({
            //                         text: "复制成功!",
            //                         type: "success",
            //                     })
            //                     .show();
            //             });
            //         });
            //         resolve({ isok: true, message: "" })
            //     } else {
            //         // 请求失败
            //         // 这里可以处理错误情况

            //         // maxRetryCount -= 1
            //         // ztoolkit.getGlobal("alert")(`当前maxRetryCount:${maxRetryCount}`)
            //         // if (maxRetryCount <= 0) {
            //         //     clearPref("selected_tab_chat_file_refs")
            //         //     return
            //         // }
            //         // await getAccessToken()
            //         resolve({ isok: false, message: xmlhttp.responseText })
            //     }
            // };

            //         xmlhttp.onerror = async function (e: any) {
            //             // 请求失败
            //             // 这里可以处理错误情况
            //             ztoolkit.getGlobal("alert")(e)

            //         };

            //         xmlhttp.abort = () => {
            //             ztoolkit.getGlobal("alert")("终端")
            //         }
            //     },

            // })
        })
    }


};


// 函数用于递归地删除所有SVG元素
function removeSVGElements(node: any) {
    // 遍历所有子节点
    Array.from(node.childNodes).forEach((child: any) => {
        // 如果子节点是SVG元素，则从DOM中移除
        if (child.nodeName === 'svg'.toUpperCase() || child.nodeName === 'svg') {
            node.removeChild(child);
        } else {
            // 如果子节点还有其他子节点，递归调用此函数
            removeSVGElements(child);
        }
    });
}

// 去除kimi回答的联网搜索引用项
function removeOnlineCite(text: string) {
    // [^8^]
    // /data: (.+)/g
    const newText = text.replace(/\[\^\d+\^\]/g, '');
    return newText
}

// 函数用于将\\[ 和 \\] \( \)替换为$$和$
function replace_math_symbols(text: string) {
    // 使用正则表达式替换特殊字符, 这里$在正则中有特殊含义的所以需要转义$$$$, \s匹配至少一个空格, \s*匹配0个或多个空格
    text = text.replace(/\\\[\s/g, '$$$$').replace(/\s\\\]/g, '$$$$').replace(/\\\(\s/g, '$').replace(/\s\\\)/g, '$');
    return text;
}

//检查markdown是否```闭合
function fixMarkdownCodeBlocks(markdownText: string) {
    // 用于存储处理后的文本
    let fixedText = markdownText;
    // 用于存储找到的开启代码块的位置
    let openCodeBlocks = [];

    // 正则表达式匹配开启代码块
    const openCodeBlockRegex = /```(?!```)/g;
    // 正则表达式匹配闭合代码块
    const closeCodeBlockRegex = /```/g;

    // 查找所有开启代码块的位置
    let match;
    while ((match = openCodeBlockRegex.exec(fixedText)) !== null) {
        openCodeBlocks.push(match.index);
    }

    // 查找并修复未闭合的代码块
    const closeCodeBlockMatches = fixedText.match(closeCodeBlockRegex);
    if (closeCodeBlockMatches) {
        for (let i = closeCodeBlockMatches.length - 1; i >= 0; i--) {
            const closeIndex = closeCodeBlockMatches.index || fixedText.indexOf('```', i);
            // 如果闭合代码块之前没有开启代码块，或者开启代码块的数量多于闭合代码块，则添加开启代码块
            if (openCodeBlocks.length === 0 || openCodeBlocks[openCodeBlocks.length - 1] > closeIndex) {
                fixedText = fixedText.slice(0, closeIndex) + '\n```' + fixedText.slice(closeIndex);
                // 重置openCodeBlocks，因为文本已经改变
                openCodeBlocks = [];
                // 重新查找开启代码块
                while ((match = openCodeBlockRegex.exec(fixedText)) !== null) {
                    openCodeBlocks.push(match.index);
                }
            }
            // 移除已匹配的闭合代码块，避免重复处理
            fixedText = fixedText.slice(0, closeIndex) + fixedText.slice(closeIndex + 3);
        }
    }

    return fixedText;
}

// Node.js环境中将字符串转换为Base64编码
function encodeBase64(str: string) {
    return Buffer.from(str).toString('base64');
}

// Node.js环境中将Base64编码转换回字符串
function decodeBase64(base64Str: string) {
    return Buffer.from(base64Str, 'base64').toString();
}

//创建一个chat
async function createNewChat(): Promise<{}> {

    const maxRetryCount = 3
    const url = "https://kimi.moonshot.cn/api/chat"
    const body = {
        "name": "hh",
        "is_example": false,
        "enter_method": "new_chat",
        "kimiplus_id": "kimi"
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
            new ztoolkit.ProgressWindow("Check Create Chat", { closeTime: 1000 })
                .createLine({
                    text: "创建chat成功!",
                    type: "success",
                    progress: 100,
                })
                .show();
            result['isok'] = true
            return result
        }
    }
    new ztoolkit.ProgressWindow("Check Create Chat", { closeTime: 3000 })
        .createLine({
            text: "创建chat失败!",
            type: "fail",
            progress: 100,
        })
        .show();
    return { isok: false }
}

//将chat数据提交到服务器,保存到数据库中
async function saveChatInfoToServer(chatInfo: {}): Promise<{}> {
    // ztoolkit.getGlobal("alert")("tabKey")
    // const url = "http://192.168.8.47:8000/save_chat_info/"
    // let body: any = chatInfo
    // const { tabKey, pdfName } = getTabKeyAndPdfName()
    // ztoolkit.getGlobal("alert")(tabKey)
    // body['user_id'] = getPref("userid")
    // body['tab_key'] = tabKey

    try {
        // ztoolkit.getGlobal("alert")("tabKey")
        const tabKey1 = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item.key
        const pdfName1 = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item.attachmentPath;
        // ztoolkit.getGlobal("alert")(tabKey1)
        // ztoolkit.getGlobal("alert")(pdfName1)
        const url = `${BASEURL}/save_chat_info/`
        let body: any = chatInfo
        const res = getTabKeyAndPdfName()
        // ztoolkit.getGlobal("alert")(res.tabKey)
        body['user_id'] = getPref("userid")
        body['tab_key'] = res.tabKey

        const uploadFileInfoToServerXHR = await Zotero.HTTP.request("POST", url, { body: JSON.stringify(body) })
        const response = JSON.parse(uploadFileInfoToServerXHR.responseText)
        if (response.status) {
            return { isok: true }
        } else {
            return { isok: false }
        }

    } catch (e: any) {
        ztoolkit.getGlobal("alert")(e)
        ztoolkit.log("jj" + JSON.stringify(e))
        ztoolkit.log(e)
        return { isok: false }
    }
}


async function updateTabChatInfoToServer() {
    const url = `${BASEURL}/update_tab_chat_info/`
    const body = {
        user_id: getPref("userid"),
        // selected_tab_key: getPref("selected_tab_key"),
        selected_tab_key: getTabKeyAndPdfName().tabKey,
        chat_id: getPref("selected_tab_chat_id"),
    }

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

async function getChatId(create_new: boolean = false): Promise<{}> {
    // // ztoolkit.getGlobal("alert")("getChatId执行了")
    // const url = `${BASEURL}/get_chat_id/`
    // const body = {
    //     user_id: getPref("userid"),
    //     // selected_tab_key: getPref("selected_tab_key")
    //     selected_tab_key: getTabKeyAndPdfName().tabKey
    // }
    // try {
    //     if (!create_new) {
    //         const getChatIdXHR = await Zotero.HTTP.request("POST", url, { body: JSON.stringify(body) })
    //         const response = JSON.parse(getChatIdXHR.responseText)
    //         if (response.status) {
    //             return { isok: true, chat_id: response.chat_id }
    //         } else {
    //             if (response.message === "no chat in this tab" || create_new) {
    //                 const res: any = await create_new_chat()
    //                 return res
    //             }
    //             return { isok: false }
    //         }
    //     } else {
    //         // ztoolkit.getGlobal("alert")("*************")
    //         const res: any = await create_new_chat()
    //         return res
    //     }


    // } catch (e: any) {
    //     return { isok: false }
    // }

    //改为查询sqllite数据库
    try {
        let chatInfo = await queryChatInfo()
        chatInfo = chatInfo.filter(item => item.is_over_token === 0)
        if (chatInfo.length === 0 || create_new) {
            console.log("数据库中chatinfo为0,创建第一个")
            const newChatInfo: any = await createNewChat()
            if (newChatInfo.isok) {
                //插入数据库
                console.log("开始将chatinfo插入数据库")
                const create_time = formatDateTime()
                const chat_id = newChatInfo.id
                const is_over_token = 0
                const is_del = 0
                const isInsert = await insertNewChatInfo(chat_id, create_time, is_over_token, is_del)
                if (isInsert) {
                    setPref("selected_tab_chat_id", chat_id)
                    return { isok: true, chat_id: chat_id }
                }
            }
            return { isok: false }
        } else {
            console.log(chatInfo[-1].chat_id)
            return { isok: true, chat_id: chatInfo[-1].chat_id }
        }

    } catch (e: any) {
        return { isok: false }
    }

    async function create_new_chat(): Promise<{}> {
        //创建一个新的chat
        const newChatInfo: any = await createNewChat()
        if (newChatInfo.isok) {
            // 保存到服务器
            // ztoolkit.getGlobal("alert")("******111*******")
            const saveChatInfoToServerResult: any = await saveChatInfoToServer(newChatInfo)
            if (saveChatInfoToServerResult.isok) {
                // ztoolkit.getGlobal("alert")("******222*******")
                // 设置chat_id到prefs
                setPref("selected_tab_chat_id", newChatInfo.id)
                new ztoolkit.ProgressWindow("Check GET CHAT_ID", { closeTime: 1000 })
                    .createLine({
                        text: "成功获取到chat_id!",
                        type: "success",
                        progress: 100,
                    })
                    .show();
                return { isok: true, chat_id: newChatInfo.id }
            }
        }
        return { isok: false }
    }
}



export {
    create_user_message_box,
    create_bot_message_box,
    get_bot_response,
    getChatId,
    createNewChat,
    encodeBase64,
    decodeBase64,

}
