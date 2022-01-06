const testsRouter = require('express').Router()

const jwt = require('jsonwebtoken')

const AdmissionForm = require('../models/admissionForm.model.js')
const BasicInformationForm = require('../models/basicInformationForm.model.js')
const config = require('../utils/config.js')


testsRouter.post('/reset', async (req, res) => {
    await AdmissionForm.deleteMany({})
    await BasicInformationForm.deleteMany({})

    res.status(204).end()
})

// Response to posting basic-information doesn't include the saved object's id, but it's needed for cypress-testing in thl-frontend
testsRouter.post('/basic_information_form', async (req, res) => {
    const data = req.body

    const basicInformationForm = new BasicInformationForm({
        organization: data.organization,
        sender: data.sender,
        email: data.email,
        phoneNumber: data.phoneNumber,
    })

    const savedForm = await basicInformationForm.save()
    res.send(savedForm.toJSON()).status(204)
})

// cypress-testing: thl-frontend, listingAdmissions.spec.js
testsRouter.post('/short_token', async (req, res) => {
    console.log('username ', req.body.username)
    console.log('role ', req.body.role)
    let token = jwt.sign({ username: req.body.username, role: req.body.role }, config.TOKEN_SECRET, { expiresIn: 5 })
    res.status(200).send({ username: req.body.username, role: req.body.role, accessToken: token })
})

module.exports = testsRouter
