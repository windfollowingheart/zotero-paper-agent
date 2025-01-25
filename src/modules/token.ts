import { getPref, setPref } from "../utils/prefs"
import { BASEURL } from '../utils/ip';
import { refreshAccessToken } from "../utils/kimi_api";
// async function getAccessToken() {
//     const url = `${BASEURL}/get_access_token/?userid=` + getPref("userid")
//     const getAccessTokenXHR = await Zotero.HTTP.request("GET", url)
//     const accessToken = JSON.parse(getAccessTokenXHR.responseText).access_token
//     setPref("access_token", accessToken)
//     // ztoolkit.getGlobal("console").log("access_token: " + getPref("access_token"))
//     // ztoolkit.getGlobal("alert")("access_token: " + getPref("access_token"))
// }

async function getAccessToken() {
    const res = await refreshAccessToken()

}

export {
    getAccessToken

}