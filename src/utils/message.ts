

function createMessageBox(message: string, YesFunc: Function, NoFunc: Function = () => { }, type: string = "default", inputString: string = "") {
    const doc = ztoolkit.getGlobal("document")
    const messageContainer = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "200px",
            height: "100px",
            backgroundColor: "#f3f3f3",
            border: "1px solid #e6e6e6",
            borderRadius: "10px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },

    })

    const messageDiv = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            // marginBottom: "20px",
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            height: type == "default" ? "80%" : "40%"
        },
    })
    messageDiv.textContent = message


    const inputDiv = ztoolkit.UI.createElement(doc, "input", {
        namespace: "html",
        styles: {
            display: type == "input" ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            // marginBottom: "20px",
            width: "90%",
            height: "40%",
        },
    })
    inputDiv.value = inputString

    const yesButton = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
        listeners: [
            {
                type: "click",
                listener: () => {
                    messageContainer.remove()
                    YesFunc()
                }
            }
        ]
    })
    yesButton.textContent = "确定"

    const noButton = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
        listeners: [
            {
                type: "click",
                listener: () => {
                    messageContainer.remove()
                    NoFunc()
                }
            }
        ]
    })
    noButton.textContent = "取消"

    const buttonContainerDiv = ztoolkit.UI.createElement(doc, "div", {
        namespace: "html",
        styles: {
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "0 20px"
        },
    })


    buttonContainerDiv.append(yesButton, noButton)
    messageContainer.append(messageDiv, inputDiv, buttonContainerDiv)

    doc.documentElement.append(messageContainer)

    return messageContainer


}

export {
    createMessageBox
}