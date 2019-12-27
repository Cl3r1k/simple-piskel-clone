// TODO: Fix code for filling
/*
 * void floodFill(CanvasContext2D canvasContext, int x, int y)
 * Perform fill on Canvas
 * canvasContext - canvas Context
 * int x, y - fill point coordinates
 * color - fill color
 */
export default class CanvasFloodFillerClass {
  constructor(canvasContext, x, y, color) {
    this.canvasContext = canvasContext;
    this.cWidth = canvasContext.canvas.width;
    this.cHeight = canvasContext.canvas.height;
    this.x = x;
    this.y = y;

    const colorRGBA = color.replace('rgba(', '').replace(')', '');
    const rgbaArr = colorRGBA.split(', ');
    [this.nR, this.nG, this.nB, this.nA] = [
      parseInt(rgbaArr[0], 10),
      parseInt(rgbaArr[1], 10),
      parseInt(rgbaArr[2], 10),
      parseInt(rgbaArr[3], 10),
    ];
  }

  getDot(x, y) {
    // Dot: y * canvas_width * 4 + (x * 4)
    const dStart = y * this.cWidth * 4 + x * 4;
    const dr = this.data[dStart];
    const dg = this.data[dStart + 1];
    const db = this.data[dStart + 2];
    const da = this.data[dStart + 3];

    return { r: dr, g: dg, b: db, a: da };
  }

  isNeededPixel(x, y) {
    const dStart = y * this.cWidth * 4 + x * 4;
    const dr = this.data[dStart];
    const dg = this.data[dStart + 1];
    const db = this.data[dStart + 2];
    const da = this.data[dStart + 3];

    return dr === this.rR && dg === this.rG && db === this.rB && da === this.rA;
  }

  findLeftPixel(x, y) {
    let lx = x - 1;
    let dCoord = y * this.cWidth * 4 + lx * 4;

    while (
      lx >= 0 &&
      this.data[dCoord] === this.rR &&
      this.data[dCoord + 1] === this.rG &&
      this.data[dCoord + 2] === this.rB &&
      this.data[dCoord + 3] === this.rA
    ) {
      this.data[dCoord] = this.nR;
      this.data[dCoord + 1] = this.nG;
      this.data[dCoord + 2] = this.nB;
      this.data[dCoord + 3] = this.nA;

      lx--;
      dCoord -= 4;
    }

    return lx + 1;
  }

  findRightPixel(x, y) {
    let rx = x;
    let dCoord = y * this.cWidth * 4 + x * 4;

    while (
      rx < this.cWidth &&
      this.data[dCoord] === this.rR &&
      this.data[dCoord + 1] === this.rG &&
      this.data[dCoord + 2] === this.rB &&
      this.data[dCoord + 3] === this.rA
    ) {
      this.data[dCoord] = this.nR;
      this.data[dCoord + 1] = this.nG;
      this.data[dCoord + 2] = this.nB;
      this.data[dCoord + 3] = this.nA;

      rx++;
      dCoord += 4;
    }

    return rx - 1;
  }

  effectiveFill(cx, cy) {
    const lineQueue = [];

    const fx1 = this.findLeftPixel(cx, cy);
    const fx2 = this.findRightPixel(cx, cy);

    lineQueue.push({ x1: fx1, x2: fx2, y: cy });

    while (lineQueue.length > 0) {
      const cLine = lineQueue.shift();
      let nx1 = cLine.x1;
      let nx2 = cLine.x1;
      let currX = nx2;

      if (cLine.y > 0) {
        if (this.isNeededPixel(cLine.x1, cLine.y - 1)) {
          nx1 = this.findLeftPixel(cLine.x1, cLine.y - 1);
          nx2 = this.findRightPixel(cLine.x1, cLine.y - 1);
          lineQueue.push({ x1: nx1, x2: nx2, y: cLine.y - 1 });
        }

        currX = nx2;
        while (cLine.x2 >= nx2 && currX <= cLine.x2 && currX < this.cWidth - 1) {
          currX++;

          if (this.isNeededPixel(currX, cLine.y - 1)) {
            nx1 = currX;
            nx2 = this.findRightPixel(currX, cLine.y - 1);
            lineQueue.push({ x1: nx1, x2: nx2, y: cLine.y - 1 });
            currX = nx2;
          }
        }
      }

      nx1 = cLine.x1;
      nx2 = cLine.x1;
      if (cLine.y < this.cHeight - 1) {
        if (this.isNeededPixel(cLine.x1, cLine.y + 1)) {
          nx1 = this.findLeftPixel(cLine.x1, cLine.y + 1);
          nx2 = this.findRightPixel(cLine.x1, cLine.y + 1);
          lineQueue.push({ x1: nx1, x2: nx2, y: cLine.y + 1 });
        }

        currX = nx2;
        while (cLine.x2 >= nx2 && currX <= cLine.x2 && currX < this.cWidth - 1) {
          currX++;

          if (this.isNeededPixel(currX, cLine.y + 1)) {
            nx1 = currX;
            nx2 = this.findRightPixel(currX, cLine.y + 1);
            lineQueue.push({ x1: nx1, x2: nx2, y: cLine.y + 1 });
            currX = nx2;
          }
        }
      }
    } // while (main loop)
  }

  floodFill() {
    const imageData = this.canvasContext.getImageData(0, 0, this.cWidth, this.cHeight);
    this.data = imageData.data;

    const toReplace = this.getDot(this.x, this.y);
    this.rR = toReplace.r;
    this.rG = toReplace.g;
    this.rB = toReplace.b;
    this.rA = toReplace.a;

    if (this.rR === this.nR && this.rG === this.nG && this.rB === this.nB && this.rA === this.nA) {
      return;
    }

    this.effectiveFill(this.x, this.y);

    this.canvasContext.putImageData(imageData, 0, 0);
  }
}

// © "dimasokol.ru"
