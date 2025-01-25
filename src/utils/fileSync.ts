import { sendUint8ArrayFile } from "./http"

let isSync = true
export const fileUploadHistoryJsonName = "zotero_paper_agent_file_upload_history.json"
export const fileUploadHistoryJsonNameTemp = "zotero_paper_agent_file_upload_history_tmp.json"
export const dataDir = Zotero.DataDirectory.dir
export const fileUploadHistoryJsonPath = dataDir + "\\\\storage\\\\" + fileUploadHistoryJsonName
export const fileUploadHistoryJsonPathTemp = dataDir + "\\\\storage\\\\" + fileUploadHistoryJsonNameTemp
let url = ""

async function createFileHistoryJson() {
    //检查sqlite文件是否存在
    if (await IOUtils.exists(fileUploadHistoryJsonPath)) {
        return
        // await IOUtils.remove(fileHistoryJsonPath)
    }

    //如果不存在就创建一个
    const content = "{}"
    await Zotero.File.putContentsAsync(fileUploadHistoryJsonPath, content)
}

//同步文件上传历史记录到webdav
async function syncFileHistoryJsonToWebDav() {
    try {
        url = Zotero.Sync.Storage.Mode.WebDAV.prototype.rootURI.displaySpec + fileUploadHistoryJsonName
    } catch (e) {
        isSync = false
    }
    if (!isSync) {
        ztoolkit.getGlobal("alert")("未设置webdav,将无法同步本地文件, 不影响使用。如需同步, 请设置webdav")
        createFileHistoryJson()
        return
    }



    if (await IOUtils.exists(fileUploadHistoryJsonPathTemp)) {
        IOUtils.remove(fileUploadHistoryJsonPathTemp)
    }

    Zotero.HTTP.request("GET", url, {
        responseType: "arraybuffer",
        errorDelayMax: 0,
        requestObserver: (xhr: XMLHttpRequest) => {
            xhr.onload = async (e) => {
                if (xhr.status === 200) {

                    const uint8Array = new Uint8Array(xhr.response);
                    if (! await IOUtils.exists(fileUploadHistoryJsonPath)) {
                        IOUtils.write(fileUploadHistoryJsonPath, uint8Array)
                        return
                    }

                    //如果存在就要整合
                    IOUtils.write(fileUploadHistoryJsonPathTemp, uint8Array).then(async (e) => {
                        // 然后整合新老数据
                        const oldFileHistoryJson = JSON.parse(await Zotero.File.getContentsAsync(fileUploadHistoryJsonPath) as string)
                        const newFileHistoryJson = JSON.parse(await Zotero.File.getContentsAsync(fileUploadHistoryJsonPathTemp) as string)
                        const integreatedFileHistoryJson = {
                            ...oldFileHistoryJson,
                            ...newFileHistoryJson
                        }
                        // 写入整合后文件
                        await Zotero.File.putContentsAsync(fileUploadHistoryJsonPath, JSON.stringify(integreatedFileHistoryJson))
                        //将新的sqlite文件上传的webdav
                        const fileBytes = await IOUtils.read(fileUploadHistoryJsonPath)
                        await sendUint8ArrayFile(fileBytes, url, "PUT", {})
                        // 删除temp 文件
                        IOUtils.remove(fileUploadHistoryJsonPathTemp)

                        // 异步加载fileUploadHistoryJson
                        const res = Zotero.File.getContentsAsync(fileUploadHistoryJsonPath) as Promise<string>
                        res.then((fileUploadHistoryJsonText) => {
                          try {
                            const fileUploadHistoryJson = JSON.parse(fileUploadHistoryJsonText)
                            const intervalFile = setInterval(() => {
                                console.log("intervalFile")
                                if (addon.data.kimiApi) {
                                    console.log("写入file缓存map")
                                    addon.data.kimiApi.fileHashMap = fileUploadHistoryJson
                                    clearInterval(intervalFile)
                                }
                            },200)
                          } catch (e: any) {
                            console.log(e)
                          }
                        })
                    })
                }

                //如果云端也没有sqlite那么就要创建一个
                if (xhr.status === 404) {
                    console.log("云端没有sqlite文件")
                    try {
                        await createFileHistoryJson()
                        // 同步到云端
                        IOUtils.read(fileUploadHistoryJsonPath).then(fileBytes => {
                            //创建后同步一下
                            sendUint8ArrayFile(fileBytes, url, "PUT", {})

                            
                        })
                    } catch (e) {

                    }
                }
            }
        }
    })
}


export {
    syncFileHistoryJsonToWebDav
}