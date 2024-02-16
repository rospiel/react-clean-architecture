const fallback = require('express-history-api-fallback')
const express = require('express')
const app = express()
const root = `${__dirname}/public`
app.use(express.static(root))
app.use(fallback('index.html', { root }))
app.listen(process.env.PORT || 3000)