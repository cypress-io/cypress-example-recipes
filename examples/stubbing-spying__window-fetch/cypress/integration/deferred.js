// little utility for making Promise-returning stubs easier
module.exports = function () {
  const deferred = {}
  /* global Promise */
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}
