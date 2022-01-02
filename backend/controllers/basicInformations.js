const Mailer = require('../services/mailer.js')
const HelperFunctions = require('../utils/helperFunctions.js')
const basinInformationsRouter = require('express').Router()
const BasicInformationForm = require('../models/basicInformationForm.model.js')


basinInformationsRouter.get('/basic_information/:id', async (req, res) => {
    const basicInfo = await BasicInformationForm.findById(req.params.id)
    res.json(basicInfo)
})

basinInformationsRouter.post('/basic_information_form', async (req, res) => {
    const data = req.body

    const basicInformationForm = new BasicInformationForm({
        organization: data.organization,
        sender: data.sender,
        email: data.email,
        phoneNumber: data.phoneNumber,
    })

    if (!HelperFunctions.validateBasicInformationData(basicInformationForm)) {
        res.sendStatus(400)
    } else {
        const savedForm = await basicInformationForm.save()
        const response = [
            savedForm.organization,
            savedForm.sender,
            savedForm.email,
            savedForm.phoneNumber
        ]
        res.sendStatus(200)
        Mailer.sendLinkToAdmissionForm(savedForm.email, savedForm.id)
    }
})

module.exports = basinInformationsRouter
