const express = require('express');

const router = express.Router();
const queryModel = require('../models/Query.model');

router.post('/created-query', async (req, res) => {
    try {
        const result = await queryModel.create()
    } catch (err) {
        console.log(err)
    }
})