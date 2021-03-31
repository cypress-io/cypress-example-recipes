/**
 * Returns a function that can be used as a ".should" callback
 * to verify the loaded image.
 *
 * @param {number} w The loaded image should have this width
 * @param {number} h The loaded image should have this height
 * @returns
 */
export const checkImageResolution = (w = 500, h = 333) => {
  return ($img) => {
    expect(w, 'expected width').to.be.gt(0)
    expect(h, 'expected height').to.be.gt(0)

    // "naturalWidth" and "naturalHeight" are set when the image loads
    expect(
      $img[0].naturalWidth,
      'image width'
    ).to.equal(w)

    expect(
      $img[0].naturalHeight,
      'image height'
    ).to.equal(h)
  }
}
