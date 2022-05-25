export function saveCanvasToImg(canvas: HTMLCanvasElement) {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'graphism.png');
    canvas.toBlob(function(blob) {
      let url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
}