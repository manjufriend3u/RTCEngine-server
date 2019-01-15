import {Response, Request, Router  } from 'express'
import * as cors from 'cors'

const MediaServer = require('medooze-media-server')

import MediaRouter from './router'

import config from './config'
import context from './context'

const apiRouter = Router()



apiRouter.get('/test', async (req: Request, res: Response) => {
    res.send('hello world')
})

apiRouter.post('/api/publish', async (req: Request, res:Response) => {
    console.dir(req.body)

    const sdp = req.body.sdp
    
    const router = new MediaRouter(context.endpoint, config.capabilities)

    const {incoming,answer} = router.createIncoming(sdp)

    context.routers.set(incoming.getId(), router)

    res.json({
        s: 10000,
        d: {
            sdp: answer,
            streamId: incoming.getId()
        },
        e: ''
    })
})


apiRouter.post('/api/unpublish', async (req: Request, res:Response) => {

    const streamId = req.body.streamId

    const router = context.routers.get(streamId)

    router.stop()

    res.json({
        s: 10000,
        d: {},
        e: ''
    })
})


apiRouter.post('/api/play', async (req: Request, res:Response) => {

    console.dir(req.body)

    const sdp = req.body.sdp
    const streamId = req.body.streamId
    const outgoingId = req.body.outgoingId

    const router = context.routers.get(streamId)

    const {answer, outgoing} = router.createOutgoing(sdp, outgoingId)

    res.json({
        s: 10000,
        d: { 
            sdp: answer,
            outgoingId: outgoing.getId()
        },
        e: ''
    })
})


apiRouter.post('/api/unplay', async (req: Request, res:Response) => {

    console.dir(req.body)

    const streamId = req.body.streamId
    const outgoingId = req.body.outgoingId 

    const router = context.routers.get(streamId)
    router.stopOutgoing(outgoingId)

    res.json({
        s: 10000,
        d: { },
        e: ''
    })
})


apiRouter.get('/api/offer', async (req: Request, res:Response) => {

    const remoteOffer = context.endpoint.createOffer(config.capabilities)
    
    res.json({
        s: 10000,
        d: {
            sdp: remoteOffer.toString()
        },
        e: ''
    })
})

apiRouter.options('/api/config', cors())
apiRouter.post('/api/config', async (req: Request, res:Response) => {

})


export default apiRouter