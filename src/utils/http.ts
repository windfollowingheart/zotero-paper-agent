import { getPref, setPref } from "../utils/prefs"
function sendUint8ArrayFile(file: Uint8Array, url: string, method: string, headers: { [key: string]: string }): Promise<string> {
    return new Promise((resolve, reject) => {
        ztoolkit.log(`file的类型: ${typeof file}`)
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        for (let key in headers) {
            xhr.setRequestHeader(key, headers[key])
        }
        ztoolkit.log(xhr)
        xhr.onload = function (e) {
            ztoolkit.log(`xhr状态: ${xhr.status}`)
            if (xhr.status === 200) {
                resolve((xhr.responseText));
            } else {
                resolve("")
            }
        };
        xhr.onerror = function (e) {
            ztoolkit.log("hello: " + JSON.stringify(e));
        };
        xhr.send(file);
    });
}

function getStreamChat(file: Uint8Array, url: string, method: string, headers: { [key: string]: string }): Promise<string> {
    return new Promise((resolve, reject) => {
        ztoolkit.log(`file的类型: ${typeof file}`)
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        for (let key in headers) {
            xhr.setRequestHeader(key, headers[key])
        }
        ztoolkit.log(xhr)
        xhr.onload = function (e) {
            ztoolkit.log(`xhr状态: ${xhr.status}`)
            if (xhr.status === 200) {
                resolve((xhr.responseText));
            } else {
                resolve("")
            }
        };
        xhr.onerror = function (e) {
            ztoolkit.log("hello: " + JSON.stringify(e));
        };
        xhr.send(file);
    });
}





// 抽象出统一接口发送kimi请求
async function getKimi(url: string, method: string, body: { [key: string]: any }, headers: { [key: string]: any }): Promise<{}> {
    // const url = "https://kimi.moonshot.cn/api/file"
    const accessToken = getPref("access_token")
    // ztoolkit.getGlobal("alert")(accessToken)
    headers['Authorization'] = `Bearer ${accessToken}`
    try {
        const XHR = await Zotero.HTTP.request(method, url, {
            body: JSON.stringify(body),
            headers: headers
        })
        const result = JSON.parse(XHR.responseText)
        // ztoolkit.getGlobal("alert")(JSON.stringify(result))
        return result

    } catch (e: any) {
        if (e.toString().includes("过期") || e.toString().includes("重新登录")
            || e.toString().includes("授权不存在") || e.toString().includes("auth.token.invalid")) {
            // 尝试获取新的access_token
            return { "error": "access_token过期" }
        } else {
            return { "error": "其他错误" }
        }
    }
}

export {
    sendUint8ArrayFile,
    getKimi
}