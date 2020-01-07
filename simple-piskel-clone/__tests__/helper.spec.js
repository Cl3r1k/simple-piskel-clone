import helper from '../src/common/helper';

describe('#drawLineBH()', () => {
  test(`it should call callback with straight values`, () => {
    // Arrange
    const mock = {
      mockDrawPixelCallback(dx, dy, pixelSize, canvasContext) {
        dx = dy || pixelSize || canvasContext;
      },
    };

    // Act
    const spy = jest.spyOn(mock, 'mockDrawPixelCallback');
    helper.drawLineBH(0, 0, 10, 0, 1, null, mock.mockDrawPixelCallback);

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  test(`it should call callback with reverse values`, () => {
    // Arrange
    const mock = {
      mockDrawPixelCallback(dx, dy, pixelSize, canvasContext) {
        dx = dy || pixelSize || canvasContext;
      },
    };

    // Act
    const spy = jest.spyOn(mock, 'mockDrawPixelCallback');
    helper.drawLineBH(10, 10, 0, 0, 1, null, mock.mockDrawPixelCallback);

    // Assert
    expect(spy).toHaveBeenCalled();
  });
});

describe('#convertHexToRGBA()', () => {
  test(`it should return converted color from 'ffffff' to 'rgba(255, 255, 255, 255)'`, () => {
    // Arrange

    // Act
    const result = helper.convertHexToRGBA('ffffff');

    // Assert
    expect(result).toEqual('rgba(255, 255, 255, 255)');
  });

  test(`it should return converted color from '000000' to 'rgba(0, 0, 0, 255)'`, () => {
    // Arrange
    const result = helper.convertHexToRGBA('000000');

    // Act

    // Assert
    expect(result).toEqual('rgba(0, 0, 0, 255)');
  });
});
