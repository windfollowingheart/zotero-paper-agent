// import { getPref } from "../utils/prefs"
// import { getWindowSize } from "../utils/window"
// import { filePickerCallback } from "./file"


// function createMainContainer(): HTMLDivElement | undefined {
//     const win = ztoolkit.getGlobal("window")
//     const doc = win.document
//     const ResizeObserver = ztoolkit.getGlobal("ResizeObserver")
//     const { baseWidth, baseHeight } = getWindowSize()
//     // //直接查询一下是否有mainContainer,如何有，就添加到mainNode中,没有再新建


//     const mainContainer = ztoolkit.UI.createElement(doc, "div", {
//         styles: {
//             height: `${baseHeight} vh`,
//             // width: `${ baseWidth } vw`,
//             // width: "95%",
//             // width: `${.offsetWidth * 0.8} px`,
//             // maxWidth: "min(50vw, 95%)",
//             // backgroundColor: "black",
//             display: "flex",
//             borderRadius: "10px",
//             overflow: "hidden"
//             // overflow: "hidden",

//         },
//         classList: ["main-container", "shallow_1"]
//     })
//     mainContainer.style.width = mainContainer.parentNode?.offsetWidth * 0.8 + "px"

//     if (!mainContainer.parentNode) {
//         return
//     }
//     const resizeObserver = new ResizeObserver(entries => {
//         for (let entry of entries) {
//             const { width, height } = entry.contentRect;
//             ztoolkit.log('Element size changed to:', width, height);
//             ztoolkit.log(mainContainer.parentNode.offsetWidth, mainNode.offsetHeight);
//             graphContainer.style.width = `${width * 0.9 - 0.03 * ztoolkit.getGlobal("window").innerWidth} px`
//             mainContainer.style.width = `${width * 0.9} px`
//         }
//     });

//     // 观察特定的元素

//     resizeObserver.observe(mainNode);


//     // //直接查询一下是否有mainContainer,如何有，就添加到mainNode中,没有再新建
//     // const mainContainerDiv = doc.querySelector(".main-container")
//     // if (mainContainerDiv) {
//     //   mainNode.append(mainContainerDiv)
//     //   return
//     // }


//     ztoolkit.UI.appendElement({
//         tag: "link",
//         id: `${config.addonRef} -link`,
//         properties: {
//             type: "text/css",
//             rel: "stylesheet",
//             href: `chrome://${config.addonRef}/content/md.css`
//         }
//     }, mainContainer)
//     ztoolkit.UI.appendElement({
//         tag: "link",
//         id: `${config.addonRef}-link`,
//         properties: {
//             type: "text/css",
//             rel: "stylesheet",
//             href: `chrome://${config.addonRef}/content/loading.css`
//         }
//     }, mainContainer)

//     //在主节点下创建一个容器
//     const graphContainer = ztoolkit.UI.createElement(doc, "div", {
//         id: "graph-view",
//         styles: {
//             // height: "850px",
//             height: `${baseHeight}vh`,
//             // flex: "1",
//             width: `${mainNode.offsetWidth * 0.7}px`
//             // maxWidth: "cal(100%-3vw)"
//             // width: "calc(100%-3vw)"
//             // width: "99%"
//             // width: `${baseWidth - 3}vw`,
//             // width: `${baseWidth - 3}vw`,
//             // backgroundColor: "green",
//             // overflow: "hidden",
//             // backgroundColor: "#E6DEE4",
//             // backgroundColor: "#D8DBE3",
//             // borderRadius: "10px",
//         },
//         // classList: ['graph-container']
//     })

//     // 创建一个侧边栏，包含新建chat和chat列表两个按钮
//     const sidebarContainer = ztoolkit.UI.createElement(doc, "div", {
//         id: "sidebar-view",
//         styles: {
//             height: `${baseHeight}vh`,
//             width: "3vw",
//             // backgroundColor: "#D7D5E2",
//             background: "linear-gradient(0deg,#D8E0E8 0%,#C2D5DE 100%)",
//             display: "flex",
//             // flexDirection: "column",
//             // alignItems: "center"
//             // overflow: "hidden",
//         }
//     })

//     const chatListDivContainer = ztoolkit.UI.createElement(doc, "div", {
//         namespace: "html",
//         styles: {
//             position: "relative",
//             // width: "0.1vw",
//             height: "100%",
//             backgroundColor: "blue"
//         }
//     })

//     // sidebarContainer.style.alignItems
//     const sidebarButtonContainer = ztoolkit.UI.createElement(doc, "div", {
//         id: "sidebar-view",
//         styles: {
//             height: `${baseHeight}vh`,
//             width: "3vw",
//             // backgroundColor: "#D7D5E2",
//             // background: "linear-gradient(0deg,#D8E0E8 0%,#C2D5DE 100%)",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center"
//             // overflow: "hidden",
//         }
//     })

//     // sidebarContainer.append(chatListDivContainer, sidebarButtonContainer)
//     sidebarContainer.append(sidebarButtonContainer, chatListDivContainer)

//     function createSiderBarButton(text: string): HTMLDivElement {
//         const createNewButton = ztoolkit.UI.createElement(doc, "div", {
//             styles: {
//                 // border: "2px solid #000",
//                 borderRadius: "5px",
//                 // backgroundColor: "blue",
//                 width: "25px",
//                 height: "25px",
//                 margin: "10px"
//                 // marginTop: "10px"
//             },
//             namespace: "html",
//             // attributes: {
//             //   title: "创建新chat"
//             // }
//             classList: ["siderbar-button"]

//         })
//         createNewButton.style.fontSize = "12px";
//         createNewButton.style.color = "white";
//         createNewButton.style.display = "flex";
//         createNewButton.style.alignItems = "center";
//         createNewButton.style.justifyContent = "center";
//         createNewButton.style.borderRadius = "5px";
//         createNewButton.textContent = text;
//         return createNewButton
//     }

//     //创建新建chat按钮
//     // const createNewChatButton = ztoolkit.UI.createElement(doc, "div", {
//     //   styles: {
//     //     border: "2px solid #000",
//     //     backgroundColor: "blue",
//     //     width: "25px",
//     //     height: "25px",
//     //     marginTop: "10px"
//     //   },
//     //   namespace: "html",
//     //   attributes: {
//     //     title: "创建新chat"
//     //   }

//     // })
//     // createNewChatButton.style.fontSize = "14px";
//     // createNewChatButton.style.color = "white";
//     // createNewChatButton.style.display = "flex";
//     // createNewChatButton.style.alignItems = "center";
//     // createNewChatButton.style.justifyContent = "center";
//     // createNewChatButton.style.borderRadius = "5px";
//     // createNewChatButton.textContent = "1";
//     const createNewChatButton = createSiderBarButton("新建\n聊天")

//     //添加选择监听
//     createNewChatButton.addEventListener("click", async () => {
//         // 正在对话或者上传文件的时候是不能新建chat
//         if (sendButton.classList.contains("disabled") && selectFileButton.classList.contains("disabled")) {
//             return
//         }
//         await getChatId(true)
//         //清空graphContainer中chatFrame的所有内容

//         // for (let child of chatFrame.children) {
//         //   chatFrame.removeChild(child)

//         // }
//         while (chatFrame.childNodes.length != 0) {
//             chatFrame.removeChild(chatFrame.childNodes[0])
//         }
//     })

//     //创建新建chat列表按钮
//     // const showChatListButton = ztoolkit.UI.createElement(doc, "div", {
//     //   styles: {
//     //     border: "2px solid #000",
//     //     backgroundColor: "blue",
//     //     width: "25px",
//     //     height: "25px",
//     //     marginTop: "10px",
//     //   },
//     //   namespace: "html",
//     //   attributes: {
//     //     title: "展示"
//     //   }


//     // })
//     // showChatListButton.style.fontSize = "14px";
//     // showChatListButton.style.color = "white";
//     // showChatListButton.style.display = "flex";
//     // showChatListButton.style.alignItems = "center";
//     // showChatListButton.style.justifyContent = "center";
//     // showChatListButton.style.borderRadius = "5px";
//     // showChatListButton.textContent = "2";

//     // showChatListButton.addEventListener("click", async () => {
//     // })
//     const showChatListButton = createSiderBarButton("历史\n列表")
//     const chatListDiv = createChatListDiv()
//     chatListDivContainer.append(chatListDiv)
//     showChatListButton.addEventListener("click", async () => {

//         chatListDiv.classList.toggle("chat-list-show")
//         // 监听动画结束事件
//         if (chatListDiv.classList.contains("chat-list-show")) {
//             searchChatList(chatListDiv)
//             chatListDiv.style.zIndex = "1";
//         }
//         chatListDiv.addEventListener('transitionend', function handleTransitionEnd() {
//             // 确保在动画结束后移除事件监听器
//             chatListDiv.removeEventListener('transitionend', handleTransitionEnd);

//             // 确保 z-index 在动画结束后生效
//             if (!chatListDiv.classList.contains("chat-list-show")) {
//                 chatListDiv.style.zIndex = "-1";
//                 while (chatListDiv.childNodes.length != 0) {
//                     chatListDiv.removeChild(chatListDiv.childNodes[0])
//                 }
//             }
//         })
//         // const doc = ztoolkit.getGlobal("document")
//         // doc.documentElement.append(chatListDiv)
//     })

//     Zotero.Item.attachmentPath

//     const createNewItemButton = createSiderBarButton("新建\n条目")

//     //添加选择监听
//     createNewItemButton.addEventListener("click", async () => {
//         createSQLiteFile()
//     })


//     sidebarButtonContainer.append(createNewChatButton, showChatListButton, createNewItemButton)


//     mainContainer.append(sidebarContainer, graphContainer)
//     mainNode?.append(mainContainer);

//     //创建一个div用于存放问答记录
//     const chatFrame = ztoolkit.UI.createElement(doc, "div", {
//         namespace: "html",
//         id: "chat-frame",
//         styles: {
//             width: "100%"
//         },
//         classList: ["chat-frame"]
//     });
//     chatFrame.style.border = "none";
//     chatFrame.style.outline = "none";
//     // chatFrame.style.width = graphContainer.style.width;
//     // chatFrame.style.height = `${baseHeight * 0.75}vh`;
//     chatFrame.style.height = `${baseHeight * 0.85}vh`;
//     // chatFrame.style.overflow = "hidden";
//     chatFrame.style.overflowWrap = "break-all";
//     chatFrame.style.overflowY = "auto";
//     chatFrame.style.backgroundColor = "#F5F4F4";
//     chatFrame.style.scrollbarWidth = "thin";
//     // chatFrame.textContent = "hello";
//     graphContainer.append(chatFrame);



//     const resizer = ztoolkit.UI.createElement(doc, "div", {
//         styles: {
//             height: `10px`,
//             width: "100%",
//             backgroundColor: "#cecece",
//             cursor: "ns-resize",
//             overflowWrap: "break-word",
//         }
//     });
//     // graphContainer.insertBefore(resizer, chatFrame);



//     //创建一个div用于存放输入框和发送按钮以及选择附件按钮
//     const InputFrame = ztoolkit.UI.createElement(doc, "div", { namespace: "html" });
//     InputFrame.style.display = "flex";
//     InputFrame.style.alignItems = "center";
//     InputFrame.style.justifyContent = "center";
//     // InputFrame.style.backgroundColor = "red"
//     InputFrame.style.height = "4vh";
//     InputFrame.style.marginTop = "5px";
//     InputFrame.style.padding = "2px";
//     // InputFrame.style.flex = "1";
//     InputFrame.style.maxWidth = "100%";
//     InputFrame.style.width = "100%";


//     //创建一个用于展示上传文件的frame
//     const displayFileFrame = ztoolkit.UI.createElement(doc, "div", {
//         namespace: "html",
//         styles: {
//             display: "flex",
//             flexWrap: "wrap",
//             // flex: "1",
//             maxWidth: "100%",
//             width: "100%",
//             gap: "10px", /* 调整元素之间的间距 */
//             // height: `${baseHeight * 0.25 - 6}vh`,
//             height: `${baseHeight * 0.15 - 6}vh`,
//             // width: "99%",
//             // width: `${baseWidth - 3 - 1}vw`,

//             // width: graphContainer.style.width,
//             // width: "600px",
//             // marginTop: "5px",
//             // backgroundColor: "purple",
//             padding: "1vh 0.5vw",
//             overflowY: "auto",
//             scrollbarWidth: "thin",
//         },
//         classList: ["display-file-frame"]
//     });

//     graphContainer.append(InputFrame, displayFileFrame)
//     //创建选择附件按钮(img)
//     const selectFileButton = ztoolkit.UI.createElement(doc, "img", {
//         styles: {
//             // backgroundColor: "#d3d3d3",
//             width: "25px",
//             height: "25px",
//             position: "relative",
//             // borderRadius: "2px",
//         },
//         properties: {
//             title: "选择文件",
//             src: `chrome://${config.addonRef}/content/icons/attachment_1.png`
//         },
//         namespace: "html",
//         classList: ["select-file-button"]
//         // children: [
//         //   // {
//         //   //   tag: "img",
//         //   //   properties: {
//         //   //     src: `chrome://${config.addonRef}/content/icons/attachment_0.png`
//         //   //   },
//         //   //   styles: {
//         //   //     position: "absolution"
//         //   //   }
//         //   // },
//         //   {
//         //     id: "file_select_input",
//         //     tag: "input",
//         //     properties: {
//         //       type: "file",
//         //       class: ""
//         //     },
//         //     styles: {
//         //       // display: "none"
//         //     }
//         //   }
//         // ]

//     })

//     const acceptFileType = ["image/png", "image/jpg", "image/jpeg", "image/bmp", "application/pdf"]
//     const fileInput = ztoolkit.UI.createElement(doc, 'input', {
//         namespace: "html",
//         styles: {
//             display: "none"
//         },
//         properties: {
//             type: "file",
//             accept: acceptFileType.join(",")
//         },
//     })
//     //添加选择监听
//     selectFileButton.addEventListener("click", (e) => {

//         ztoolkit.log(`fileInput: ${fileInput}`)
//         fileInput.click()
//         // filePickerCallback(sendButton, selectFileButton, userInput)
//         // ztoolkit.log(e.target)
//     })

//     fileInput.addEventListener('change', function (event: any) {
//         const file = event.target.files[0]
//         ztoolkit.getGlobal("console").log(file)
//         if (!acceptFileType.includes(file.type)) {
//             ztoolkit.getGlobal("alert")("文件格式不支持")
//             return
//         }

//         // //然后转换为blob
//         // const blobUrl = new Blob(file)
//         // ztoolkit.getGlobal("console").log(blobUrl)
//         //
//         filePickerCallback(file, sendButton, selectFileButton, userInput, displayFileFrame)
//     });

//     //创建发送按钮(div)
//     const sendButton = ztoolkit.UI.createElement(doc, "div", {
//         styles: {
//             // border: "2px solid #000",
//             backgroundColor: "blue",
//             width: "45px",
//             height: "25px",
//         },
//         namespace: "html",
//         attributes: {
//             class: "disabled"
//         },
//         classList: ["send_button"]


//     })
//     sendButton.style.fontSize = "12px";
//     sendButton.style.color = "white";
//     sendButton.style.display = "flex";
//     sendButton.style.alignItems = "center";
//     sendButton.style.justifyContent = "center";
//     sendButton.style.borderRadius = "5px";
//     sendButton.textContent = "发送";
//     sendButton.classList.add("disabled")

//     //添加选择监听
//     sendButton.addEventListener("click", () => {
//         sendInputMessage()
//         autoExpand() //更新一下行数
//         // ztoolkit.getGlobal("navigator").clipboard.readText().then(text => {
//         //   ztoolkit.getGlobal("alert")(text)
//         // })
//     })

//     //添加监听paste事件

//     // doc.querySelector(".main-container")?.addEventListener("paste", async (event: any) => {
//     //   event.preventDefault()
//     //   const clipboardData = event.clipboardData
//     //   ztoolkit.getGlobal("alert")(clipboardData.types)
//     //   // ztoolkit.getGlobal("navigator").clipboard.readText().then(text => {

//     //   //   const clipboardData = event.clipboardData
//     //   //   ztoolkit.getGlobal("alert")(clipboardData.types)
//     //   // })
//     // })
//     // doc.addEventListener("paste", (event: any) => {
//     //   let clipboardData, pastedData;
//     //   // 防止默认行为
//     //   if (doc.activeElement === userInput) {
//     //     // ztoolkit.getGlobal("alert")("请使用快捷键复制")
//     //     return
//     //   }
//     //   event.preventDefault();


//     //   // 使用事件对象的clipboardData对象获取剪切板数据
//     //   clipboardData = event.clipboardData
//     //   if (clipboardData.types && clipboardData.types.length) {
//     //     if (clipboardData.types.includes('text/plain')) {
//     //       pastedData = clipboardData.getData('Text');
//     //       // userInput.textContent += pastedData;
//     //     } else if (clipboardData.types.includes('Files') && clipboardData.files && clipboardData.files.length) {
//     //       const reader = new FileReader();
//     //       // 文件读取成功完成后的处理
//     //       reader.onload = (e: any) => {

//     //         pastedData = e.target.result;
//     //         ztoolkit.getGlobal("console").log(pastedData)
//     //         // 在这里使用base64String，例如可以将其设置为图片的src
//     //         // ztoolkit.log("复制1" + pastedData);
//     //         new ztoolkit.Clipboard().addText(pastedData).copy()
//     //       };
//     //       // 以DataURL的形式读取文件
//     //       ztoolkit.log(clipboardData.files[0])
//     //       ztoolkit.getGlobal("console").log(clipboardData.files[0])
//     //       reader.readAsDataURL(clipboardData.files[0]);
//     //     }
//     //   }

//     //   // if (doc.activeElement === userInput) {
//     //   //   ztoolkit.getGlobal("alert")("粘贴板事件")
//     //   //   userInput.textContent += pastedData;
//     //   //   // autoExpand()
//     //   // } else {
//     //   //   ztoolkit.getGlobal("alert")("粘贴板事件2")
//     //   // }

//     // })


//     function sendInputMessage() {
//         if (!userInput.value.trim()) {
//             // sendButton.classList.add("disabled")
//             new ztoolkit.ProgressWindow("输入错误", { closeTime: 1000 }).createLine({
//                 text: "请输入内容",
//                 type: "fail",
//             }).show()
//             return
//         }
//         if (!sendButton.classList.contains("disabled")) {
//             const userInputText = userInput.value;
//             // ztoolkit.getGlobal("alert")(userInputText)
//             const userMessageDiv = create_user_message_box(doc, displayFileFrame, userInputText)
//             chatFrame.appendChild(userMessageDiv)
//             const botMessageDiv = create_bot_message_box(doc, "")
//             chatFrame.appendChild(botMessageDiv)
//             get_bot_response(doc, chatFrame, botMessageDiv, sendButton, selectFileButton, userInputText)
//             chatFrame.scrollTop = chatFrame.scrollHeight
//             userInput.value = ""
//             sendButton.classList.add("disabled")
//             selectFileButton.classList.add("disabled")
//         }
//     }

//     const userInputDiv = ztoolkit.UI.createElement(doc, "div", {
//         styles: {
//             width: "320px",
//             position: "relative",
//             height: "100%",
//             // backgroundColor: "#fff999",
//             padding: "0px 5px 5px 5px"
//         },
//         namespace: "html",

//     });

//     //创建用户输入框
//     const userInput = ztoolkit.UI.createElement(doc, "textarea", {
//         styles: {
//             backgroundColor: "#ffffff",
//             border: "1px solid #d3d3d3",
//             margin: "3px",
//             // width: "320px",
//             width: "90%",
//             // lineHeight: "60%",
//             // height:"",
//             padding: "5px",
//             height: "20px",
//             resize: "none",
//             position: "absolute",
//             bottom: "0px",
//             scrollbarWidth: "thin",
//             // scrollbarColor: "red green"
//         },
//         namespace: "html",
//         properties: {
//             placeholder: "默认填写",
//             rows: 1
//         },
//         classList: ["user-input"]
//     });
//     userInput.style.fontSize = "14px";
//     userInput.style.borderRadius = "10px";
//     userInput.style.wordBreak = "break-all";
//     userInput.style.fontFamily = "Arial";
//     userInput.style.fontWeight = "normal"
//     userInput.style.alignItems = "center";
//     // userInput.style.height = userInputDiv.scrollHeight.toString()
//     // ztoolkit.log(`userInputDiv.scrollHeight.的高度: ${userInputDiv.scrollHeight.toString()}`)

//     userInput.addEventListener("change", (e: any) => {
//         // ztoolkit.getGlobal("console").log(`输入框内容变化: ${e.target.value}`)
//         if (e.target.value.length != 0 && !getPref("isResponsing")) {
//             sendButton.classList.remove("disabled")
//             // userInput.textContent = e.target.value

//         } else {
//             sendButton.classList.add("disabled")
//             // userInput.textContent = ""
//         }
//         // ztoolkit.getGlobal("alert")("change")
//         autoExpand()
//     })

//     userInput.addEventListener("input", (e: any) => {
//         // ztoolkit.getGlobal("console").log(`输入框内容变化: ${e.target.value}`)
//         // ztoolkit.getGlobal("alert")("input")
//         if (e.target.value.length != 0 && !getPref("isResponsing")) {
//             sendButton.classList.remove("disabled")
//         } else {
//             sendButton.classList.add("disabled")
//         }
//         autoExpand()
//     })


//     userInput.addEventListener("paste", (event: any) => {
//         let clipboardData, pastedData;
//         event.preventDefault();
//         // ztoolkit.getGlobal("alert")("粘贴板事件")
//         // ztoolkit.getGlobal("console").log(userInput.textContent)
//         // ztoolkit.getGlobal("console").log(userInput.textLength)


//         // 使用事件对象的clipboardData对象获取剪切板数据
//         clipboardData = event.clipboardData || window.clipboardData;
//         if (clipboardData.types && clipboardData.types.length) {
//             if (clipboardData.types.includes('text/plain')) {
//                 pastedData = clipboardData.getData('Text');
//                 userInput.value += pastedData;
//                 // let userinput: any = doc.querySelector(".user-input")
//                 // userinput.textContent += pastedData
//             } else if (clipboardData.types.includes('Files') && clipboardData.files && clipboardData.files.length) {
//                 // const reader = new FileReader();
//                 // // 文件读取成功完成后的处理
//                 // reader.onload = (e: any) => {

//                 //   pastedData = e.target.result;
//                 //   ztoolkit.getGlobal("console").log(pastedData)
//                 //   // 在这里使用base64String，例如可以将其设置为图片的src
//                 //   // ztoolkit.log("复制1" + pastedData);
//                 //   // new ztoolkit.Clipboard().addText(pastedData).copy()
//                 // };
//                 // // 以DataURL的形式读取文件
//                 // ztoolkit.log(clipboardData.files[0])
//                 ztoolkit.getGlobal("console").log(clipboardData.files[0])
//                 // reader.readAsDataURL(clipboardData.files[0]);
//                 // reader.readAsArrayBuffer(clipboardData.files[0]);
//                 filePickerCallback(clipboardData.files[0], sendButton, selectFileButton, userInput, displayFileFrame)
//             }
//         }
//         autoExpand() //这里change事件没触发，手动执行一下autoExpand
//         if (userInput.textLength != 0 && !getPref("isResponsing")) {
//             sendButton.classList.remove("disabled")
//         } else {
//             sendButton.classList.add("disabled")
//         }

//     })


//     userInputDiv.append(userInput)

//     // 检查是否按下了Shift键和Enter键
//     let isShiftPressed = false;
//     function handleKeyDown(e: any) {
//         if (e.key === 'Shift') {
//             isShiftPressed = true;
//         }
//     }

//     function handleKeyUp(e: any) {
//         if (e.key === 'Shift') {
//             isShiftPressed = false;
//         }
//     }

//     function handleKeyPress(e: any) {
//         // 检查是否按下了Enter键
//         if (e.key === 'Enter') {
//             // 如果Shift键没有被按下，提交表单
//             if (!isShiftPressed) {
//                 e.preventDefault(); // 阻止默认行为，如换行
//                 sendInputMessage()
//                 autoExpand() //更新一下行数
//             } else {
//                 userInput.textContent += '\n';
//                 // 如果Shift键被按下，允许换行
//                 // 这里不做任何操作，因为默认行为就是换行
//             }
//         }
//     }
//     userInput.addEventListener('keydown', handleKeyDown);
//     userInput.addEventListener('keyup', handleKeyUp);
//     userInput.addEventListener('keypress', handleKeyPress);

//     InputFrame.append(selectFileButton);
//     // InputFrame.append(userInput);
//     InputFrame.append(userInputDiv);
//     InputFrame.append(sendButton);
//     function autoExpand1() {
//         const HEIGHT = 10
//         const maxRows = 5; // 设置最大行数
//         // userInput.style.height = 'auto';
//         userInput.style.height = HEIGHT + 'px';
//         userInput.style.height = Math.min(HEIGHT, userInput.scrollHeight - parseInt(userInput.style.padding), maxRows * 0.0148 * ztoolkit.getGlobal("window").innerHeight) + "px";
//     }

//     function autoExpand() {
//         const computed = userInput.style.height;
//         if (userInput.textLength === 0) {
//             userInput.style.height = "20px"
//             // ztoolkit.getGlobal("alert")("000")
//             return
//         }
//         userInput.style.height = 'auto'; // 重置高度
//         let computedHeight = userInput.scrollHeight; // 获取滚动高度
//         // ztoolkit.getGlobal("alert")(computedHeight)
//         userInput.style.height = `${computedHeight}px`; // 设置新的高度
//         userInput.style.maxHeight = `${150}px`; // 设置新的高度
//         ztoolkit.log(`autoExpand: ${computed}`)
//         ztoolkit.log(`autoExpand: ${computedHeight}`)
//         if (computedHeight > 150) { // 如果高度超过最大高度
//             userInput.style.overflowY = 'auto'; // 显示滚动条
//         } else {
//             userInput.style.overflowY = 'hidden'; // 隐藏滚动条
//         }
//     }
//     // 为textarea注册input事件监听器
//     userInput.addEventListener('input', autoExpand);
//     return mainContainer
// }

// export {
//     createMainContainer,
// }