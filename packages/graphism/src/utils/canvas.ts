export function saveCanvasToImg(canvas: HTMLCanvasElement) {
    var dataURL = canvas.toDataURL("image/png");
    var newTab = window.open('about:blank','image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
}