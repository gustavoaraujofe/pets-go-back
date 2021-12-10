const express = require('express');

const router = express.Router();
const queryModel = require('../models/Query.model');

router.post('/created-query', async (req, res) => {
    try {
        const result = await queryModel.create(req.body)
        res.status(201).json(result)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.get('/queries', async (req, res) => {
    try {
        const query = await queryModel.find()
        res.status(200).json(query)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.get('/queries/:id', async (req, res) => {
    try {
        const query = await queryModel.findOne({_id: req.params.id})
        
        if (!query) {
            return res.status(404).json('Consulta não encontrada.')
        }

        res.status(200).json(query)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.patch('/queries/:id', async (req, res) => {
    try {
        const result = await queryModel.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true, runValitadors: true}
        );
    
        if (!result) {
            return res.status(404).json({msg: "Consulta não encontrada."})
        }

        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

module.exports = router;