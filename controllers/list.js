const express = require('express');
const router = express.Router();

const List = require('../models/list')


router.get('/', (req, res, next) => {
    List.find({})
        .then(result => res.json(result))
        .catch(err => next(err))
})

router.get('/:id', (req, res, next) => {
    List.findById(req.params.id)
        .then(list => {
            if (list) res.json(list);
            else res.status(404).end()
        })
        .catch(err => next(err))
})

router.post('/', (req, res, next) => {
    const body = req.body

    const list = new List({
        name: body.name,
        description: body.description || '',
    })

    list
        .save()
        .then(savedList => res.json(savedList))
        .catch(err => next(err))
})

router.put('/:id', (req, res, next) => {
    const body = req.body

    const list = {
        name: body.name,
        description: body.description || '',
        movies: body.movies
    }

    List.findByIdAndUpdate(req.params.id, list, { new: true })
        .then(updatedList => res.json(updatedList))
        .catch(err => next(err))
})

router.delete('/:id', (req, res, next) => {
    List.findByIdAndRemove(req.params.id)
        .then(result => res.send(204).end())
        .catch(err => next(err))
})


module.exports = router;