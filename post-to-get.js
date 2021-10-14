module.exports = (req, res, next) => {
  if (req.method === 'POST') {
    // Convert POST to GET and move payload to query parameters
    // This will make JSON server think that is a GET request
    req.method = 'GET'
    req.query = req.body
  }
  // Continue to JSON Server router
  next()
}
