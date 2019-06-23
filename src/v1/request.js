import { Router } from 'express'
import db from '../models/index'
import email from '../email'

const request = Router()

request.post('/add', async (req, res) => {
    // console.log(req.body)
    try {
        const result = await db.Request.create(req.body)
        // console.log(result)
        result ? email.sendMessage('Новая заявка', result.dataValues) : null
        res.json({ status: 'ok' })
    } catch(error) {
        console.log(error)
        res.json({
            status: 'error',
            error: error
        })
    }
})

export default request