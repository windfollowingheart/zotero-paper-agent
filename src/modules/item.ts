
// const win = ztoolkit.getGlobal("window")
// const _require = win.require;
// const CollectionTree = _require("chrome://zotero/content/collectionTree.js");
// const ItemTree = _require("chrome://zotero/content/itemTree.js");
// const { getCSSItemTypeIcon } = _require("components/icons");



// export async function loadLibraryNotes() {
//     const itemsView = await ItemTree.init(
//         document.querySelector("#zotero-items-tree"),
//         {
//             onSelectionChange: () => {
//                 onItemSelected(itemsView);
//             },
//             id: "select-items-dialog",
//             dragAndDrop: false,
//             persistColumns: true,
//             columnPicker: true,
//             emptyMessage: Zotero.getString("pane.items.loading"),
//         },
//     );
//     itemsView.isSelectable = (index: number, selectAll = false) => {
//         const row = itemsView.getRow(index);
//         console.log(row)
//         if (!row) {
//             return false;
//         }
//         // @ts-ignore
//         if (!row.ref.isNote()) return false;
//         if (itemsView.collectionTreeRow.isTrash()) {
//             // @ts-ignore
//             return row.ref.deleted;
//         } else {
//             // @ts-ignore
//             return this.itemsView._searchItemIDs.has(row.id);
//         }
//     };

// }


// function onItemSelected(itemsView: any) {
//     console.log(itemsView)

// }