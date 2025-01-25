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

function refineResponseText(text: string) {
    const textReplaceArr = ['&amp;']
    for (let i = 0; i < textReplaceArr.length; i++) {
        const element = textReplaceArr[i];
        text = text.replace(new RegExp(element, 'g'), '&')
    }
    return text
}


function mathMLtoLaTeX1(mathml: string) {
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
                mathml = refineResponseText(mathml)
            } else {
                // mathml = mathml.replace(mathContent[i], `<code>${covertMd}</code>`);
            }
        }

    }
    return mathml
}

function mathMLtoLaTeX(mathml: string, originalText: string) {
    // 正则表达式匹配<math>标签及其内容
    // const regex = /```([\s\S].*?)\$\$(.*?)\$\$([\s\S].*?)```/gi;
    const regexHtml = /<math(.*?)<\/math>/gi;
    // const regexOriginalText = /[^\`]\$\$(.*?)\$\$[^\`]/gi;
    const regexOriginalText = /\$\$(.*?)\$\$/gi;
    originalText = originalText.replace(/\n/g, '')
    const mathHtmlContent = mathml.match(regexHtml);
    const regexOriginalTextContent = originalText.match(regexOriginalText);
    console.log("originalText", originalText)
    console.log("mathHtmlContent", mathHtmlContent)
    console.log("regexOriginalTextContent", regexOriginalTextContent)
    if (mathHtmlContent?.length !== regexOriginalTextContent?.length) {
        ztoolkit.getGlobal("alert")(`匹配到的数量不一致 ${mathHtmlContent?.length} ${regexOriginalTextContent?.length}`)
        return mathml
    }
    if (mathHtmlContent && regexOriginalTextContent) {
        // ztoolkit.getGlobal("alert")("匹配到了")
        for (let i = 0; i < mathHtmlContent.length; i++) {

            console.log("mathContent[i]", mathHtmlContent[i])
            // const mathcode = mathContent[i].replace(/\$\$/g, '')

            if (mathHtmlContent[i].includes('display="block"')) {
                const _regexOriginalTextContent = regexOriginalTextContent[i].match(/\$\$(.*?)\$\$/gi)
                console.log("_regexOriginalTextContent", _regexOriginalTextContent)

                if (_regexOriginalTextContent) {
                    const _regexOriginalTextContent_1 = _regexOriginalTextContent[0].replace(/\$\$/g, '')
                    console.log("_regexOriginalTextContent_1", _regexOriginalTextContent_1)
                    mathml = mathml.replace(mathHtmlContent[i], `<pre class="math">${_regexOriginalTextContent_1}</pre>`);
                    mathml = refineResponseText(mathml)
                }

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