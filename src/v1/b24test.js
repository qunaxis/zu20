import { Router } from 'express'
import bitrix from '../connectors/b24'

const b24test = Router()

b24test.get('/deals', async (req, res) => {
    console.log('GETTING DEAL LIST')
    // const data = await bitrix.getDealList()
    // res.send(data)
})


export default b24test