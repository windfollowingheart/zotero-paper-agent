import { read } from "fs";
import { config } from "../../package.json";
import { getPref, setPref } from "../utils/prefs";
import { getTabKeyAndPdfName } from "../utils/util";
// import { onReaderPopupShow } from "../hooks";
import { buildReaderPopup } from "./popup";
import { createSubspendButton } from "../utils/subspend";


export function registerReaderInitializer() {
  Zotero.Reader.registerEventListener(
    "renderTextSelectionPopup",
    (event) => {

      const { reader, doc, params, append } = event;
      //清楚之前的subspend
      const doc1 = ztoolkit.getGlobal("document")
      const sendButton = doc1.querySelector(".send_button") as HTMLDivElement
      const selectFileButton = doc1.querySelector(".select-file-button") as HTMLDivElement
      const chatFrame = doc1.querySelector(".chat-frame") as HTMLDivElement
      const displayFileFrame = doc1.querySelector(".display-file-frame") as HTMLDivElement



      const text = params.annotation.text.trim();
      const aiButtionContainer = createSubspendButton(doc, text, sendButton, selectFileButton, displayFileFrame, chatFrame)

      buildReaderPopup(event, text, aiButtionContainer)






    },
    config.addonID,
  );


}
