const drawLineBH = (x0, y0, x1, y1, pixelSize = 1, canvasContext, callBack) => {
  const deltaX = Math.abs(x1 - x0);
  const deltaY = Math.abs(y1 - y0);

  const signX = x0 < x1 ? 1 : -1;
  const signY = y0 < y1 ? 1 : -1;
  let err = deltaX - deltaY;

  while (x0 !== x1 || y0 !== y1) {
    callBack(x0, y0, pixelSize, canvasContext);

    const err2 = err * 2;
    if (err2 > -deltaY) {
      err -= deltaY;
      x0 += signX;
    }
    if (err2 < deltaX) {
      err += deltaX;
      y0 += signY;
    }
  }

  callBack(x0, y0, pixelSize, canvasContext);
};

const convertHexToRGBA = hexStr => {
  const IndexesInHexColorData = {
    red: { start: 0 },
    green: { start: 2 },
    blue: { start: 4 },
    amount: { value: 2 },
    alpha: { value: 255 },
  };

  return `rgba(${parseInt(
    hexStr.substr(IndexesInHexColorData.red.start, IndexesInHexColorData.amount.value),
    16,
  )}, ${parseInt(hexStr.substr(IndexesInHexColorData.green.start, IndexesInHexColorData.amount.value), 16)}, ${parseInt(
    hexStr.substr(IndexesInHexColorData.blue.start, IndexesInHexColorData.amount.value),
    16,
  )}, ${IndexesInHexColorData.alpha.value})`;
};

export default {
  drawLineBH,
  convertHexToRGBA,
};
