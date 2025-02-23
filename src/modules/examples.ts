import { config } from "../../package.json";
import { getLocaleID, getString } from "../utils/locale";
import { filePickerCallback } from "./file"
import { getPref, setPref, clearPref } from "../utils/prefs"
import { getWindowSize } from "../utils/window"




import { KimiApi } from "kimi-apis";
import { getReaderParentId } from "./notebuttion";
import { createAiSideBarMenu } from "./menu";
import { fileUploadHistoryJsonName, fileUploadHistoryJsonPath } from "../utils/fileSync";




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

    function removeDomElement() {
      const aaa = document.querySelectorAll(".ai-sidebar-menu-folder-container")
      aaa.forEach(element => {
        element.remove()
      });
      const kimiMainContainerDiv = document.querySelectorAll(".kimi-main-container-div")
      kimiMainContainerDiv.forEach(element => {
        element.remove()
      });
    }

    Zotero.Plugins.addObserver({
      shutdown: ({ id: pluginID }) => {
        console.log("Shutting down plugin");
        this.unregisterNotifier(notifierID);
        removeDomElement()
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


      const mainContainerDivs = doc.querySelectorAll(".main-container") as NodeListOf<HTMLElement>;
      console.log(mainContainerDivs)
    }

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
    const styles1 = ztoolkit.UI.createElement(doc, "link", {
      properties: {
        type: "text/css",
        rel: "stylesheet",
        href: `chrome://${config.addonRef}/content/aiMenu.css`,
      },
    });
    doc.documentElement.appendChild(styles);
    const styles2 = ztoolkit.UI.createElement(doc, "link", {
      properties: {
        type: "text/css",
        rel: "stylesheet",
        href: `chrome://${config.addonRef}/content/sideBarLlmAvator.css`,
      },
    });
    doc.documentElement.appendChild(styles);
    doc.documentElement.appendChild(styles1);
    doc.documentElement.appendChild(styles2);
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
        setEnabled(tabType === "reader");
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

      },
      // Optional, Called when the section data changes (setting item/mode/tabType/inTrash), must be synchronous. return false to cancel the change
      onItemChange: (props) => {
        console.log("props", props)
        const { item, setEnabled, tabType, body, doc } = props;
        ztoolkit.log(`Section item data changed to ${item?.id} `);

        // const aa = body.?.querySelectorAll(".zotero-view-item")
        const aa = body.parentElement?.parentElement?.parentElement
        console.log("aa", aa)
        // console.log("aa", aa)
        if (!aa) return
        setTimeout(() => {
          if (addon.data.kimiApi?.kimiMainContainerDiv) {
            console.log("addon.data.kimiApi$$$@@@@@@", addon.data.kimiApi)
            console.log("addon.data.kimiApi$$$@@@@@@", addon.data.kimiApi.kimiMainContainerDiv)
            console.log("body.children[0]", body.children[0])
            body.children[0].appendChild(addon.data.kimiApi.kimiMainContainerDiv as HTMLElement)
            const kimiMessageContainerDiv = body.querySelector(".kimi-chat-message-container-div")
            if (kimiMessageContainerDiv) {
              console.log("addon.data.kimiApi?.kimiMessageContainerDivScrollTop", addon.data.kimiApi?.kimiMessageContainerDivScrollTop)
              kimiMessageContainerDiv.scrollTop = addon.data.kimiApi?.kimiMessageContainerDivScrollTop || 0
            }
          }


          // setTimeout(() => {
          //   console.log(aa.scrollTop, aa.scrollHeight)
          //   aa.scrollTo({
          //     top: aa.scrollHeight, // 滚动到元素的底部
          //     behavior: 'smooth' // 平滑滚动
          //   });
          // }, 200)

        }, 100)

        const _aa = body.parentElement?.parentElement?.parentElement?.parentElement
        if (_aa) {
          const bb = _aa.querySelectorAll(".ai-sidebar-menu-folder-container")
          if (bb) {
            bb.forEach(item => {
              item.remove()
            })
          }
          if (!addon.data.kimiApi?.domElementStorageMap.aiSidebarMenuFolder) return
          _aa.insertBefore(addon.data.kimiApi?.domElementStorageMap.aiSidebarMenuFolder, _aa.firstChild)
        }

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
        console.log("Section rendered!", item?.id);
        if (!item?.id) {
          return
        }

        //获取html后续元素base宽高
        const { baseWidth, baseHeight } = getWindowSize()


        //获取主节点
        const mainNode = body.querySelector(`#test`) as HTMLElement;

        const aa = body.parentElement?.parentElement?.parentElement?.parentElement

        

        // aa?.appendChild(aiSideBarMenuFoler)


        function createNewChatCallBack(args: any) {
          console.log("copyMessageCallBack", args)
          if (args.isok) {
            setPref("chat_id", args.chatId)
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "创建新聊天成功!",
                type: "success",
                progress: 100,
              })
              .show();
          } else {
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "创建新聊天失败!",
                type: "error",
                progress: 100,
              })
              .show();
          }
        }

        function switchChatHistoryCallBack(args: any) {
          console.log("switchChatHistoryCallBack", args)
          if (args.isok) {
            setPref("chat_id", args.chatId)
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "切换聊天成功!",
                type: "success",
                progress: 100,
              })
              .show();
          } else {
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "切换聊天失败!",
                type: "error",
                progress: 100,
              })
              .show();
          }
        }

        function uploadFileCallBack(args: any) {
          console.log("copyMesuploadFileCallBacksageCallBack", args)
          if (args.isok) {
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "上传成功!",
                type: "success",
                progress: 100,
              })
              .show();
          } else {
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "上传失败!",
                type: "error",
                progress: 100,
              })
              .show();
          }
          // 将文件上传历史记录保存
          const fileUploadHistoryJson = addon.data.kimiApi?.fileHashMap || {};
          Zotero.File.putContentsAsync(fileUploadHistoryJsonPath, JSON.stringify(fileUploadHistoryJson))
          console.log("上传历史记录保存成功")
        }

        function copyMessageCallBack(args: any) {
          console.log("copyMessageCallBack", args)
          if (args.isok) {
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "复制成功!",
                type: "success",
                progress: 100,
              })
              .show();
          } else {
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "复制失败!",
                type: "error",
                progress: 100,
              })
              .show();
          }
        }

        function loginFinishCallBack(args: any) {
          console.log("loginFinishCallBack", args)
          if (args.isok) {
            setPref("refresh_token", args.refreshToken)
            setPref("access_token", args.accessToken)
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "登录成功!",
                type: "success",
                progress: 100,
              })
              .show();
          } else {
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "复制失败!",
                type: "error",
                progress: 100,
              })
              .show();
          }
        }

        function createNewNoteCallBack(args: any) {
          //新建note类型条目
          console.log("createNewNoteCallBack", args)
          var noteItem = new Zotero.Item("note");
          // noteItem.updateDisplayTitle()
          const parentID = getReaderParentId() as number
          console.log(`parentID: ${parentID}`)
          noteItem.libraryID = Zotero.Items.get(parentID).libraryID;
          console.log(`libraryID: ${noteItem.libraryID}`)
          noteItem.parentID = parentID;
          const res = noteItem.setNote(args.noteText)
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
        }

        function previewCallBackFunc(args: any) {
          console.log("previewCallBackFunc", args)
          if (args.isok) {
            new ztoolkit.Clipboard().addText(args.previewUrl).copy()
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "获取预览链接成功! 请打开浏览器预览",
                type: "success",
                progress: 100,
              })
              .show();
          } else {
            new ztoolkit.ProgressWindow(config.addonName, { closeTime: 2000 })
              .createLine({
                text: "获取预览链接失败!",
                type: "error",
                progress: 100,
              })
              .show();
          }
        }
        console.log("是否打开", item.id)
        console.log("addon.data.kimiApi@@", addon.data.kimiApi)
        if (addon.data.kimiApi?.kimiMainContainerDiv) {
          console.log("addon.data.kimiApi", addon.data.kimiApi)
          if (addon.data.kimiApi) {
            // if (addon.data.kimiApi.valueSotorageMap['isAppendedToMainNode'] == false) {
            //   mainNode.appendChild(addon.data.kimiApi.kimiMainContainerDiv as HTMLElement)
            // }
            // if (Zotero_Tabs) {
            //   mainNode.appendChild(addon.data.kimiApi.kimiMainContainerDiv as HTMLElement)
            // }
            console.log("Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item", Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item)
            if (Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item == item) {
              console.log("已经存在kimiapi")
              mainNode.appendChild(addon.data.kimiApi.kimiMainContainerDiv as HTMLElement)
            }

          }
          return
        }
        const doc = win.document


        const refreshToken = getPref("refresh_token") as string || ""
        const accessToken = getPref("access_token") as string || ""
        const chatId = getPref("chat_id") as string || ""

        const kimiApi = new KimiApi({
          chatId: chatId,
          accessToken: accessToken,
          refreshToken: refreshToken,
          maxRetry: 3,
          isRemoveSVGElements: true,
          isEnableFileHashMapSearch: true,
          cryptoJsUrl: `chrome://${config.addonRef}/content/crypto-js.min.js`,
          // fileHashMap: fileUploadHistoryJson,
          readFileFunc: (...a: any[]) => {
            return new Promise((resolve, reject) => {
              resolve(new Uint8Array(a))
            })
          },
          createNewChatCallBackFunc: createNewChatCallBack,
          switchChatHistoryFinishCallBackFunc: switchChatHistoryCallBack,
          uploadFileCallBackFunc: uploadFileCallBack,
          copyMessageCallBackFunc: copyMessageCallBack,
          createNewNoteCallBackFunc: createNewNoteCallBack,
          checkRfreshTokenFinishCallBackFunc: loginFinishCallBack,
          previewCallBackFunc: previewCallBackFunc
        })
        const cssConfigs = {
          "kimi-main-container-div": {
            "background-color": "#ca4444",
            "height": `${baseHeight}vh`
          },
          "user-input-text-area": {
            "background-color": "#ffffff",
            "border-radius": "10px",
            "height": "25px",
            "font-size": "17px",
            "padding": "2px"
          },
          "kimi-create-note-confirm-button": {
            "background-color": "#007bff !important",
            "color": "white!important"
          }
        }
        const kimiMainContainerDiv = kimiApi.kimiCreateMainUi({
          doc: doc, isRegisterListener: true, isAddCss: true,
          cssConfigs: cssConfigs,
          isObserveResize: true
        })
        // mainNode.appendChild(addon.data.kimiApi?.kimiMainContainerDiv as HTMLElement)
        mainNode.appendChild(kimiMainContainerDiv)
        console.log("加入到mainNode")
        kimiApi.kimiCheckRefreshToken().then(res => {
          console.log("aa", res)
        })
        kimiApi.kimiInitChatHistory()

        addon.data.kimiApi = kimiApi as KimiApi

        // mainNode.appendChild(addon.data.kimiApi.kimiMainContainerDiv as HTMLElement)
        addon.data.kimiApi.valueSotorageMap['isAppendedToMainNode'] = true
        // setTimeout(() => {
        //   if (addon.data.kimiApi) {
        //     addon.data.kimiApi.valueSotorageMap['isAppendedToMainNode'] = false
        //   }
        // }, 1000)

        // 异步加载fileUploadHistoryJson
        // const res = Zotero.File.getContentsAsync(fileUploadHistoryJsonPath) as Promise<string>
        // res.then((fileUploadHistoryJsonText) => {
        //   try {
        //     const fileUploadHistoryJson = JSON.parse(fileUploadHistoryJsonText)
        //     if (addon.data.kimiApi) {
        //       addon.data.kimiApi.fileHashMap = fileUploadHistoryJson
        //     }
        //   } catch (e: any) {
        //     console.log(e)
        //   }
        // })

        console.log("mainNode", mainNode)

        // aa?.appendChild(styles);
        if (!addon.data.kimiApi?.domElementStorageMap.aiSidebarMenuFolder &&
          addon.data.kimiApi
        ) {
          addon.data.kimiApi.domElementStorageMap.aiSidebarMenuFolder = createAiSideBarMenu()
          if (aa) {
            const bb = aa.querySelectorAll(".ai-sidebar-menu-folder-container")
            if (bb) {
              bb.forEach(item => {
                item.remove()
              })
            }
            aa.insertBefore(addon.data.kimiApi.domElementStorageMap.aiSidebarMenuFolder, aa.firstChild)
          }
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
        console.log("Section secondary render start!", item?.id);
        // await Zotero.Promise.delay(1000);
        console.log("Section secondary render finish!", item?.id);





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
          // icon: "chrome://zotero/skin/16/universal/empty-trash.svg",
          icon: `chrome://${config.addonRef}/content/icons/fresh.svg`,
          l10nID: getLocaleID("item-section-example2-button-tooltip"),
          onClick: ({ item, paneID }) => {
            ztoolkit.log("Section clicked!", item?.id);
            // Zotero.ItemPaneManager.unregisterSection(paneID);

            if(!addon.data.kimiApi){return}
            const { baseWidth, baseHeight } = getWindowSize() 
            const mainNode = addon.data.kimiApi.kimiMainContainerDiv?.parentElement as HTMLElement
            const cssConfigs = {
              "kimi-main-container-div": {
                "background-color": "#ca4444",
                "height": `${baseHeight}vh`
              },
              "user-input-text-area": {
                "background-color": "#ffffff",
                "border-radius": "10px",
                "height": "25px",
                "font-size": "17px",
                "padding": "2px"
              },
              "kimi-create-note-confirm-button": {
                "background-color": "#007bff !important",
                "color": "white!important"
              }
            }
            const kimiMainContainerDiv = addon.data.kimiApi.kimiCreateMainUi({
              doc: document, isRegisterListener: true, isAddCss: true,
              cssConfigs: cssConfigs,
              isObserveResize: true
            })
            // mainNode.appendChild(addon.data.kimiApi?.kimiMainContainerDiv as HTMLElement)
            mainNode.firstChild?.remove()
            mainNode.appendChild(kimiMainContainerDiv)
            console.log("加入到mainNode")
            
            addon.data.kimiApi.kimiInitChatHistory()

          },
        },
        // {
        //   type: "test",
        //   icon: "chrome://zotero/skin/16/universal/empty-trash.svg",
        //   l10nID: getLocaleID("item-section-example2-button-tooltip"),
        //   onClick: ({ item, paneID }) => {
        //     ztoolkit.log("Section clicked!", item?.id);
        //     Zotero.ItemPaneManager.unregisterSection(paneID);
        //   },
        // },
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
