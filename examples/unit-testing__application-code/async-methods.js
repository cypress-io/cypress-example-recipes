/**
 * Reverses a given string asynchronously
 * @param {string} s String to reverse
 * @returns {Promise<string>} reversed string
 */
export const reverseString = (s) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(s.split('').reverse().join(''))
    }, 1000)
  })
}
