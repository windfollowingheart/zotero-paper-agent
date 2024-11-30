

export function registerPrompt() {
    ztoolkit.Prompt.register([
        {
            name: "Translate Sentences",
            label: "config.addonInstance",
            when: () => {
                const selection = "hello";
                return true
            },
            callback: async (prompt) => {
                ztoolkit.getGlobal("alert")("hello")

            }
        }])
}