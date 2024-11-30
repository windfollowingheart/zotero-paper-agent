import { send, title } from "process";
import { config } from "../../package.json";
import { getLocaleID, getString } from "../utils/locale";
import { create_user_message_box, create_bot_message_box, get_bot_response, getChatId } from "./chat"
import { filePickerCallback } from "./file"
import { getPref, setPref, clearPref } from "../utils/prefs"
import { getTabKeyAndPdfName, setTabKeyAndPdfName } from "../utils/util"
import { getWindowSize } from "../utils/window"
import { createChatListDiv, searchChatList } from "./chatList";
import { createSQLiteFile, integrateNewOldSqlite, syncSqliteWebDav } from "../utils/sqlite";
import { createNoteButton, whenClickNewNoteButton } from "./notebuttion";
import { checkRefreshTokenAvailable, createLoginDiv, genQRCode } from "../utils/token";
import { openLinkCreator } from "./note";
// import { chat_with_chatanywhere, chat_with_chatanywhere_stream, chat_with_deepseek, chat_with_deepseek_stream, chat_with_kimi, chat_with_kimi_stream } from "../openai/test";
// import { loadLibraryNotes } from "./item";



function example(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value;
  descriptor.value = function (...args: any) {
    try {
      ztoolkit.log(`Calling example ${target.name}.${String(propertyKey)}`);
      return original.apply(this, args);
    } catch (e) {
      ztoolkit.log(`Error in example ${target.name}.${String(propertyKey)}`, e);
      throw e;
    }
  };
  return descriptor;
}

export class BasicExampleFactory {
  @example
  static registerNotifier() {
    const callback = {
      notify: async (
        event: string,
        type: string,
        ids: number[] | string[],
        extraData: { [key: string]: any },
      ) => {
        if (!addon?.data.alive) {
          this.unregisterNotifier(notifierID);
          return;
        }
        addon.hooks.onNotify(event, type, ids, extraData);
      },
    };

    // Register the callback in Zotero as an item observer
    const notifierID = Zotero.Notifier.registerObserver(callback, [
      "tab",
      "item",
      "file",
    ]);

    Zotero.Plugins.addObserver({
      shutdown: ({ id: pluginID }) => {
        console.log("Shutting down plugin");
        this.unregisterNotifier(notifierID);
        // addon.hooks.onShutdown();
      },
    });
  }

  @example
  static async exampleNotifierCallback() {
    appendNewMainNode()
    function appendNewMainNode() {
      const doc = ztoolkit.getGlobal("document")
      const mainNodes = doc.querySelectorAll(`#test`)
      // const mainNode = doc1.querySelector(`#test`)
      // ztoolkit.getGlobal("console").log(mainNode)
      ztoolkit.getGlobal("console").log("hello222", mainNodes)
      // let mainNode: any
      // mainNodes.forEach((_mainNode: any) => {
      //   if (_mainNode.offsetParent) {
      //     const item_key = _mainNode.offsetParent.children[0]._item._bestAttachmentState.key
      //     if (item_key === getTabKeyAndPdfName().tabKey) {
      //       mainNode = _mainNode
      //       // return
      //     }
      //   } else {
      //     // _mainNode.remove()
      //   }

      // })

      // const ResizeObserver = ztoolkit.getGlobal("ResizeObserver")

      // //直接查询一下是否有mainContainer,如何有，就添加到mainNode中,没有再新建
      // const mainContainerDiv = doc.querySelector(".main-container") as HTMLElement
      // if (mainContainerDiv) {
      //   mainNode.append(mainContainerDiv)
      //   const graphContainerDiv = doc.getElementById("graph-view") as HTMLElement
      //   const resizeObserver = new ResizeObserver(entries => {
      //     for (let entry of entries) {
      //       const { width, height } = entry.contentRect;
      //       ztoolkit.log('Element size changed to:', width, height);
      //       ztoolkit.log(mainNode.offsetWidth, mainNode.offsetHeight);
      //       graphContainerDiv.style.width = `${width * 0.9 - 0.03 * ztoolkit.getGlobal("window").innerWidth}px`
      //       mainContainerDiv.style.width = `${width * 0.9}px`
      //     }
      //   });
      //   // 观察特定的元素
      //   resizeObserver.observe(mainNode);
      // }

      const mainContainerDivs = doc.querySelectorAll(".main-container") as NodeListOf<HTMLElement>;
      console.log(mainContainerDivs)
    }


    // new ztoolkit.ProgressWindow(config.addonName)
    //   .createLine({
    //     text: "Open Tab Detected!",
    //     type: "success",
    //     progress: 100,
    //   })
    //   .show();

    //在这里将mainContainer append到新的mainNode

  }

  @example
  private static unregisterNotifier(notifierID: string) {
    Zotero.Notifier.unregisterObserver(notifierID);
  }

  @example
  static registerPrefs() {
    Zotero.PreferencePanes.register({
      pluginID: config.addonID,
      src: rootURI + "chrome/content/preferences.xhtml",
      label: getString("prefs-title"),
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
    });
  }
}

export class KeyExampleFactory {
  @example
  static registerShortcuts() {
    // Register an event key for Alt+L
    ztoolkit.Keyboard.register((ev, keyOptions) => {
      ztoolkit.log(ev, keyOptions.keyboard);
      if (keyOptions.keyboard?.equals("shift,l")) {
        addon.hooks.onShortcuts("larger");
      }
      if (ev.shiftKey && ev.key === "S") {
        addon.hooks.onShortcuts("smaller");
      }
    });

    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "Example Shortcuts: Alt+L/S/C",
        type: "success",
      })
      .show();
  }

  @example
  static exampleShortcutLargerCallback() {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "Larger!",
        type: "default",
      })
      .show();
  }

  @example
  static exampleShortcutSmallerCallback() {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "Smaller!",
        type: "default",
      })
      .show();
  }
}

export class UIExampleFactory {
  @example
  static registerStyleSheet(win: Window) {
    const doc = win.document;
    const styles = ztoolkit.UI.createElement(doc, "link", {
      properties: {
        type: "text/css",
        rel: "stylesheet",
        href: `chrome://${config.addonRef}/content/zoteroPane.css`,
      },
    });
    doc.documentElement.appendChild(styles);
    doc.getElementById("zotero-item-pane-content")?.classList.add("makeItRed");
  }

  @example
  static registerRightClickMenuItem() {
    const menuIcon = `chrome://${config.addonRef}/content/icons/favicon@0.5x.png`;
    // item menuitem with icon
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: "zotero-itemmenu-addontemplate-test",
      label: getString("menuitem-label"),
      commandListener: (ev) => addon.hooks.onDialogEvents("dialogExample"),
      icon: menuIcon,
    });
  }

  @example
  static registerRightClickMenuPopup(win: Window) {
    ztoolkit.Menu.register(
      "item",
      {
        tag: "menu",
        label: getString("menupopup-label"),
        children: [
          {
            tag: "menuitem",
            label: getString("menuitem-submenulabel"),
            oncommand: "alert('Hello World! Sub Menuitem.')",
          },
        ],
      },
      "before",
      win.document.querySelector(
        "#zotero-itemmenu-addontemplate-test",
      ) as XUL.MenuItem,
    );
  }

  @example
  static registerWindowMenuWithSeparator() {
    ztoolkit.Menu.register("menuFile", {
      tag: "menuseparator",
    });
    // menu->File menuitem
    ztoolkit.Menu.register("menuFile", {
      tag: "menuitem",
      label: getString("menuitem-filemenulabel"),
      oncommand: "alert('Hello World! File Menuitem.')",
    });
  }

  @example
  static async registerExtraColumn() {
    const field = "test1";
    await Zotero.ItemTreeManager.registerColumns({
      pluginID: config.addonID,
      dataKey: field,
      label: "text column",
      dataProvider: (item: Zotero.Item, dataKey: string) => {
        return field + String(item.id);
      },
      iconPath: "chrome://zotero/skin/cross.png",
    });
  }

  @example
  static async registerExtraColumnWithCustomCell() {
    const field = "test2";
    await Zotero.ItemTreeManager.registerColumns({
      pluginID: config.addonID,
      dataKey: field,
      label: "custom column",
      dataProvider: (item: Zotero.Item, dataKey: string) => {
        return field + String(item.id);
      },
      renderCell(index, data, column) {
        ztoolkit.log("Custom column cell is rendered!");
        const span = Zotero.getMainWindow().document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          "span",
        );
        span.className = `cell ${column.className}`;
        span.style.background = "#0dd068";
        span.innerText = "⭐" + data;
        return span;
      },
    });
  }

  @example
  static registerTestTab() {
    Zotero.ItemPaneManager.registerSection({
      paneID: "test",
      pluginID: config.addonID,
      header: {
        l10nID: getLocaleID("item-section-example1-head-text"),
        icon: "chrome://zotero/skin/16/universal/book.svg",
      },
      sidenav: {
        l10nID: getLocaleID("item-section-example1-sidenav-tooltip"),
        // icon: "chrome://zotero/skin/20/universal/save.svg",
        icon: `chrome://${config.addonRef}/content/icons/mogic-ai-chat.svg`,
      },
      onToggle: () => {
        ztoolkit.getGlobal("alert")("wwww");
      },
      sectionButtons: [
        {
          type: "test",
          icon: "chrome://zotero/skin/16/universal/empty-trash.svg",
          l10nID: getLocaleID("item-section-example2-button-tooltip"),
          onClick: ({ item, paneID }) => {
            ztoolkit.getGlobal('alert')("Section clicked!" + item?.id);
          },
        },
      ],


    })
  }


  @example
  static registerItemPaneSection() {
    Zotero.ItemPaneManager.registerSection({
      paneID: "example",
      pluginID: config.addonID,
      header: {
        l10nID: getLocaleID("item-section-example1-head-text"),
        icon: "chrome://zotero/skin/16/universal/book.svg",
      },
      sidenav: {
        l10nID: getLocaleID("item-section-example1-sidenav-tooltip"),
        // icon: "chrome://zotero/skin/20/universal/save.svg",
        icon: `chrome://${config.addonRef}/content/icons/mogic-ai-chat.svg`,
      },
      onRender: ({ body, item, editable, tabType }) => {
        // ztoolkit.getGlobal('alert')('ffffffffffffffff')
        body.textContent = JSON.stringify({
          id: item?.id,
          editable,
          tabType,
        });
      },
      onItemChange: ({ item, setEnabled, tabType }) => {
        // ztoolkit.getGlobal('alert')('ffffffffffffffff')
        // setEnabled(tabType === "reader");
        return true;
      },
    });
  }

  @example
  static async registerReaderItemPaneSection(win: Window) {
    Zotero.ItemPaneManager.registerSection({
      paneID: "reader-example",
      pluginID: config.addonID,
      header: {
        l10nID: getLocaleID("item-section-example2-head-text"),
        // Optional
        l10nArgs: `{"status": "Initialized"}`,
        // Can also have a optional dark icon
        icon: "chrome://zotero/skin/16/universal/book.svg",
      },
      sidenav: {
        l10nID: getLocaleID("item-section-example2-sidenav-tooltip"),
        // icon: "chrome://zotero/skin/20/universal/save.svg",
        icon: `chrome://${config.addonRef}/content/icons/mogic-ai-chat.svg`,
      },
      // Optional
      // bodyXHTML: `<html:h1 id="${getTabKeyAndPdfName().tabKey}-test"></html:h1>`,
      bodyXHTML: `<html:h1 id="test"></html:h1>`,

      onInit: ({ item }) => {
        ztoolkit.log("Section init!", item?.id);
        //清空prefs中的selected_tab_chat_file_refs
        Zotero.Prefs.clear(`${config.prefsPrefix}.selected_tab_chat_file_refs`, true);
      },
      // Optional, Called when the section is destroyed, must be synchronous

      onDestroy: (props) => {
        ztoolkit.log("Section destroy!");
        console.log(props)
        const { paneID, doc, body } = props;

        const doc1 = ztoolkit.getGlobal("document")
        const mainContainerDiv = doc1.querySelector(".main-container") as HTMLElement
        if (mainContainerDiv) {
          mainContainerDiv.style.display = "none"
          doc1.documentElement.append(mainContainerDiv)

        } else {
          const mainContainerDiv1 = body.children[0] as HTMLDivElement
          mainContainerDiv1.style.display = "none"
          doc1.documentElement.append(body.children[0])
          // let mainNodes = doc1.querySelectorAll(`#test`) as NodeListOf<HTMLElement>;
          // for (let i = 0; i < mainNodes.length; i++) {
          //   if (mainNodes[i].offsetParent && mainNodes[i].childNodes.length == 0) {
          //     mainNodes[i].append(body.children[0])
          //     break
          //   }
          // }
        }
        return

        let mainNodes = doc1.querySelectorAll(`#test`) as NodeListOf<HTMLElement>;
        for (let i = 0; i < mainNodes.length; i++) {
          if (mainNodes[i].offsetParent && mainNodes[i].childNodes.length == 0) {
            mainNodes[i].append(body.children[0])
            break
          }
        }

        // if (mainContainerDiv) {
        //   doc1.documentElement.append(mainContainerDiv)
        // } else {
        //   doc1.documentElement.append(body.children[0])
        // }
        return

        //关闭了一个tab要将它的reader mainNode给删除
        // let mainNodes = doc1.querySelectorAll(`#test`) as NodeListOf<HTMLElement>;

        //遍历mainNodes，如果有offsetParent就将mainContainer给它，否则就删除
        for (let i = 0; i < mainNodes.length; i++) {
          if (mainNodes[i].offsetParent && mainNodes[i].childNodes.length == 0) {
            mainNodes[i].append(body.children[0])

          } else {
            mainNodes[i].remove()
          }
        }

        console.log(999, mainNodes)
        if (mainNodes) {

          console.log(mainNodes[0])
          console.log(body.children[0])
          if (mainNodes[0].childNodes[0])
            if (mainNodes[0].childNodes.length == 0) {
              mainNodes[0].appendChild(body.children[0])
            } else {
              mainNodes[0].childNodes[0].remove()
              mainNodes[0].appendChild(body.children[0])
            }
          //如果存在就随便将body.innerHTML给到任意个mainNode中就好
          // mainNodes[0] = body.innerHTML
          // if (mainNodes[0].children.length == 0) {
          //   mainNodes[0].children.appendElemet(body.children[0])
          // }
          // mainNodes[0].children[0] = body.children[0]
        }
        // console.log("hello11221", doc1.querySelectorAll(`#test`))

        body.remove()



        function appendNewMainNode() {
          const doc = ztoolkit.getGlobal("document")
          const mainNodes = doc.querySelectorAll(`#test`)
          // const mainNode = doc1.querySelector(`#test`)
          // ztoolkit.getGlobal("console").log(mainNode)
          ztoolkit.getGlobal("console").log(mainNodes)
          let mainNode: any
          mainNodes.forEach((_mainNode: any) => {

            if (_mainNode.offsetParent) {
              const item_key = _mainNode.offsetParent.children[0]._item._bestAttachmentState.key
              if (item_key === getTabKeyAndPdfName().tabKey) {
                mainNode = _mainNode
                return
              }
            } else {
              _mainNode.remove()
            }

          })

          const ResizeObserver = ztoolkit.getGlobal("ResizeObserver")

          //直接查询一下是否有mainContainer,如何有，就添加到mainNode中,没有再新建
          const mainContainerDiv = doc.querySelector(".main-container") as HTMLElement
          if (mainContainerDiv) {
            mainNode.append(mainContainerDiv)
            const graphContainerDiv = doc.getElementById("graph-view") as HTMLElement
            const resizeObserver = new ResizeObserver(entries => {
              for (let entry of entries) {
                const { width, height } = entry.contentRect;
                // ztoolkit.log('Element size changed to:', width, height);
                // ztoolkit.log(mainNode.offsetWidth, mainNode.offsetHeight);
                graphContainerDiv.style.width = `${width * 0.9 - 0.03 * ztoolkit.getGlobal("window").innerWidth}px`
                mainContainerDiv.style.width = `${width * 0.9}px`
              }
            });
            // 观察特定的元素
            resizeObserver.observe(mainNode);
          }
        }


      },
      // Optional, Called when the section data changes (setting item/mode/tabType/inTrash), must be synchronous. return false to cancel the change
      onItemChange: (props) => {
        const { item, setEnabled, tabType, body } = props;
        ztoolkit.log(`Section item data changed to ${item?.id} `);
        console.log("change to", props)

        const doc1 = ztoolkit.getGlobal("document")
        const mainNode = body.querySelector("#test") as HTMLElement
        const mainContainerDiv = doc1.querySelector(".main-container") as HTMLElement
        if (mainContainerDiv && mainNode) {
          mainContainerDiv.style.display = "flex"

          // body.children[0].append(mainContainerDiv)
          mainNode.append(mainContainerDiv)
        } else {
          return
        }


        // const graphContainer = mainContainerDiv.querySelector("#graph-view") as HTMLElement
        // const ResizeObserver = ztoolkit.getGlobal("ResizeObserver")
        // const resizeObserver = new ResizeObserver(entries => {
        //   console.log("resizeObserver")
        //   for (let entry of entries) {
        //     const { width, height } = entry.contentRect;
        //     ztoolkit.log('Element size changed to:', width, height);
        //     ztoolkit.log(mainNode.offsetWidth, mainNode.offsetHeight);
        //     graphContainer.style.width = `${width * 0.9 - 0.03 * ztoolkit.getGlobal("window").innerWidth} px`
        //     mainContainerDiv.style.width = `${width * 0.9} px`
        //   }
        // });

        // resizeObserver.observe(mainNode);

        setEnabled(tabType === "reader");

        return true;
      },
      // Called when the section is asked to render, must be synchronous.
      onRender: ({
        body,
        item,
        tabType,
        setEnabled,
        setL10nArgs,
        setSectionSummary,
        setSectionButtonStatus,
      }) => {
        setEnabled(tabType === "reader");
        ztoolkit.log("Section rendered!", item?.id);
        ztoolkit.log("Section rendered!", item?.id);
        setPref("isResponsing", false)
        clearPref("selected_tab_chat_file_refs")
        //获取html后续元素base宽高
        const { baseWidth, baseHeight } = getWindowSize()
        //获取主节点
        // const mainNode = body.querySelector(`#${ getTabKeyAndPdfName().tabKey } -test`) as HTMLElement;
        const mainNode = body.querySelector(`#test`) as HTMLElement;

        // mainNode.addEventListener("beforeremove", () => {
        //   console.log("beforeremove")
        // })

        //直接查询一下是否有mainContainer,如何有，就添加到mainNode中,没有再新建

        // if (mainNodes.length > 1) {
        //   mainNodes[0].id = `${ getTabKeyAndPdfName().tabKey } -test - old`
        // }else{

        // }
        // mainNode.id = `${ getTabKeyAndPdfName().tabKey } -test`
        // ztoolkit.getGlobal("alert")(`${ mainNode.offsetHeight } ${ mainNode.offsetWidth } `);




        const doc = win.document
        const ResizeObserver = ztoolkit.getGlobal("ResizeObserver")

        const resizeObserver = new ResizeObserver(entries => {
          const graphContainerDivv = doc.querySelector("#graph-view") as HTMLElement
          const mainContainerDivv = doc.querySelector(".main-container") as HTMLElement
          // const graphContainerDivv = doc.querySelectorAll("#graph-view") as NodeListOf<HTMLElement>
          // const mainContainerDivv = doc.querySelectorAll(".main-container") as NodeListOf<HTMLElement>
          if (!graphContainerDivv || !mainContainerDivv) return
          console.log(graphContainerDivv.style.width)
          console.log(mainContainerDivv.style.width)
          for (let entry of entries) {
            const { width, height } = entry.contentRect;
            // console.log('Element size changed to:', width, height);
            // ztoolkit.log(mainNode.offsetWidth, mainNode.offsetHeight);
            graphContainerDivv.style.width = `${width * 0.95 - 0.03 * ztoolkit.getGlobal("window").innerWidth}px`
            mainContainerDivv.style.width = `${width * 0.95}px`
            // console.log(graphContainerDivv.style.width)
            // console.log(mainContainerDivv.style.width)
          }
        });

        // 观察特定的元素

        resizeObserver.observe(mainNode);

        if (!item) {
          // 说明当前不是打开tab
          return
        }

        // //直接查询一下是否有mainContainer,如何有，就添加到mainNode中,没有再新建
        const mainContainerDiv = doc.querySelector(".main-container") as HTMLElement
        if (mainContainerDiv) {
          console.log("已经存在mainContainerDiv")
          console.log(item, Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item.id)
          //然后将mainContainerDiv添加到当前打开的tab中
          //首先判断当前是否有打开的tab
          // if (Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item.id === await item?.getBestAttachment().) {
          //   console.log("当前打开窗口")
          //   mainNode.append(mainContainerDiv)
          // }
          return
        }
        console.log("创造新的mainContainerDiv")
        console.log(item, Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item.id)
        // const mainContainerDiv = doc.querySelector(".main-container") as HTMLElement
        // if (mainContainerDiv) {
        //   mainNode.append(mainContainerDiv)
        //   const graphContainerDiv = doc.getElementById("graph-view") as HTMLElement
        //   const resizeObserver = new ResizeObserver(entries => {
        //     for (let entry of entries) {
        //       const { width, height } = entry.contentRect;
        //       ztoolkit.log('Element size changed to:', width, height);
        //       ztoolkit.log(mainNode.offsetWidth, mainNode.offsetHeight);
        //       graphContainerDiv.style.width = `${ width * 0.9 - 0.03 * ztoolkit.getGlobal("window").innerWidth } px`
        //       mainContainerDiv.style.width = `${ width * 0.9 } px`
        //     }
        //   });

        //   // 观察特定的元素

        //   resizeObserver.observe(mainNode);
        //   return
        // }





        // //直接查询一下是否有mainContainer,如何有，就添加到mainNode中,没有再新建
        // const mainContainerDiv = doc.querySelector(".main-container")
        // if (mainContainerDiv) {
        //   mainNode.append(mainContainerDiv)
        //   return
        // }
        const mainContainer = ztoolkit.UI.createElement(doc, "div", {
          styles: {
            height: `${baseHeight} vh`,
            // width: `${ baseWidth } vw`,
            // width: "95%",
            width: `${mainNode.offsetWidth * 0.95} px`,
            // maxWidth: "min(50vw, 95%)",
            // backgroundColor: "black",
            display: "flex",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative"
            // overflow: "hidden",

          },
          classList: ["main-container", "shallow_1"]
        })

        ztoolkit.UI.appendElement({
          tag: "link",
          id: `${config.addonRef} -link`,
          properties: {
            type: "text/css",
            rel: "stylesheet",
            href: `chrome://${config.addonRef}/content/main.css`
          }
        }, mainContainer)
        ztoolkit.UI.appendElement({
          tag: "link",
          id: `${config.addonRef}-link`,
          properties: {
            type: "text/css",
            rel: "stylesheet",
            href: `chrome://${config.addonRef}/content/loading.css`
          }
        }, mainContainer)

        //在主节点下创建一个容器
        const graphContainer = ztoolkit.UI.createElement(doc, "div", {
          id: "graph-view",
          styles: {
            // height: "850px",
            height: `${baseHeight}vh`,
            // flex: "1",
            width: `${mainNode.offsetWidth * 0.9}px`
            // maxWidth: "cal(100%-3vw)"
            // width: "calc(100%-3vw)"
            // width: "99%"
            // width: `${baseWidth - 3}vw`,
            // width: `${baseWidth - 3}vw`,
            // backgroundColor: "green",
            // overflow: "hidden",
            // backgroundColor: "#E6DEE4",
            // backgroundColor: "#D8DBE3",
            // borderRadius: "10px",
          },
          // classList: ['graph-container']
        })

        // 创建一个侧边栏，包含新建chat和chat列表两个按钮
        const sidebarContainer = ztoolkit.UI.createElement(doc, "div", {
          id: "sidebar-view",
          styles: {
            height: `${baseHeight}vh`,
            width: "3vw",
            // backgroundColor: "#D7D5E2",
            background: "linear-gradient(0deg,#D8E0E8 0%,#C2D5DE 100%)",
            display: "flex",
            // flexDirection: "column",
            // alignItems: "center"
            // overflow: "hidden",
          }
        })

        const chatListDivContainer = ztoolkit.UI.createElement(doc, "div", {
          namespace: "html",
          styles: {
            position: "relative",
            // width: "0.1vw",
            height: "100%",
            backgroundColor: "blue"
          }
        })

        // sidebarContainer.style.alignItems
        const sidebarButtonContainer = ztoolkit.UI.createElement(doc, "div", {
          id: "sidebar-view",
          styles: {
            height: `${baseHeight}vh`,
            width: "3vw",
            // backgroundColor: "#D7D5E2",
            // background: "linear-gradient(0deg,#D8E0E8 0%,#C2D5DE 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
            // overflow: "hidden",
          }
        })

        // sidebarContainer.append(chatListDivContainer, sidebarButtonContainer)
        sidebarContainer.append(sidebarButtonContainer, chatListDivContainer)

        function createSiderBarButton(text: string): HTMLDivElement {
          const createNewButton = ztoolkit.UI.createElement(doc, "div", {
            styles: {
              // border: "2px solid #000",
              borderRadius: "5px",
              // backgroundColor: "blue",
              width: "25px",
              height: "25px",
              margin: "10px"
              // marginTop: "10px"
            },
            namespace: "html",
            // attributes: {
            //   title: "创建新chat"
            // }
            classList: ["siderbar-button"]

          })
          createNewButton.style.fontSize = "12px";
          createNewButton.style.color = "white";
          createNewButton.style.display = "flex";
          createNewButton.style.alignItems = "center";
          createNewButton.style.justifyContent = "center";
          createNewButton.style.borderRadius = "5px";
          createNewButton.textContent = text;
          return createNewButton
        }

        //创建新建chat按钮
        // const createNewChatButton = ztoolkit.UI.createElement(doc, "div", {
        //   styles: {
        //     border: "2px solid #000",
        //     backgroundColor: "blue",
        //     width: "25px",
        //     height: "25px",
        //     marginTop: "10px"
        //   },
        //   namespace: "html",
        //   attributes: {
        //     title: "创建新chat"
        //   }

        // })
        // createNewChatButton.style.fontSize = "14px";
        // createNewChatButton.style.color = "white";
        // createNewChatButton.style.display = "flex";
        // createNewChatButton.style.alignItems = "center";
        // createNewChatButton.style.justifyContent = "center";
        // createNewChatButton.style.borderRadius = "5px";
        // createNewChatButton.textContent = "1";
        const createNewChatButton = createSiderBarButton("新建\n聊天")

        //添加选择监听
        createNewChatButton.addEventListener("click", async () => {
          // 正在对话或者上传文件的时候是不能新建chat
          if (sendButton.classList.contains("disabled") && selectFileButton.classList.contains("disabled")) {
            return
          }
          await getChatId(true)
          //清空graphContainer中chatFrame的所有内容

          // for (let child of chatFrame.children) {
          //   chatFrame.removeChild(child)

          // }
          while (chatFrame.childNodes.length != 0) {
            chatFrame.removeChild(chatFrame.childNodes[0])
          }
        })

        //创建新建chat列表按钮
        // const showChatListButton = ztoolkit.UI.createElement(doc, "div", {
        //   styles: {
        //     border: "2px solid #000",
        //     backgroundColor: "blue",
        //     width: "25px",
        //     height: "25px",
        //     marginTop: "10px",
        //   },
        //   namespace: "html",
        //   attributes: {
        //     title: "展示"
        //   }


        // })
        // showChatListButton.style.fontSize = "14px";
        // showChatListButton.style.color = "white";
        // showChatListButton.style.display = "flex";
        // showChatListButton.style.alignItems = "center";
        // showChatListButton.style.justifyContent = "center";
        // showChatListButton.style.borderRadius = "5px";
        // showChatListButton.textContent = "2";

        // showChatListButton.addEventListener("click", async () => {
        // })



        const showChatListButton = createSiderBarButton("历史\n列表")
        const chatListDiv = createChatListDiv()
        const noteButtonDiv = createNoteButton()
        chatListDivContainer.append(chatListDiv, noteButtonDiv)
        showChatListButton.addEventListener("click", async () => {

          chatListDiv.classList.toggle("chat-list-show")

          if (noteButtonDiv.classList.contains("note-button-div-show")) {
            whenClickNewNoteButton()
          }
          // noteButtonDiv.classList.remove("note-button-div-show")

          // 监听动画结束事件
          if (chatListDiv.classList.contains("chat-list-show")) {
            searchChatList(chatListDiv)
            chatListDiv.style.zIndex = "10000";
          }
          chatListDiv.addEventListener('transitionend', function handleTransitionEnd() {
            // 确保在动画结束后移除事件监听器
            chatListDiv.removeEventListener('transitionend', handleTransitionEnd);

            // 确保 z-index 在动画结束后生效
            if (!chatListDiv.classList.contains("chat-list-show")) {
              chatListDiv.style.zIndex = "-1";
              while (chatListDiv.childNodes.length != 0) {
                chatListDiv.removeChild(chatListDiv.childNodes[0])
              }
            }
          })
          // const doc = ztoolkit.getGlobal("document")
          // doc.documentElement.append(chatListDiv)
        })


        // const createNewItemButton = createSiderBarButton("新建\n条目")
        const createNewItemButton = createSiderBarButton("论文\功能")

        //添加选择监听
        createNewItemButton.addEventListener("click", async () => {
          // createSQLiteFile()
          // genQRCode("")
          // createLoginDiv()
          // setPref("refresh_token", "")
          // integrateNewOldSqlite()
          // syncSqliteWebDav()
          // Zotero.Reader.
          // loadLibraryNotes()
          // openLinkCreator(ZoteroPane.getSelectedItems()[0])
          // chat_with_kimi()
          // chat_with_deepseek()
          // chat_with_deepseek_stream()

        })

        const createNewNotesutton = createSiderBarButton("新建\n笔记")

        //添加选择监听
        createNewNotesutton.addEventListener("click", async () => {
          // createSQLiteFile()
        })

        createNewNotesutton.addEventListener("click", async () => {
          whenClickNewNoteButton()

        })


        // sidebarButtonContainer.append(createNewChatButton, showChatListButton, createNewItemButton, createNewNotesutton)
        sidebarButtonContainer.append(createNewChatButton, showChatListButton, createNewNotesutton)


        mainContainer.append(sidebarContainer, graphContainer)
        mainNode?.append(mainContainer);

        //创建一个div用于存放问答记录
        const chatFrame = ztoolkit.UI.createElement(doc, "div", {
          namespace: "html",
          id: "chat-frame",
          styles: {
            width: "100%"
          },
          classList: ["chat-frame"]
        });
        chatFrame.style.border = "none";
        chatFrame.style.outline = "none";
        // chatFrame.style.width = graphContainer.style.width;
        // chatFrame.style.height = `${baseHeight * 0.75}vh`;
        chatFrame.style.height = `${baseHeight * 0.85}vh`;
        // chatFrame.style.overflow = "hidden";
        chatFrame.style.overflowWrap = "break-all";
        chatFrame.style.overflowY = "auto";
        chatFrame.style.backgroundColor = "#F5F4F4";
        chatFrame.style.scrollbarWidth = "thin";
        // chatFrame.textContent = "hello";
        graphContainer.append(chatFrame);



        const resizer = ztoolkit.UI.createElement(doc, "div", {
          styles: {
            height: `10px`,
            width: "100%",
            backgroundColor: "#cecece",
            cursor: "ns-resize",
            overflowWrap: "break-word",
          }
        });
        // graphContainer.insertBefore(resizer, chatFrame);



        //创建一个div用于存放输入框和发送按钮以及选择附件按钮
        const InputFrame = ztoolkit.UI.createElement(doc, "div", { namespace: "html" });
        InputFrame.style.display = "flex";
        InputFrame.style.alignItems = "center";
        InputFrame.style.justifyContent = "center";
        // InputFrame.style.backgroundColor = "red"
        InputFrame.style.height = "4vh";
        InputFrame.style.marginTop = "5px";
        InputFrame.style.padding = "2px";
        // InputFrame.style.flex = "1";
        InputFrame.style.maxWidth = "100%";
        InputFrame.style.width = "100%";


        //创建一个用于展示上传文件的frame
        const displayFileFrame = ztoolkit.UI.createElement(doc, "div", {
          namespace: "html",
          styles: {
            display: "flex",
            flexWrap: "wrap",
            // flex: "1",
            maxWidth: "100%",
            width: "100%",
            gap: "10px", /* 调整元素之间的间距 */
            // height: `${baseHeight * 0.25 - 6}vh`,
            height: `${baseHeight * 0.15 - 6}vh`,
            // width: "99%",
            // width: `${baseWidth - 3 - 1}vw`,

            // width: graphContainer.style.width,
            // width: "600px",
            // marginTop: "5px",
            // backgroundColor: "purple",
            padding: "1vh 0.5vw",
            overflowY: "auto",
            scrollbarWidth: "thin",
          },
          classList: ["display-file-frame"]
        });

        graphContainer.append(InputFrame, displayFileFrame)
        //创建选择附件按钮(img)
        const selectFileButton = ztoolkit.UI.createElement(doc, "img", {
          styles: {
            // backgroundColor: "#d3d3d3",
            width: "25px",
            height: "25px",
            position: "relative",
            // borderRadius: "2px",
          },
          properties: {
            title: "选择文件",
            src: `chrome://${config.addonRef}/content/icons/attachment_1.png`
          },
          namespace: "html",
          classList: ["select-file-button"]
          // children: [
          //   // {
          //   //   tag: "img",
          //   //   properties: {
          //   //     src: `chrome://${config.addonRef}/content/icons/attachment_0.png`
          //   //   },
          //   //   styles: {
          //   //     position: "absolution"
          //   //   }
          //   // },
          //   {
          //     id: "file_select_input",
          //     tag: "input",
          //     properties: {
          //       type: "file",
          //       class: ""
          //     },
          //     styles: {
          //       // display: "none"
          //     }
          //   }
          // ]

        })

        const acceptFileType = ["image/png", "image/jpg", "image/jpeg", "image/bmp", "application/pdf"]
        const fileInput = ztoolkit.UI.createElement(doc, 'input', {
          namespace: "html",
          styles: {
            display: "none"
          },
          properties: {
            type: "file",
            accept: acceptFileType.join(",")
          },
        })
        //添加选择监听
        selectFileButton.addEventListener("click", (e) => {

          ztoolkit.log(`fileInput: ${fileInput}`)
          fileInput.click()
          // filePickerCallback(sendButton, selectFileButton, userInput)
          // ztoolkit.log(e.target)
        })

        fileInput.addEventListener('change', function (event: any) {
          const file = event.target.files[0]
          ztoolkit.getGlobal("console").log(file)
          if (!acceptFileType.includes(file.type)) {
            ztoolkit.getGlobal("alert")("文件格式不支持")
            return
          }

          // //然后转换为blob
          // const blobUrl = new Blob(file)
          // ztoolkit.getGlobal("console").log(blobUrl)
          //
          filePickerCallback(file, sendButton, selectFileButton, userInput, displayFileFrame)
        });

        //创建发送按钮(div)
        const sendButton = ztoolkit.UI.createElement(doc, "div", {
          styles: {
            // border: "2px solid #000",
            backgroundColor: "blue",
            width: "45px",
            height: "25px",
          },
          namespace: "html",
          attributes: {
            class: "disabled"
          },
          classList: ["send_button"]


        })
        sendButton.style.fontSize = "12px";
        sendButton.style.color = "white";
        sendButton.style.display = "flex";
        sendButton.style.alignItems = "center";
        sendButton.style.justifyContent = "center";
        sendButton.style.borderRadius = "5px";
        sendButton.textContent = "发送";
        sendButton.classList.add("disabled")

        //添加选择监听
        sendButton.addEventListener("click", () => {
          sendInputMessage()
          autoExpand() //更新一下行数
          // ztoolkit.getGlobal("navigator").clipboard.readText().then(text => {
          //   ztoolkit.getGlobal("alert")(text)
          // })
        })

        //添加监听paste事件

        // doc.querySelector(".main-container")?.addEventListener("paste", async (event: any) => {
        //   event.preventDefault()
        //   const clipboardData = event.clipboardData
        //   ztoolkit.getGlobal("alert")(clipboardData.types)
        //   // ztoolkit.getGlobal("navigator").clipboard.readText().then(text => {

        //   //   const clipboardData = event.clipboardData
        //   //   ztoolkit.getGlobal("alert")(clipboardData.types)
        //   // })
        // })
        // doc.addEventListener("paste", (event: any) => {
        //   let clipboardData, pastedData;
        //   // 防止默认行为
        //   if (doc.activeElement === userInput) {
        //     // ztoolkit.getGlobal("alert")("请使用快捷键复制")
        //     return
        //   }
        //   event.preventDefault();


        //   // 使用事件对象的clipboardData对象获取剪切板数据
        //   clipboardData = event.clipboardData
        //   if (clipboardData.types && clipboardData.types.length) {
        //     if (clipboardData.types.includes('text/plain')) {
        //       pastedData = clipboardData.getData('Text');
        //       // userInput.textContent += pastedData;
        //     } else if (clipboardData.types.includes('Files') && clipboardData.files && clipboardData.files.length) {
        //       const reader = new FileReader();
        //       // 文件读取成功完成后的处理
        //       reader.onload = (e: any) => {

        //         pastedData = e.target.result;
        //         ztoolkit.getGlobal("console").log(pastedData)
        //         // 在这里使用base64String，例如可以将其设置为图片的src
        //         // ztoolkit.log("复制1" + pastedData);
        //         new ztoolkit.Clipboard().addText(pastedData).copy()
        //       };
        //       // 以DataURL的形式读取文件
        //       ztoolkit.log(clipboardData.files[0])
        //       ztoolkit.getGlobal("console").log(clipboardData.files[0])
        //       reader.readAsDataURL(clipboardData.files[0]);
        //     }
        //   }

        //   // if (doc.activeElement === userInput) {
        //   //   ztoolkit.getGlobal("alert")("粘贴板事件")
        //   //   userInput.textContent += pastedData;
        //   //   // autoExpand()
        //   // } else {
        //   //   ztoolkit.getGlobal("alert")("粘贴板事件2")
        //   // }

        // })


        function sendInputMessage() {
          if (noteButtonDiv.classList.contains("note-button-div-show")) {
            whenClickNewNoteButton()
          }
          if (!userInput.value.trim()) {
            // sendButton.classList.add("disabled")
            new ztoolkit.ProgressWindow("输入错误", { closeTime: 1000 }).createLine({
              text: "请输入内容",
              type: "fail",
            }).show()
            return
          }
          if (!sendButton.classList.contains("disabled")) {
            const userInputText = userInput.value;
            // ztoolkit.getGlobal("alert")(userInputText)
            const userMessageDiv = create_user_message_box(doc, displayFileFrame, userInputText)
            chatFrame.appendChild(userMessageDiv)
            const botMessageDiv = create_bot_message_box(doc, "")
            chatFrame.appendChild(botMessageDiv)
            get_bot_response(doc, chatFrame, botMessageDiv, sendButton, selectFileButton, userInputText)
            chatFrame.scrollTop = chatFrame.scrollHeight
            userInput.value = ""
            sendButton.classList.add("disabled")
            selectFileButton.classList.add("disabled")
          }
        }

        const userInputDiv = ztoolkit.UI.createElement(doc, "div", {
          styles: {
            width: "320px",
            position: "relative",
            height: "100%",
            // backgroundColor: "#fff999",
            padding: "0px 5px 5px 5px"
          },
          namespace: "html",

        });

        //创建用户输入框
        const userInput = ztoolkit.UI.createElement(doc, "textarea", {
          styles: {
            backgroundColor: "#ffffff",
            border: "1px solid #d3d3d3",
            margin: "3px",
            // width: "320px",
            width: "90%",
            // lineHeight: "60%",
            // height:"",
            padding: "5px",
            height: "20px",
            resize: "none",
            position: "absolute",
            bottom: "0px",
            scrollbarWidth: "thin",
            // scrollbarColor: "red green"
          },
          namespace: "html",
          properties: {
            placeholder: "默认填写",
            rows: 1
          },
          classList: ["user-input"]
        });
        userInput.style.fontSize = "14px";
        userInput.style.borderRadius = "10px";
        userInput.style.wordBreak = "break-all";
        userInput.style.fontFamily = "Arial";
        userInput.style.fontWeight = "normal"
        userInput.style.alignItems = "center";
        // userInput.style.height = userInputDiv.scrollHeight.toString()
        // ztoolkit.log(`userInputDiv.scrollHeight.的高度: ${userInputDiv.scrollHeight.toString()}`)

        userInput.addEventListener("change", (e: any) => {
          // ztoolkit.getGlobal("console").log(`输入框内容变化: ${e.target.value}`)
          if (e.target.value.length != 0 && !getPref("isResponsing")) {
            sendButton.classList.remove("disabled")
            // userInput.textContent = e.target.value

          } else {
            sendButton.classList.add("disabled")
            // userInput.textContent = ""
          }
          // ztoolkit.getGlobal("alert")("change")
          autoExpand()
        })

        userInput.addEventListener("input", (e: any) => {
          // ztoolkit.getGlobal("console").log(`输入框内容变化: ${e.target.value}`)
          // ztoolkit.getGlobal("alert")("input")
          if (e.target.value.length != 0 && !getPref("isResponsing")) {
            sendButton.classList.remove("disabled")
          } else {
            sendButton.classList.add("disabled")
          }
          autoExpand()
        })


        userInput.addEventListener("paste", (event: any) => {
          let clipboardData, pastedData;
          event.preventDefault();
          // ztoolkit.getGlobal("alert")("粘贴板事件")
          // ztoolkit.getGlobal("console").log(userInput.textContent)
          // ztoolkit.getGlobal("console").log(userInput.textLength)


          // 使用事件对象的clipboardData对象获取剪切板数据
          clipboardData = event.clipboardData || window.clipboardData;
          if (clipboardData.types && clipboardData.types.length) {
            if (clipboardData.types.includes('text/plain')) {
              pastedData = clipboardData.getData('Text');
              userInput.value += pastedData;
              // let userinput: any = doc.querySelector(".user-input")
              // userinput.textContent += pastedData
            } else if (clipboardData.types.includes('Files') && clipboardData.files && clipboardData.files.length) {
              // const reader = new FileReader();
              // // 文件读取成功完成后的处理
              // reader.onload = (e: any) => {

              //   pastedData = e.target.result;
              //   ztoolkit.getGlobal("console").log(pastedData)
              //   // 在这里使用base64String，例如可以将其设置为图片的src
              //   // ztoolkit.log("复制1" + pastedData);
              //   // new ztoolkit.Clipboard().addText(pastedData).copy()
              // };
              // // 以DataURL的形式读取文件
              // ztoolkit.log(clipboardData.files[0])
              ztoolkit.getGlobal("console").log(clipboardData.files[0])
              // reader.readAsDataURL(clipboardData.files[0]);
              // reader.readAsArrayBuffer(clipboardData.files[0]);
              filePickerCallback(clipboardData.files[0], sendButton, selectFileButton, userInput, displayFileFrame)
            }
          }
          autoExpand() //这里change事件没触发，手动执行一下autoExpand
          if (userInput.textLength != 0 && !getPref("isResponsing")) {
            sendButton.classList.remove("disabled")
          } else {
            sendButton.classList.add("disabled")
          }

        })


        userInputDiv.append(userInput)

        // 检查是否按下了Shift键和Enter键
        let isShiftPressed = false;
        function handleKeyDown(e: any) {
          if (e.key === 'Shift') {
            isShiftPressed = true;
          }
        }

        function handleKeyUp(e: any) {
          if (e.key === 'Shift') {
            isShiftPressed = false;
          }
        }

        function handleKeyPress(e: any) {
          // 检查是否按下了Enter键
          if (e.key === 'Enter') {
            // 如果Shift键没有被按下，提交表单
            if (!isShiftPressed) {
              e.preventDefault(); // 阻止默认行为，如换行
              sendInputMessage()
              autoExpand() //更新一下行数
            } else {
              userInput.textContent += '\n';
              // 如果Shift键被按下，允许换行
              // 这里不做任何操作，因为默认行为就是换行
            }
          }
        }
        userInput.addEventListener('keydown', handleKeyDown);
        userInput.addEventListener('keyup', handleKeyUp);
        userInput.addEventListener('keypress', handleKeyPress);

        InputFrame.append(selectFileButton);
        // InputFrame.append(userInput);
        InputFrame.append(userInputDiv);
        InputFrame.append(sendButton);
        function autoExpand1() {
          const HEIGHT = 10
          const maxRows = 5; // 设置最大行数
          // userInput.style.height = 'auto';
          userInput.style.height = HEIGHT + 'px';
          userInput.style.height = Math.min(HEIGHT, userInput.scrollHeight - parseInt(userInput.style.padding), maxRows * 0.0148 * ztoolkit.getGlobal("window").innerHeight) + "px";
        }

        function autoExpand() {
          const computed = userInput.style.height;
          if (userInput.textLength === 0) {
            userInput.style.height = "20px"
            // ztoolkit.getGlobal("alert")("000")
            return
          }
          userInput.style.height = 'auto'; // 重置高度
          let computedHeight = userInput.scrollHeight; // 获取滚动高度
          // ztoolkit.getGlobal("alert")(computedHeight)
          userInput.style.height = `${computedHeight}px`; // 设置新的高度
          userInput.style.maxHeight = `${150}px`; // 设置新的高度
          ztoolkit.log(`autoExpand: ${computed}`)
          ztoolkit.log(`autoExpand: ${computedHeight}`)
          if (computedHeight > 150) { // 如果高度超过最大高度
            userInput.style.overflowY = 'auto'; // 显示滚动条
          } else {
            userInput.style.overflowY = 'hidden'; // 隐藏滚动条
          }
        }
        // 为textarea注册input事件监听器
        userInput.addEventListener('input', autoExpand);

        //检查一下refresh_token
        const qrMaskDiv = doc.querySelector(".qrcode-mask-div") as HTMLDivElement

        if (qrMaskDiv) {
          // ztoolkit.getGlobal("alert")("need to refresh")
          mainContainer.append(qrMaskDiv)
          qrMaskDiv.style.display = "flex"
        } else {
          // ztoolkit.getGlobal("alert")("没找到")
        }

        setL10nArgs(`{ "status": "Loading" }`);
        setSectionSummary("loading!");
        setSectionButtonStatus("test", { hidden: true });
      },
      // Optional, can be asynchronous.
      onAsyncRender: async ({
        body,
        item,
        setL10nArgs,
        setSectionSummary,
        setSectionButtonStatus,
      }) => {
        ztoolkit.log("Section secondary render start!", item?.id);
        await Zotero.Promise.delay(1000);
        ztoolkit.log("Section secondary render finish!", item?.id);

        // const mainContainerDiv = document.querySelector(".main-container") as HTMLElement
        // const mainNode = body.querySelectorAll("#test") as NodeListOf<HTMLDivElement>
        // console.log(mainNode)
        // if (mainContainerDiv) {
        //   console.log("已经存在mainContainerDiv")
        //   console.log(item, Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item.id)
        //   //然后将mainContainerDiv添加到当前打开的tab中
        //   //首先判断当前是否有打开的tab
        //   const curItem = await item?.getBestAttachment()
        //   if (curItem) {
        //     if (Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item.id === curItem.id) {
        //       console.log(curItem.id)
        //       console.log("当前打开窗口")
        //       mainNode[0].append(mainContainerDiv)
        //     }
        //     // return
        //   }
        // }



        setL10nArgs(`{ "status": "Loaded" }`);
        // setSectionSummary("rendered我的!");
        setSectionSummary("");
        setSectionButtonStatus("test", { hidden: false });
      },
      // Optional, Called when the section is toggled. Can happen anytime even if the section is not visible or not rendered
      onToggle: ({ item }) => {
        ztoolkit.log("Section toggled!", item?.id);
      },
      // Optional, Buttons to be shown in the section header
      sectionButtons: [
        {
          type: "test",
          icon: "chrome://zotero/skin/16/universal/empty-trash.svg",
          l10nID: getLocaleID("item-section-example2-button-tooltip"),
          onClick: ({ item, paneID }) => {
            ztoolkit.log("Section clicked!", item?.id);
            Zotero.ItemPaneManager.unregisterSection(paneID);
          },
        },
        {
          type: "test",
          icon: "chrome://zotero/skin/16/universal/empty-trash.svg",
          l10nID: getLocaleID("item-section-example2-button-tooltip"),
          onClick: ({ item, paneID }) => {
            ztoolkit.log("Section clicked!", item?.id);
            Zotero.ItemPaneManager.unregisterSection(paneID);
          },
        },
      ],
    });
  }
}

export class PromptExampleFactory {
  @example
  static registerNormalCommandExample() {
    ztoolkit.Prompt.register([
      {
        name: "Normal Command Test",
        label: "Plugin Template",
        callback(prompt) {
          ztoolkit.getGlobal("alert")("Command triggered!");
        },
      },
    ]);
  }

  @example
  static registerAnonymousCommandExample(window: Window) {
    ztoolkit.Prompt.register([
      {
        id: "search",
        callback: async (prompt) => {
          // https://github.com/zotero/zotero/blob/7262465109c21919b56a7ab214f7c7a8e1e63909/chrome/content/zotero/integration/quickFormat.js#L589
          function getItemDescription(item: Zotero.Item) {
            const nodes = [];
            let str = "";
            let author,
              authorDate = "";
            if (item.firstCreator) {
              author = authorDate = item.firstCreator;
            }
            let date = item.getField("date", true, true) as string;
            if (date && (date = date.substr(0, 4)) !== "0000") {
              authorDate += " (" + parseInt(date) + ")";
            }
            authorDate = authorDate.trim();
            if (authorDate) nodes.push(authorDate);

            const publicationTitle = item.getField(
              "publicationTitle",
              false,
              true,
            );
            if (publicationTitle) {
              nodes.push(`<i>${publicationTitle}</i>`);
            }
            let volumeIssue = item.getField("volume");
            const issue = item.getField("issue");
            if (issue) volumeIssue += "(" + issue + ")";
            if (volumeIssue) nodes.push(volumeIssue);

            const publisherPlace = [];
            let field;
            if ((field = item.getField("publisher")))
              publisherPlace.push(field);
            if ((field = item.getField("place"))) publisherPlace.push(field);
            if (publisherPlace.length) nodes.push(publisherPlace.join(": "));

            const pages = item.getField("pages");
            if (pages) nodes.push(pages);

            if (!nodes.length) {
              const url = item.getField("url");
              if (url) nodes.push(url);
            }

            // compile everything together
            for (let i = 0, n = nodes.length; i < n; i++) {
              const node = nodes[i];

              if (i != 0) str += ", ";

              if (typeof node === "object") {
                const label =
                  Zotero.getMainWindow().document.createElement("label");
                label.setAttribute("value", str);
                label.setAttribute("crop", "end");
                str = "";
              } else {
                str += node;
              }
            }
            if (str.length) str += ".";
            return str;
          }
          function filter(ids: number[]) {
            ids = ids.filter(async (id) => {
              const item = (await Zotero.Items.getAsync(id)) as Zotero.Item;
              return item.isRegularItem() && !(item as any).isFeedItem;
            });
            return ids;
          }
          const text = prompt.inputNode.value;
          prompt.showTip("Searching...");
          const s = new Zotero.Search();
          s.addCondition("quicksearch-titleCreatorYear", "contains", text);
          s.addCondition("itemType", "isNot", "attachment");
          let ids = await s.search();
          // prompt.exit will remove current container element.
          // @ts-ignore ignore
          prompt.exit();
          const container = prompt.createCommandsContainer();
          container.classList.add("suggestions");
          ids = filter(ids);
          console.log(ids.length);
          if (ids.length == 0) {
            const s = new Zotero.Search();
            const operators = [
              "is",
              "isNot",
              "true",
              "false",
              "isInTheLast",
              "isBefore",
              "isAfter",
              "contains",
              "doesNotContain",
              "beginsWith",
            ];
            let hasValidCondition = false;
            let joinMode = "all";
            if (/\s*\|\|\s*/.test(text)) {
              joinMode = "any";
            }
            text.split(/\s*(&&|\|\|)\s*/g).forEach((conditinString: string) => {
              const conditions = conditinString.split(/\s+/g);
              if (
                conditions.length == 3 &&
                operators.indexOf(conditions[1]) != -1
              ) {
                hasValidCondition = true;
                s.addCondition(
                  "joinMode",
                  joinMode as Zotero.Search.Operator,
                  "",
                );
                s.addCondition(
                  conditions[0] as string,
                  conditions[1] as Zotero.Search.Operator,
                  conditions[2] as string,
                );
              }
            });
            if (hasValidCondition) {
              ids = await s.search();
            }
          }
          ids = filter(ids);
          console.log(ids.length);
          if (ids.length > 0) {
            ids.forEach((id: number) => {
              const item = Zotero.Items.get(id);
              const title = item.getField("title");
              const ele = ztoolkit.UI.createElement(window.document, "div", {
                namespace: "html",
                classList: ["command"],
                listeners: [
                  {
                    type: "mousemove",
                    listener: function () {
                      // @ts-ignore ignore
                      prompt.selectItem(this);
                    },
                  },
                  {
                    type: "click",
                    listener: () => {
                      prompt.promptNode.style.display = "none";
                      ztoolkit.getGlobal("Zotero_Tabs").select("zotero-pane");
                      ztoolkit.getGlobal("ZoteroPane").selectItem(item.id);
                    },
                  },
                ],
                styles: {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                },
                children: [
                  {
                    tag: "span",
                    styles: {
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                    properties: {
                      innerText: title,
                    },
                  },
                  {
                    tag: "span",
                    styles: {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                    properties: {
                      innerHTML: getItemDescription(item),
                    },
                  },
                ],
              });
              container.appendChild(ele);
            });
          } else {
            // @ts-ignore ignore
            prompt.exit();
            prompt.showTip("Not Found.");
          }
        },
      },
    ]);
  }

  @example
  static registerConditionalCommandExample() {
    ztoolkit.Prompt.register([
      {
        name: "Conditional Command Test",
        label: "Plugin Template",
        // The when function is executed when Prompt UI is woken up by `Shift + P`, and this command does not display when false is returned.
        when: () => {
          const items = ztoolkit.getGlobal("ZoteroPane").getSelectedItems();
          return items.length > 0;
        },
        callback(prompt) {
          prompt.inputNode.placeholder = "Hello World!";
          const items = ztoolkit.getGlobal("ZoteroPane").getSelectedItems();
          ztoolkit.getGlobal("alert")(
            `You select ${items.length} items!\n\n${items
              .map(
                (item, index) =>
                  String(index + 1) + ". " + item.getDisplayTitle(),
              )
              .join("\n")}`,
          );
        },
      },
    ]);
  }
}

export class HelperExampleFactory {
  @example
  static async dialogExample() {
    const dialogData: { [key: string | number]: any } = {
      inputValue: "test",
      checkboxValue: true,
      loadCallback: () => {
        ztoolkit.log(dialogData, "Dialog Opened!");
      },
      unloadCallback: () => {
        ztoolkit.log(dialogData, "Dialog closed!");
      },
    };
    const dialogHelper = new ztoolkit.Dialog(10, 2)
      .addCell(0, 0, {
        tag: "h1",
        properties: { innerHTML: "Helper Examples" },
      })
      .addCell(1, 0, {
        tag: "h2",
        properties: { innerHTML: "Dialog Data Binding" },
      })
      .addCell(2, 0, {
        tag: "p",
        properties: {
          innerHTML:
            "Elements with attribute 'data-bind' are binded to the prop under 'dialogData' with the same name.",
        },
        styles: {
          width: "200px",
        },
      })
      .addCell(3, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox",
        },
        properties: { innerHTML: "bind:checkbox" },
      })
      .addCell(
        3,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-checkbox",
          attributes: {
            "data-bind": "checkboxValue",
            "data-prop": "checked",
            type: "checkbox",
          },
          properties: { label: "Cell 1,0" },
        },
        false,
      )
      .addCell(4, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-input",
        },
        properties: { innerHTML: "bind:input" },
      })
      .addCell(
        4,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-input",
          attributes: {
            "data-bind": "inputValue",
            "data-prop": "value",
            type: "text",
          },
        },
        false,
      )
      .addCell(5, 0, {
        tag: "h2",
        properties: { innerHTML: "Toolkit Helper Examples" },
      })
      .addCell(
        6,
        0,
        {
          tag: "button",
          namespace: "html",
          attributes: {
            type: "button",
          },
          listeners: [
            {
              type: "click",
              listener: (e: Event) => {
                addon.hooks.onDialogEvents("clipboardExample");
              },
            },
          ],
          children: [
            {
              tag: "div",
              styles: {
                padding: "2.5px 15px",
              },
              properties: {
                innerHTML: "example:clipboard",
              },
            },
          ],
        },
        false,
      )
      .addCell(
        7,
        0,
        {
          tag: "button",
          namespace: "html",
          attributes: {
            type: "button",
          },
          listeners: [
            {
              type: "click",
              listener: (e: Event) => {
                addon.hooks.onDialogEvents("filePickerExample");
              },
            },
          ],
          children: [
            {
              tag: "div",
              styles: {
                padding: "2.5px 15px",
              },
              properties: {
                innerHTML: "example:filepicker",
              },
            },
          ],
        },
        false,
      )
      .addCell(
        8,
        0,
        {
          tag: "button",
          namespace: "html",
          attributes: {
            type: "button",
          },
          listeners: [
            {
              type: "click",
              listener: (e: Event) => {
                addon.hooks.onDialogEvents("progressWindowExample");
              },
            },
          ],
          children: [
            {
              tag: "div",
              styles: {
                padding: "2.5px 15px",
              },
              properties: {
                innerHTML: "example:progressWindow",
              },
            },
          ],
        },
        false,
      )
      .addCell(
        9,
        0,
        {
          tag: "button",
          namespace: "html",
          attributes: {
            type: "button",
          },
          listeners: [
            {
              type: "click",
              listener: (e: Event) => {
                addon.hooks.onDialogEvents("vtableExample");
              },
            },
          ],
          children: [
            {
              tag: "div",
              styles: {
                padding: "2.5px 15px",
              },
              properties: {
                innerHTML: "example:virtualized-table",
              },
            },
          ],
        },
        false,
      )
      .addButton("Confirm", "confirm")
      .addButton("Cancel", "cancel")
      .addButton("Help", "help", {
        noClose: false,
        callback: (e) => {
          dialogHelper.window?.alert(
            "Help Clicked! Dialog will not be closed.",
          );
        },
      })
      .addButton("测试一下", "test", {
        callback: (e) => {
          this.test();
        },
      })
      .setDialogData(dialogData)
      .open("Dialog Example");
    addon.data.dialog = dialogHelper;
    await dialogData.unloadLock.promise;
    addon.data.dialog = undefined;
    if (addon.data.alive)
      ztoolkit.getGlobal("alert")(
        `Close dialog with ${dialogData._lastButtonId}.\nCheckbox: ${dialogData.checkboxValue}\nInput: ${dialogData.inputValue}.`,
      );
    ztoolkit.log(dialogData);
  }

  @example
  static clipboardExample() {
    new ztoolkit.Clipboard()
      .addText(
        "![Plugin Template](https://github.com/windingwind/zotero-plugin-template)",
        "text/unicode",
      )
      .addText(
        '<a href="https://github.com/windingwind/zotero-plugin-template">Plugin Template</a>',
        "text/html",
      )
      .copy();

    ztoolkit.getGlobal("alert")("Copied!");
  }
  static async getreader1() {
    const reader = await ztoolkit.Reader.getReader();
    console.log(reader);
  }

  @example
  static async filePickerExample() {
    const path = await new ztoolkit.FilePicker(
      "Import File",
      "open",
      [
        ["PNG File(*.png)", "*.png"],
        ["Any", "*.*"],
      ],
      "image.png",
    ).open();
    ztoolkit.getGlobal("alert")(`Selected 11 ${path}`);
  }

  @example
  static progressWindowExample() {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "ProgressWindow Example!",
        type: "success",
        progress: 100,
      })
      .show();
  }

  @example
  static vtableExample() {
    ztoolkit.getGlobal("alert")("See src/modules/preferenceScript.ts");
  }

  @example
  static test() {
    ztoolkit.getGlobal("alert")("测试一下");
  }
}
