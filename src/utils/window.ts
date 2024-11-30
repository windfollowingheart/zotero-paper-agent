
/**
 * Check if the window is alive.
 * Useful to prevent opening duplicate windows.
 * @param win
 */
function isWindowAlive(win?: Window) {
  return win && !Components.utils.isDeadWrapper(win) && !win.closed;
}

function getWindowSize(): { baseWidth: number, baseHeight: number } {
  const windowWidth = ztoolkit.getGlobal("window").innerWidth;
  const windowHeight = ztoolkit.getGlobal("window").innerHeight;
  ztoolkit.log("窗口宽度: " + windowWidth + "px");
  ztoolkit.log("窗口高度: " + windowHeight + "px");
  if (windowHeight > 1000) {
    return {
      baseWidth: 25, //以vw, vh为单位
      baseHeight: 80
    }
  } else {
    return {
      baseWidth: 25,
      baseHeight: 75
    }
  }
}


export {
  isWindowAlive,
  getWindowSize
};
