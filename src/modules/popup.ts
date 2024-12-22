import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { getPref, setPref } from "../utils/prefs";
import { createSubspendButton } from "../utils/subspend";



export function buildReaderPopup(
  event: _ZoteroTypes.Reader.EventParams<"renderTextSelectionPopup">,
  text: string,
  aiButtionContainer: HTMLDivElement
) {
  const { reader, doc, append } = event;
  const annotation = event.params.annotation;
  const popup = doc.querySelector(".selection-popup") as HTMLDivElement;
  


  popup.append(
    // ztoolkit.UI.createElement(doc, "div", {

    //   properties: {
    //     innerHTML: "<div>hello</div>"
    //   }
    // }),
    aiButtionContainer
  );
}







