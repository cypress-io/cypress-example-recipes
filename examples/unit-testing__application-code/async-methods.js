/**
 * Utility function to wait the given number of milliseconds
 * @param {number} ms Milliseconds to sleep
 * @returns {Promise<void>} returns a Promise
 */
const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Reverses a given string asynchronously
 * @param {string} s String to reverse
 * @returns {Promise<string>} reversed string
 */
export const reverseString = (s) => {
  return delay(1000).then(() => s.split('').reverse().join(''))
}

/**
 * Returns double or concatenated parameter
 * @param {number|string} s Parameter to double or concatenate
 * @returns {Promise<number|string>} Result after 500ms
 * @example await twice(4) // 8
 * @example await twice('foo') // 'foofoo'
 */
export const twice = async (s) => {
  await delay(500)

  return s + s
}
