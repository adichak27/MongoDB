const express = require('express')
const router = express.Router();
const Subscriber = require("../models/subscriber")


// Get all
router.get('/', async (req, resp) => {
    try {
        const subscribers = await Subscriber.find();
        resp.json(subscribers)
    } catch (error) {
        resp.status(500).json( { message: error.message})
    }
})

// Get one 
router.get('/:id', getSubscriber, (req, resp) => {
    resp.json(resp.subscriber)
})

// Create one 
router.post('/', async (req, resp) => {

    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try {
        const newSubscriber = await subscriber.save();
        resp.status(201).json(newSubscriber);
    } catch (error) {
        resp.status(400).json({ message: error.message })
    }
})

// update one 
router.patch('/:id', getSubscriber, async (req, resp) => {
    if (req.body.name != null) {
        resp.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null) {
        resp.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    try {
        const updatedSubscriber = await resp.subscriber.save();
        resp.json(updatedSubscriber)
    } catch (error) {
        resp.status(400).json({message: error.message})
    }
})

// delete one
router.delete('/:id', getSubscriber, async (req, resp) => {
    try {
        await resp.subscriber.deleteOne();

        resp.json({message: "deleted subscriber"})
    } catch (error) {
        resp.status(500).json({message: error.message})
    }
})

async function getSubscriber(req, resp, next) {
    let subscriber;
    try {

        subscriber = await Subscriber.findById(req.params.id)
        if (subscriber == null) {
            return resp.status(404).json({message: "cannot find subscriber"})
        }
    } catch (error) {
        return resp.status(500).json({message: error.message})
    }
    resp.subscriber = subscriber
    next();
}



module.exports = router 