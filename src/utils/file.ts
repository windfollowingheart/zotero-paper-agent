import { getPref, setPref } from "../utils/prefs"
import { getTabKeyAndPdfName } from "./util";

function getTabPdfPath(): string {
    const dataDir = Zotero.DataDirectory.dir
    // const pdfPath = joinPath(dataDir, "storage", getPref("selected_tab_pdf_name")?.toString() || "")
    const pdfPath = dataDir + "\\\\storage\\\\" + getTabKeyAndPdfName().tabKey + "\\\\" + getTabKeyAndPdfName().pdfName
    return pdfPath
}


function joinPath(...parts: string[]) {
    return parts.join('/').replace(/\/+/g, '/').replace(/^(.+):\/?/, '$1/').replace(/\/(\.\.?\/)+/g, (match, p) => {
        let ret = p;
        const segments = parts.slice(0, -1);
        segments.pop();
        while (ret.startsWith('../')) {
            segments.pop();
            ret = ret.slice(3);
        }

        return ret;
    });
}

export {
    getTabPdfPath
}
