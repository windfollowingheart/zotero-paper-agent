import { getKimi } from "../utils/http"
import { getAccessToken } from "./token"


async function getChatHistory(chat_id: string): Promise<any[]> {
    const maxRetryCount = 3
    const url = `https://kimi.moonshot.cn/api/chat/${chat_id}/segment/scroll`
    const body = {
        last: 999
    }
    const url_file = `https://kimi.moonshot.cn/api/chat/${chat_id}/segment/files`

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer {}`,
        "Host": "kimi.moonshot.cn",
    }
    for (let i = 0; i < maxRetryCount; i++) {
        let result: any = await getKimi(url, "POST", body, headers)
        if (result.total === 0) {
            new ztoolkit.ProgressWindow("查询聊天历史记录", { closeTime: 1000 })
                .createLine({
                    text: "当前聊天没有历史记录!",
                    type: "success",
                    progress: 100,
                })
                .show();
            return []
        }
        let file_refs: any = await getKimi(url_file, "POST", {}, headers)
        file_refs = file_refs.items
        if ("error" in result) {
            if (result.error === "其他错误") {

            } else {
                await getAccessToken()
            }
        } else {

            new ztoolkit.ProgressWindow("查询聊天历史记录", { closeTime: 1000 })
                .createLine({
                    text: "成功获取历史记录!",
                    type: "success",
                    progress: 100,
                })
                .show();
            result = result.items.map((item1: any) => {
                if ("error" in item1) {
                    return {
                        role: item1.role,
                        content: "token超限制,请开启新聊天",
                        file_refs: []
                    }
                }
                if (item1.file_refs) {
                    item1.file_refs = item1.file_refs.map((item2: any) => {
                        return file_refs.find((item3: any) => item3.id === item2)
                    })
                }
                return {
                    role: item1.role,
                    content: item1.content,
                    file_refs: item1.file_refs
                }
            })
            return result
        }
    }

    return []
}

export {
    getChatHistory,
}