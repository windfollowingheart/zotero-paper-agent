import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { getPref, setPref } from "../utils/prefs";

export async function registerPrefsScripts(_window: Window) {
  // This function is called when the prefs window is opened
  // See addon/chrome/content/preferences.xul onpaneload

  if (!addon.data.prefs) {
    console.log("执行第1个")
    addon.data.prefs = {
      window: _window,
      columns: [

      ],
      rows: [

      ],
    };
  } else {
    console.log("执行第2个")
    addon.data.prefs.window = _window;
  }

  const useEmbeddingCheckBox = addon.data.prefs.window.document.querySelector("#enable-custom-embeddings") as XUL.Checkbox;
  const embeddingSettings = addon.data.prefs.window.document.querySelector("#embeddings-settings") as XUL.GroupBox
  const testApiButton = addon.data.prefs.window.document.querySelector("#test-connectivity") as XUL.Button
  if (getPref("embeddings.enable")) {
    console.log("11")
    embeddingSettings.style.display = ""
  } else {
    console.log("22")
    embeddingSettings.style.display = "none"
  }
  useEmbeddingCheckBox.addEventListener("command", async (e) => {
    console.log(useEmbeddingCheckBox.checked)
    if (useEmbeddingCheckBox.checked) {
      embeddingSettings.style.display = ""
      setPref("embeddings.enable", true)
    } else {
      embeddingSettings.style.display = "none"
      setPref("embeddings.enable", false)
    }
  })

  testApiButton.addEventListener("click", () => {
    new ztoolkit.Dialog(1, 1).addCell(0, 0, {
      tag: "div",
      styles: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "white",
      },
    }).open("连接测试", {
      width: 300,
      height: 200,
      centerscreen: true,
      resizable: false
    })
  })


  updatePrefsUI();
  bindPrefEvents();
}

async function updatePrefsUI() {
  // You can initialize some UI elements on prefs window
  // with addon.data.prefs.window.document
  // Or bind some events to the elements
  const renderLock = ztoolkit.getGlobal("Zotero").Promise.defer();
  if (addon.data.prefs?.window == undefined) return;
  const tableHelper = new ztoolkit.VirtualizedTable(addon.data.prefs?.window)
    .setContainerId(`${config.addonRef}-table-container`)
    .setProp({
      id: `${config.addonRef}-prefs-table`,
      // Do not use setLocale, as it modifies the Zotero.Intl.strings
      // Set locales directly to columns
      columns: addon.data.prefs?.columns,
      showHeader: true,
      multiSelect: true,
      staticColumns: true,
      disableFontSizeScaling: true,
    })
    .setProp("getRowCount", () => addon.data.prefs?.rows.length || 0)
    .setProp(
      "getRowData",
      (index) =>
        addon.data.prefs?.rows[index] || {
          title: "no data",
          detail: "no data",
        },
    )
    // Show a progress window when selection changes
    .setProp("onSelectionChange", (selection) => {
      new ztoolkit.ProgressWindow(config.addonName)
        .createLine({
          text: `Selected line: ${addon.data.prefs?.rows
            .filter((v, i) => selection.isSelected(i))
            .map((row) => row.title)
            .join(",")}`,
          progress: 100,
        })
        .show();
    })
    // When pressing delete, delete selected line and refresh table.
    // Returning false to prevent default event.
    .setProp("onKeyDown", (event: KeyboardEvent) => {
      if (event.key == "Delete" || (Zotero.isMac && event.key == "Backspace")) {
        addon.data.prefs!.rows =
          addon.data.prefs?.rows.filter(
            (v, i) => !tableHelper.treeInstance.selection.isSelected(i),
          ) || [];
        tableHelper.render();
        return false;
      }
      return true;
    })
    // For find-as-you-type
    .setProp(
      "getRowString",
      (index) => addon.data.prefs?.rows[index].title || "",
    )
    // Render the table.
    .render(-1, () => {
      renderLock.resolve();
    });
  await renderLock.promise;
  ztoolkit.log("Preference table rendered!");
}

function bindPrefEvents() {
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-enable`,
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      addon.data.prefs!.window.alert(
        `Successfully changed to ${(e.target as XUL.Checkbox).checked}!`,
      );
    });

  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-input`,
    )
    ?.addEventListener("change", (e) => {
      ztoolkit.log(e);
      addon.data.prefs!.window.alert(
        `Successfully changed to ${(e.target as HTMLInputElement).value}!`,
      );
    });
}
