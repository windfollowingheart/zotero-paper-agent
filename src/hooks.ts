import {
  BasicExampleFactory,
  HelperExampleFactory,
  KeyExampleFactory,
  PromptExampleFactory,
  UIExampleFactory,
} from "./modules/examples";
import { config } from "../package.json";
import { getString, initLocale } from "./utils/locale";
import { registerPrefsScripts } from "./modules/preferenceScript";
import { createZToolkit } from "./utils/ztoolkit";
import { registerReaderInitializer } from "./modules/reader";
import { getTabKeyAndPdfName } from "./utils/util";
import { checkRefreshTokenAvailable } from "./utils/token";
import { syncSqliteWebDav } from "./utils/sqlite";
import { registerPrompt } from "./modules/prompt";
import { buildReaderPopup } from "./modules/popup";
import { initReaderMenu } from "./modules/toolbar";

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);

  initLocale();

  registerReaderInitializer();

  BasicExampleFactory.registerPrefs();

  BasicExampleFactory.registerNotifier();

  // KeyExampleFactory.registerShortcuts();

  await UIExampleFactory.registerExtraColumn();

  await UIExampleFactory.registerExtraColumnWithCustomCell();

  initReaderMenu()

  // UIExampleFactory.registerTestTab();
  // UIExampleFactory.registerItemPaneSection();

  // UIExampleFactory.registerReaderItemPaneSection();

  await Promise.all(
    Zotero.getMainWindows().map((win) => onMainWindowLoad(win)),
  );
}

async function onMainWindowLoad(win: Window): Promise<void> {
  // Create ztoolkit for every window
  addon.data.ztoolkit = createZToolkit();

  // @ts-ignore This is a moz feature
  win.MozXULElement.insertFTLIfNeeded(`${config.addonRef}-mainWindow.ftl`);

  // const popupWin = new ztoolkit.ProgressWindow(config.addonName, {
  //   closeOnClick: true,
  //   closeTime: -1,
  // })
  //   .createLine({
  //     text: getString("startup-begin"),
  //     type: "default",
  //     progress: 0,
  //   })
  //   .show();

  // await Zotero.Promise.delay(1000);
  // popupWin.changeLine({
  //   progress: 30,
  //   text: `[30%] ${getString("startup-begin")}`,
  // });

  //开局先检查一下refresh_token有效性
  await checkRefreshTokenAvailable()

  UIExampleFactory.registerStyleSheet(win);

  UIExampleFactory.registerRightClickMenuItem();

  UIExampleFactory.registerRightClickMenuPopup(win);

  UIExampleFactory.registerWindowMenuWithSeparator();

  PromptExampleFactory.registerNormalCommandExample();

  PromptExampleFactory.registerAnonymousCommandExample(win);

  PromptExampleFactory.registerConditionalCommandExample();
  UIExampleFactory.registerReaderItemPaneSection(win);

  registerPrompt()

  //暂停1s后进行sqlite同步
  await Zotero.Promise.delay(1000);
  syncSqliteWebDav()

  // popupWin.changeLine({
  //   progress: 100,
  //   text: `[100%] ${getString("startup-finish")}`,
  // });
  // popupWin.startCloseTimer(5000);

  // checkRefreshTokenAvailable()

  // addon.hooks.onDialogEvents("dialogExample");
}

// export function onReaderPopupShow(
//   event: _ZoteroTypes.Reader.EventParams<"renderTextSelectionPopup">,
// ) {


// }

async function onMainWindowUnload(win: Window): Promise<void> {
  // ztoolkit.getGlobal("alert")("ss11")
  // console.log("onShutdown11")
  // Zotero.Sync.Runner.sync()

  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
}


//关闭应用程序时执行
function onShutdown(): void {
  // ztoolkit.getGlobal("alert")("ss")
  // console.log("onShutdown")


  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
  // Remove addon object
  addon.data.alive = false;
  delete Zotero[config.addonInstance];
  // ztoolkit.getGlobal("alert")("ss")
}

/**
 * This function is just an example of dispatcher for Notify events.
 * Any operations should be placed in a function to keep this funcion clear.
 */
async function onNotify(
  event: string,
  type: string,
  ids: Array<string | number>,
  extraData: { [key: string]: any },
) {
  // You can add your code to the corresponding notify type
  ztoolkit.log("notify", event, type, ids, extraData);
  if (
    event == "select" &&
    type == "tab" &&
    extraData[ids[0]].type == "reader"
  ) {
    BasicExampleFactory.exampleNotifierCallback();
  }
  else if (
    event == "close" &&
    type == "tab" &&
    ids.length == 1
  ) {


    // const doc = ztoolkit.getGlobal("document")
    // const mainNodes = doc.querySelectorAll(`#test`)
    // // const mainNode = doc1.querySelector(`#test`)
    // // ztoolkit.getGlobal("console").log(mainNode)
    // ztoolkit.getGlobal("console").log(mainNodes)
    // let mainNode: any
    // mainNodes.forEach((_mainNode: any) => {

    //   if (_mainNode.offsetParent) {
    //     const item_key = _mainNode.offsetParent.children[0]._item._bestAttachmentState.key
    //     if (item_key === getTabKeyAndPdfName().tabKey) {
    //       mainNode = _mainNode
    //       return
    //     }
    //   } else {
    //     _mainNode.remove()
    //   }

    // })

    // const doc1 = ztoolkit.getGlobal("document")
    // //关闭了一个tab要将它的reader mainNode给删除
    // const mainNodes = doc1.querySelectorAll(`#test`)
    // const mainContainerDivs = doc1.querySelectorAll(".main-container") as NodeListOf<HTMLElement>;
    // console.log(mainContainerDivs)
    // // const tabKey = Zotero.Reader.getByTabID(ids[0].toString())._item.key
    // mainNodes.forEach((_mainNode: any) => {
    //   const mainContainerDiv = _mainNode.querySelector(".main-container") as HTMLElement
    //   console.log("ddiv", mainContainerDiv)
    //   // const item_key = _mainNode.offsetParent.children[0]._item._bestAttachmentState.key
    //   // if (item_key === tabKey) {
    //   //   _mainNode.remove()
    //   // }
    // })
    // console.log("hello111", doc1.querySelectorAll(`#test`))

    // function appendNewMainNode() {
    //   const doc = ztoolkit.getGlobal("document")
    //   const mainNodes = doc.querySelectorAll(`#test`)
    //   // const mainNode = doc1.querySelector(`#test`)
    //   // ztoolkit.getGlobal("console").log(mainNode)
    //   ztoolkit.getGlobal("console").log(mainNodes)
    //   let mainNode: any
    //   mainNodes.forEach((_mainNode: any) => {

    //     if (_mainNode.offsetParent) {
    //       const item_key = _mainNode.offsetParent.children[0]._item._bestAttachmentState.key
    //       if (item_key === getTabKeyAndPdfName().tabKey) {
    //         mainNode = _mainNode
    //         return
    //       }
    //     } else {
    //       _mainNode.remove()
    //     }

    //   })

    //   const ResizeObserver = ztoolkit.getGlobal("ResizeObserver")

    //   //直接查询一下是否有mainContainer,如何有，就添加到mainNode中,没有再新建
    //   const mainContainerDiv = doc.querySelector(".main-container") as HTMLElement
    //   if (mainContainerDiv) {
    //     mainNode.append(mainContainerDiv)
    //     const graphContainerDiv = doc.getElementById("graph-view") as HTMLElement
    //     const resizeObserver = new ResizeObserver(entries => {
    //       for (let entry of entries) {
    //         const { width, height } = entry.contentRect;
    //         ztoolkit.log('Element size changed to:', width, height);
    //         ztoolkit.log(mainNode.offsetWidth, mainNode.offsetHeight);
    //         graphContainerDiv.style.width = `${width * 0.9 - 0.03 * ztoolkit.getGlobal("window").innerWidth}px`
    //         mainContainerDiv.style.width = `${width * 0.9}px`
    //       }
    //     });
    //     // 观察特定的元素
    //     resizeObserver.observe(mainNode);
    //   }
    // }
  }
  else {
    return;
  }
}

/**
 * This function is just an example of dispatcher for Preference UI events.
 * Any operations should be placed in a function to keep this funcion clear.
 * @param type event type
 * @param data event data
 */
async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  switch (type) {
    case "load":
      // console.log("ooooooooooooo", data.window.querySelector(".menulist-api"))
      registerPrefsScripts(data.window);
      break;
    default:
      return;
  }
}

function onShortcuts(type: string) {
  switch (type) {
    case "larger":
      KeyExampleFactory.exampleShortcutLargerCallback();
      break;
    case "smaller":
      KeyExampleFactory.exampleShortcutSmallerCallback();
      break;
    default:
      break;
  }
}

function onDialogEvents(type: string) {
  switch (type) {
    case "dialogExample":
      HelperExampleFactory.dialogExample();
      break;
    case "clipboardExample":
      HelperExampleFactory.clipboardExample();
      break;
    case "filePickerExample":
      HelperExampleFactory.filePickerExample();
      break;
    case "progressWindowExample":
      HelperExampleFactory.progressWindowExample();
      break;
    case "vtableExample":
      HelperExampleFactory.vtableExample();
      break;
    default:
      break;
  }
  ztoolkit.log("dialog", type);
  // ztoolkit.getGlobal("alert")("hello");
  ztoolkit.log("hello121321")

}

// Add your hooks here. For element click, etc.
// Keep in mind hooks only do dispatch. Don't add code that does real jobs in hooks.
// Otherwise the code would be hard to read and maintain.

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onNotify,
  onPrefsEvent,
  onShortcuts,
  onDialogEvents,
};
