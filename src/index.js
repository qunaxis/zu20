import app from './app'

// require('dotenv')

const { PORT = 80 } = process.env
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)) // eslint-disable-line no-console
