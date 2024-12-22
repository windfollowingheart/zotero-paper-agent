import { config } from "../../package.json"
import { getTabPdfPath } from "../utils/file";
import { getPref, setPref } from "../utils/prefs";
import { queryFileId } from "../utils/sqlite";
import { getTabKeyAndPdfName } from "../utils/util";
import { createUploadFileComp, tabPdfUpload } from "./file";
import { ICONS } from "./svg";

export async function initReaderMenu() {

    Zotero.Reader.registerEventListener(
        "renderToolbar",
        readerToolbarCallback,
        config.addonID,
    );

    Zotero.Reader._readers.forEach(buildReaderMenuButton);
}


async function buildReaderMenuButton(reader: _ZoteroTypes.ReaderInstance) {
    await reader._initPromise;
    const customSections = reader._iframeWindow?.document.querySelector(
        ".toolbar .custom-sections",
        // ".toolbar .center",
    );
    if (!customSections) {
        return;
    }
    const append = (...args: (string | Node)[]) => {
        customSections.append(
            ...Components.utils.cloneInto(args, reader._iframeWindow, {
                wrapReflectors: true,
                cloneFunctions: true,
            }),
        );
    };

    readerToolbarCallback({
        append,
        reader,
        doc: customSections.ownerDocument,
        type: "renderToolbar",
        params: {},
    });
}


async function readerToolbarCallback(
    event: Parameters<_ZoteroTypes.Reader.EventHandler<"renderToolbar">>[0],
) {

    const { append, doc, reader } = event;
    // console.log("doc@@", doc)
    // console.log("doc@@1", doc.documentElement.outerHTML)
    // getReaderMenuPopup(reader);
    const button = ztoolkit.UI.createElement(doc, "button", {
        namespace: "html",
        classList: [
            "toolbar-button",
            "toolbar-dropdown-button",
            `${config.addonRef}-reader-button`,
        ],
        properties: {
            tabIndex: -1,
            title: "打开菜单栏",
        },
        listeners: [
            {
                type: "click",
                listener: async (ev: Event) => {

                    const aiSideBarContainerDivs = document.querySelectorAll(".ai-sidebar-menu-container-div") as NodeListOf<HTMLDivElement>
                    console.log("aiSideBarContainerDiv", aiSideBarContainerDivs)
                    if (aiSideBarContainerDivs) {
                        aiSideBarContainerDivs.forEach(item => {
                            item.classList.toggle("ai-sidebar-menu-container-div-show")
                        })
                    }
                },
            },
        ],
    });


    // const buttonIcon = await getIcon(`chrome://${config.addonRef}/content/icons/send.svg`)
    const iconImg = ztoolkit.UI.createElement(doc, "img", {
        properties: {
            src: `chrome://${config.addonRef}/content/icons/send.svg`,
        },
    })
    // button.append(iconImg);
    button.innerHTML = `${ICONS.aiICON}`
    append(button);

    // //找到中间菜单栏
    // const centerDiv = doc.querySelector(".center") as HTMLDivElement

    // button.innerHTML = `${ICONS.sendICON}`;
    // // append(button);
    // if (centerDiv) {
    //     centerDiv.append(button)
    // }
}

