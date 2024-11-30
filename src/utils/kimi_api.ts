import { getPref, setPref } from "./prefs"

let HEADERS = {
    "Host": "kimi.moonshot.cn",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    "X-MSH-Session-ID": "None",
    "sec-ch-ua-platform": "Windows",
    "x-msh-platform": "web",
    "X-MSH-Device-ID": "None",
    "R-Timezone": "None",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
    "Content-Type": "application/json",
}



async function getLoginId(): Promise<string> {
    const url = "https://kimi.moonshot.cn/api/user/wx/register_login"
    const headers = HEADERS
    const xhr = await Zotero.HTTP.request("POST", url, { headers })
    if (xhr.status == 200) {
        const res = JSON.parse(xhr.responseText)
        return res.id
    } else {
        return ""
    }

}

//检查是否登录
async function checkLogin(login_id: string, intervalID: number) {
    const url = `https://kimi.moonshot.cn/api/user/wx/register_login/${login_id}`
    const headers = HEADERS

    const xhr = await Zotero.HTTP.request("GET", url, { headers })

    if (xhr.status == 200) {
        const res = JSON.parse(xhr.responseText)
        console.log(res)
        if (res.status == "login") {
            clearInterval(intervalID)
            setPref("access_token", res.access_token)
            setPref("refresh_token", res.refresh_token)

            //然后消除mask
            const doc = ztoolkit.getGlobal("document")
            const qrMaskDiv = doc.querySelector(".qrcode-mask-div")
            qrMaskDiv?.remove()

            new ztoolkit.ProgressWindow("Kimi", { closeTime: 2000 }).createLine({
                text: "登录成功!",
                type: "success",
                progress: 100,
            }).show()
        }
    }
}


//刷新token
async function refreshAccessToken(): Promise<boolean> {
    const refresh_token = getPref("refresh_token")
    const url = "https://kimi.moonshot.cn/api/auth/token/refresh"
    let headers = HEADERS as any
    headers["Authorization"] = `Bearer ${refresh_token}`

    const xhr = await Zotero.HTTP.request("GET", url, { headers })
    if (xhr.status == 200) {
        const res = JSON.parse(xhr.responseText)
        setPref("access_token", res.access_token)
        setPref("refresh_token", res.refresh_token)
        return true
    } else {
        return false
    }
}



export {
    getLoginId,
    checkLogin,
    refreshAccessToken,
}