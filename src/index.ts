import { BasicTool } from "zotero-plugin-toolkit";
import Addon from "./addon";
import { config } from "../package.json";

const basicTool = new BasicTool();

if (!basicTool.getGlobal("Zotero")[config.addonInstance]) {
  _globalThis.addon = new Addon();
  _globalThis.Zotero_Tabs = basicTool.getGlobal("Zotero_Tabs");
  _globalThis.console = basicTool.getGlobal("console");
  _globalThis.Zotero = basicTool.getGlobal("Zotero");
  // _globalThis.Zotero.DBConnection = basicTool.getGlobal("Zotero.DBConnection");
  // _globalThis.Zotero.DBConnection = basicTool.getGlobal("Zotero.DBConnection");
  defineGlobal("window");
  defineGlobal("ZoteroPane");
  defineGlobal("document");
  defineGlobal("AbortController");
  defineGlobal("ztoolkit", () => {
    return _globalThis.addon.data.ztoolkit;
  });

  Zotero[config.addonInstance] = addon;
}



function defineGlobal(name: Parameters<BasicTool["getGlobal"]>[0]): void;
function defineGlobal(name: string, getter: () => any): void;
function defineGlobal(name: string, getter?: () => any) {
  Object.defineProperty(_globalThis, name, {
    get() {
      return getter ? getter() : basicTool.getGlobal(name);
      // return basicTool.getGlobal(name);
    },
  });
}


