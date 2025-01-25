import * as QRCode from "qrcode"
import { checkLogin, getLoginId, refreshAccessToken } from "./kimi_api"
import { getPref } from "./prefs"



// 在软件开启时测试一下refresh_token
async function checkRefreshTokenAvailable() {
    if (getPref("refresh_token") === "") {
        // ztoolkit.getGlobal("alert")("需要登录1")
        await createLoginDiv()
        return
    }


    const res = await refreshAccessToken()
    if (res) {
        return
    } else {
        // ztoolkit.getGlobal("alert")("需要登录2")
        await createLoginDiv()
    }
    // 检查refresh_token是否过期
    // refreshAccessToken().then((res) => {
    //     if (res) {
    //         return
    //     } else {
    //         createLoginDiv()
    //     }
    // })
}


async function createLoginDiv() {
    const doc = ztoolkit.getGlobal("document")
    // const mainContainer = doc.querySelector(".main-container")

    //获取一个login_id
    const login_id = await getLoginId()
    if (!login_id) {
        return
    }

    const qrMaskDiv = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",

            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "999",
            // display: "none"
        },
        classList: ["qrcode-mask-div"]
    })


    const cnavasDiv = genQRCode(login_id)
    qrMaskDiv.append(cnavasDiv)
    // if (mainContainer) {
    //     mainContainer.append(qrMaskDiv)
    // } else {
    doc.documentElement.append(qrMaskDiv)
    qrMaskDiv.style.display = "none"
    // }


    //检查是否成功登录
    const intervalID = setInterval((e) => {
        checkLogin(login_id, intervalID)
    }, 1000)

}


function genQRCode(login_id: string): HTMLDivElement {
    const doc = ztoolkit.getGlobal("document")
    const canvasDiv = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "200px",
            height: "200px",
        },
        children: [
            {
                tag: "div",
                styles: {
                    fontSize: "14px",
                    color: "#fff",
                    textAlign: "center",
                    margin: "10px 0"
                },
                classList: ["qrcode-text-tooltip"]

            }
        ],
        classList: ["qrcode-div"]
    })

    const tooltipText = canvasDiv.querySelector(".qrcode-text-tooltip") as HTMLDivElement
    tooltipText.textContent = "请使用微信扫描二维码登录"


    const canvas = ztoolkit.UI.createElement(doc, "canvas", {
        namespace: "html",
        styles: {
            width: "100px",
            height: "100px",
            margin: "0 auto",
            // position: "absolute",
            // left: "50%",
            // top: "50%",
            // transform: "translate(-50%, -50%)"
        },
        classList: ["qrcode-canvas"],
    })
    doc.documentElement.append(canvas)
    Zotero.Promise.delay(200).then(() => {
        const text = `https://kimi.moonshot.cn/wechat/mp/auth?id=${login_id}&device_id=None`
        QRCode.toCanvas(doc.querySelector(".qrcode-canvas"), text, {
            width: 100,
            margin: 0
        });
    })
    canvasDiv.insertBefore(canvas, tooltipText)
    return canvasDiv

}


export {
    genQRCode,
    createLoginDiv,
    checkRefreshTokenAvailable,
}