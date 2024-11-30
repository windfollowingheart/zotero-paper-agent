import { getPref, setPref, clearPref } from "../utils/prefs"
import { MathMLToLaTeX } from 'mathml-to-latex'

async function setTabKeyAndPdfName() {
    //这里记录一下选中的tab的key和Pdf名称
    const { tabKey, pdfName } = getTabKeyAndPdfName()
    //设置到pref
    setPref("selected_tab_key", tabKey)
    setPref("selected_tab_pdf_name", pdfName)

}



function getTabKeyAndPdfName(): { tabKey: string, pdfName: string } {
    //这里记录一下选中的tab的key和Pdf名称
    const prefixToRemove = "storage:";
    const indexToRemove = prefixToRemove.length;
    // 使用slice方法去掉前面的字符
    const tabKey = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item.key
    const pdfName = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID)._item.attachmentPath.slice(indexToRemove);
    //设置到pref
    return { tabKey: tabKey, pdfName: pdfName }
}



function formatDateTime() {
    const date = new Date();
    const year = date.getFullYear(); // 获取年份
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，月份从0开始，所以加1
    const day = date.getDate().toString().padStart(2, '0'); // 获取日期
    const hours = date.getHours().toString().padStart(2, '0'); // 获取小时
    const minutes = date.getMinutes().toString().padStart(2, '0'); // 获取分钟
    const seconds = date.getSeconds().toString().padStart(2, '0'); // 获取秒

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 返回格式化的日期字符串
}


function mathMLtoLaTeX(mathml: string) {
    // 正则表达式匹配<math>标签及其内容
    const regex = /<math(.*?)<\/math>/gi;
    const mathContent = mathml.match(regex);
    if (mathContent) {
        // ztoolkit.getGlobal("alert")("匹配到了")
        for (let i = 0; i < mathContent.length; i++) {
            console.log(mathContent[i])
            const covertMd = MathMLToLaTeX.convert(mathContent[i]).replace(/\\/g, '\\')
            console.log(covertMd)


            if (mathContent[i].includes('display="block"')) {
                mathml = mathml.replace(mathContent[i], `<pre class="math">${covertMd}</pre>`);
            } else {
                // mathml = mathml.replace(mathContent[i], `<code>${covertMd}</code>`);
            }
        }

    }
    return mathml
}

export {
    formatDateTime,
    setTabKeyAndPdfName,
    getTabKeyAndPdfName,
    mathMLtoLaTeX
}