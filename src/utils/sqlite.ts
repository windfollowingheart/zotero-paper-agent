import { sendUint8ArrayFile } from "./http"

let isSync = true
const sqliteName = "multimodal_ai_article_chat.sqlite"
const sqliteNameTemp = "multimodal_ai_article_chat_temp.sqlite"
const dataDir = Zotero.DataDirectory.dir
const sqlitePath = dataDir + "\\\\storage\\\\" + sqliteName
const sqlitePathTemp = dataDir + "\\\\storage\\\\" + sqliteNameTemp
let url = ""

async function createSQLiteFile() {


    //检查sqlite文件是否存在
    if (await IOUtils.exists(sqlitePath)) {
        // return
        await IOUtils.remove(sqlitePath)
    }

    //如果不存在就创建一个
    const content = new Uint8Array()
    IOUtils.write(sqlitePath, content).then(async (e) => {
        try {
            await createChatInfoTable()
            await createFileInfoTable()

            // 同步到云端
            IOUtils.read(sqlitePath).then(fileBytes => {
                //创建后同步一下
                sendUint8ArrayFile(fileBytes, url, "PUT", {})
            })
            // new ztoolkit.ProgressWindow("创建SQLite", { closeTime: 1000 })
            //     .createLine({
            //         text: "成功!",
            //         type: "success",
            //         progress: 100,
            //     })
            //     .show();
        } catch (e) {
            console.log(e)
            // new ztoolkit.ProgressWindow("创建SQLite", { closeTime: 1000 })
            //     .createLine({
            //         text: "失败!",
            //         type: "fail",
            //         progress: 100,
            //     })
            //     .show();
        }

    })
}


async function createChatInfoTable() {
    const sqliteConnection = new Zotero.DBConnection(sqlitePath)

    const sql = "CREATE TABLE chat_info (\
    chat_id       TEXT    PRIMARY KEY\
                          UNIQUE\
                          NOT NULL,\
    create_time   TEXT    NOT NULL,\
    is_over_token INTEGER NOT NULL,\
    is_del        INTEGER NOT NULL\
);\
"
    console.log(sqliteConnection)
    await sqliteConnection.queryAsync(sql)
    sqliteConnection.closeDatabase()
    console.log("create table chat_info")
}

async function createFileInfoTable() {
    const sqliteConnection = new Zotero.DBConnection(sqlitePath)

    const sql = "CREATE TABLE file_info (\
    item_key  TEXT PRIMARY KEY\
                  UNIQUE\
                  NOT NULL,\
    file_id TEXT NOT NULL\
);\
"
    console.log(sqliteConnection)
    await sqliteConnection.queryAsync(sql)
    sqliteConnection.closeDatabase()
    console.log("create table file_info")

}

async function integrateNewOldSqlite(): Promise<boolean> {
    //1.查询本地数据库数据
    const sqliteConnection = new Zotero.DBConnection(sqlitePath)

    const chatInfoLocalRows = await sqliteConnection.queryAsync("SELECT * FROM chat_info")
    const fileInfoLocalRows = await sqliteConnection.queryAsync("SELECT * FROM file_info")
    // console.log(chatInfoLocalRows)
    // for (let chatInfoLocalRow of chatInfoLocalRows) {
    //     console.log(chatInfoLocalRow.chat_id)
    // }

    const sqliteConnectionTemp = new Zotero.DBConnection(sqlitePathTemp)
    const chatInfoTempRows = await sqliteConnectionTemp.queryAsync("SELECT * FROM chat_info")
    const fileInfoTempRows = await sqliteConnectionTemp.queryAsync("SELECT * FROM file_info")
    await sqliteConnectionTemp.closeDatabase()

    // duplicateNewOldChatInfo()
    // duplicateNewOldFileInfo()


    //删除原来的chat_info和file_info表

    await sqliteConnection.queryAsync("DROP TABLE chat_info")
    await sqliteConnection.queryAsync("DROP TABLE file_info")
    console.log("删除完成两张表")

    // 重新创建两张表并插入数据
    await createChatInfoTable()
    await createFileInfoTable()

    //插入数据
    const newChatInfos = duplicateNewOldChatInfo()
    const newFileInfos = duplicateNewOldFileInfo()
    console.log(newChatInfos)
    for (let chatInfo of newChatInfos) {
        await sqliteConnection.queryAsync("INSERT INTO chat_info (chat_id, create_time, is_over_token, is_del) VALUES (?, ?, ?, ?)",
            [chatInfo.chat_id, chatInfo.create_time, chatInfo.is_over_token, chatInfo.is_del])
    }
    for (let fileInfo of newFileInfos) {
        await sqliteConnection.queryAsync("INSERT INTO file_info (item_key, file_id) VALUES (?, ?)", [fileInfo.item_key, fileInfo.file_id])
    }

    sqliteConnection.closeDatabase()

    return true


    function duplicateNewOldChatInfo() {
        let newArr: any[] = []
        let oldArr: any[] = []
        for (let chatInfoLocalRow of chatInfoLocalRows) {
            newArr.push({
                chat_id: chatInfoLocalRow.chat_id,
                create_time: chatInfoLocalRow.create_time,
                is_over_token: chatInfoLocalRow.is_over_token,
                is_del: chatInfoLocalRow.is_del
            })
        }
        for (let chatInfoLocalTempRow of chatInfoTempRows) {
            oldArr.push({
                chat_id: chatInfoLocalTempRow.chat_id,
                create_time: chatInfoLocalTempRow.create_time,
                is_over_token: chatInfoLocalTempRow.is_over_token,
                is_del: chatInfoLocalTempRow.is_del
            })
        }
        console.log("oldArr: ", oldArr)
        console.log("newArr: ", newArr)
        const oldNewArray = [...oldArr, ...newArr]
        // // const uniqueArray = Array.from(new Map(oldNewArray.map(item => [JSON.stringify(item), item])).values())
        // const uniqueArray = Array.from(new Map(oldNewArray.map((item, self) => {
        //     return [JSON.stringify(item.chat_id), item]
        // })).values())

        // let chatMap: Map<string, any> = new Map(oldNewArray.map((item) => {
        //     const key = JSON.stringify(item.chat_id);
        //     // 检查 Map 中是否已经有这个 key
        //     if (chatMap.has(key)) {
        //         // 如果有，你可以选择更新值或者做其他操作
        //         // 
        //         if (item.is_over_token) {
        //             return [key, item]
        //         } else {
        //             return [key, chatMap.get(key)];
        //         }
        //     } else {
        //         // 如果没有，添加新的键值对
        //         // chatMap.set(key, item);
        //         return [key, item]; // 返回键值对以构建 Map

        //     }
        // }));
        let chatMap: Map<string, any> = new Map();
        oldNewArray.forEach((item, index) => {
            console.log(item)
            console.log(item.is_over_token)

            if (chatMap.has(item.chat_id)) {
                //如果有key，先判断是否is_del
                if (item.is_del) {
                    chatMap.set(item.chat_id, item);
                } else {
                    //然后判断是否is_over_token
                    if (item.is_over_token) {
                        chatMap.set(item.chat_id, item);
                    }
                }
            } else {
                chatMap.set(item.chat_id, item);
            }



            if (!item.is_over_token) {
                // console.log("找到超杰0", index)
                if (chatMap.has(item.chat_id)) {
                    // console.log("找到超杰", index)
                    return
                } else {
                    chatMap.set(item.chat_id, item);
                }

            }
            else if (!item.is_del) {
                if (chatMap.has(item.chat_id)) {
                    // console.log("找到超杰", index)
                    return
                } else {
                    chatMap.set(item.chat_id, item);
                }
            }
            else {
                // chatMap.delete(item.chat_id);
                chatMap.set(item.chat_id, item);
            }
        })
        console.log(chatMap)

        // 将 Map 转换为数组以便更容易地遍历和检查值
        const uniqueArray = Array.from(chatMap.values());
        return uniqueArray
    }

    function duplicateNewOldFileInfo() {
        let newArr: any[] = []
        let oldArr: any[] = []
        for (let chatInfoLocalRow of fileInfoLocalRows) {
            newArr.push({
                file_id: chatInfoLocalRow.file_id,
                item_key: chatInfoLocalRow.item_key,
            })
        }
        for (let chatInfoLocalTempRow of fileInfoTempRows) {
            oldArr.push({
                file_id: chatInfoLocalTempRow.file_id,
                item_key: chatInfoLocalTempRow.item_key,
            })
        }

        const oldNewArray = [...oldArr, ...newArr]
        const uniqueArray = Array.from(new Map(oldNewArray.map(item => [JSON.stringify(item), item])).values())
        return uniqueArray
    }



}





//同步sqlite到webdav
async function syncSqliteWebDav() {
    try {
        url = Zotero.Sync.Storage.Mode.WebDAV.prototype.rootURI.displaySpec + sqliteName
    } catch (e) {
        console.log(e)
        isSync = false
    }
    if (!isSync) return
    // 1.首先从webdav获取老的sqlite.

    //获取webdav用户名和密码
    // const { username, password } = Zotero.Sync.Storage.Mode.WebDAV
    // url = 

    //可以直接获取webdav的url

    console.log(url)

    if (await IOUtils.exists(sqlitePathTemp)) {
        IOUtils.remove(sqlitePathTemp)
    }

    Zotero.HTTP.request("GET", url, {
        responseType: "arraybuffer",
        errorDelayMax: 0,
        requestObserver: (xhr: XMLHttpRequest) => {
            xhr.onload = async (e) => {
                if (xhr.status === 200) {
                    // console.log(xhr.responseText)
                    // console.log(xhr.response)
                    //如果本地不存在sqlite文件，就不需要整合，直接写入
                    const uint8Array = new Uint8Array(xhr.response);

                    if (! await IOUtils.exists(sqlitePath)) {
                        IOUtils.write(sqlitePath, uint8Array)
                        return
                    }


                    //如果存在就要整合
                    // console.log(uint8Array);
                    IOUtils.write(sqlitePathTemp, uint8Array).then(async (e) => {
                        // 然后整合新老数据
                        console.log("开始整合sqlite文件")
                        integrateNewOldSqlite().then(async (isok) => {
                            if (isok) {
                                console.log("整合成功")
                                //将新的sqlite文件上传的webdav
                                const fileBytes = await IOUtils.read(sqlitePath)
                                await sendUint8ArrayFile(fileBytes, url, "PUT", {})

                                //删除temp 文件
                                IOUtils.remove(sqlitePathTemp)
                                console.log("同步成功")
                            }
                        })

                    })
                }

                //如果云端也没有sqlite那么就要创建一个
                if (xhr.status === 404) {
                    console.log("云端没有sqlite文件")
                    createSQLiteFile()
                }
            }
        }
    })




    // Zotero.HTTP.request("GET", url, { errorDelayMax: 0, }).then(async (xhr) => {

    //     if (xhr.status === 200) {
    //         // console.log(xhr.responseText)
    //         // console.log(xhr.response)
    //         //如果本地不存在sqlite文件，就不需要整合，直接写入
    //         const uint8Array = new Uint8Array(xhr.response);

    //         if (! await IOUtils.exists(sqlitePath)) {
    //             IOUtils.write(sqlitePath, uint8Array)
    //             return
    //         }


    //         //如果存在就要整合
    //         // console.log(uint8Array);
    //         IOUtils.write(sqlitePathTemp, uint8Array).then(async (e) => {
    //             // 然后整合新老数据
    //             console.log("开始整合sqlite文件")
    //             integrateNewOldSqlite().then(async (isok) => {
    //                 if (isok) {
    //                     console.log("整合成功")
    //                     //将新的sqlite文件上传的webdav
    //                     const fileBytes = await IOUtils.read(sqlitePath)
    //                     await sendUint8ArrayFile(fileBytes, url, "PUT", {})

    //                     //删除temp 文件
    //                     IOUtils.remove(sqlitePathTemp)
    //                     console.log("同步成功")
    //                 }
    //             })

    //         })
    //     }

    //     xhr.onerror = (e) => {
    //         console.log(e)
    //     }
    //     //如果云端也没有sqlite那么就要创建一个
    //     if (xhr.status === 404) {
    //         console.log("云端没有sqlite文件")
    //         createSQLiteFile().then((e) => {
    //             console.log(e)
    //             IOUtils.read(sqlitePath).then(fileBytes => {
    //                 //创建后同步一下
    //                 sendUint8ArrayFile(fileBytes, url, "PUT", {})
    //             })

    //         })
    //     }



    // })

    //2.将本地sqlite与老sqlite比较,整合差异, 生成新的sqlite

    //3.将新的sqlite上传到webdav

}


// 查询数据库的chatinfo信息

export async function queryChatInfo(): Promise<any[]> {
    const sqliteConnection = new Zotero.DBConnection(sqlitePath)
    const sql = `SELECT * FROM chat_info`
    const chatInfoRows = await sqliteConnection.queryAsync(sql)
    sqliteConnection.closeDatabase()
    const chatInfoArray = chatInfoRows.map((row: any) => {
        return {
            chat_id: row.chat_id,
            create_time: row.create_time,
            is_over_token: row.is_over_token,
            is_del: row.is_del,
        }
    })
    return chatInfoArray
}


// 插入新的chatinfo信息
export async function insertNewChatInfo(chat_id: string, create_time: string, is_over_token: number, is_del: number): Promise<boolean> {
    const sqliteConnection = new Zotero.DBConnection(sqlitePath)
    try {
        const sql = `INSERT INTO chat_info (chat_id, create_time, is_over_token, is_del) VALUES ('${chat_id}', '${create_time}', ${is_over_token}, ${is_del})`
        await sqliteConnection.queryAsync(sql)
        sqliteConnection.closeDatabase()
        return true
    } catch (e) {
        sqliteConnection.closeDatabase()
        return false
    }
}

// 更新的chatinfo信息的
export async function updateChatInfo(chat_id: string = "", create_time: string = "", is_over_token: number = 0, is_del: number = 0): Promise<boolean> {
    const sqliteConnection = new Zotero.DBConnection(sqlitePath)
    try {
        let sql = `UPDATE chat_info SET ${create_time ? `create_time='${create_time}',` : ""} 
        ${is_over_token ? `is_over_token=${is_over_token},` : ""} 
        ${is_del ? `is_del=${is_del},` : ""}`
        //去掉最后一个逗号
        sql = sql.split(',').slice(0, -1).join(',');
        // sql = sql.substring(0, sql.length - 1) + ` WHERE chat_id='${chat_id}'`
        sql = sql + ` WHERE chat_id='${chat_id}'`

        console.log(sql)
        await sqliteConnection.queryAsync(sql)
        sqliteConnection.closeDatabase()
        return true
    } catch (e) {
        sqliteConnection.closeDatabase()
        return false
    }
}


// 查询数据库是否存在某个file_id
export async function queryFileId(item_key: string): Promise<string> {
    const sqliteConnection = new Zotero.DBConnection(sqlitePath)
    const sql = `SELECT * FROM file_info WHERE item_key='${item_key}'`
    const fileRow = await sqliteConnection.queryAsync(sql)
    sqliteConnection.closeDatabase()
    if (fileRow.length > 0) {
        return fileRow[0].file_id
    } else {
        return ""
    }
}

// 插入新的file_id
export async function insertNewFileInfo(item_key: string, file_id: string): Promise<boolean> {
    const sqliteConnection = new Zotero.DBConnection(sqlitePath)
    try {
        const sql = `INSERT INTO file_info (item_key, file_id) VALUES ('${item_key}', '${file_id}')`
        await sqliteConnection.queryAsync(sql)
        sqliteConnection.closeDatabase()
        return true
    } catch (e) {
        sqliteConnection.closeDatabase()
        return false
    }
}

export {
    createSQLiteFile,
    createFileInfoTable,
    syncSqliteWebDav,
    integrateNewOldSqlite,
}