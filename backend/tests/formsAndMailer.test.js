/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')
const baseUrl = '/api/admissions'
const api = supertest(app)
const helper = require('./test_helper')
const MailDev = require('maildev')

const AdmissionForm = require('../models/admissionForm.model.js')
const BasicInformationForm = require('../models/basicInformationForm.model.js')

jest.setTimeout(30000)

const maildev = new MailDev({ disableWeb: true, verbose: true, ip: '127.0.0.1' })
maildev.listen()

beforeEach(async () => {
    maildev.deleteAllEmail(function(err) {
        expect(err).toBeNull()
    })
    await BasicInformationForm.deleteMany({})
    await AdmissionForm.deleteMany({})
})

afterAll(async () => {
    await maildev.close()
})

test('Link for police to adding attachments is sent after POST request', async () => {

    const admission_form = helper.admissionFormTestData
    admission_form.basicInformation = await helper.saveTestBasicInfoFormAndReturnId()

    await api
        .post(baseUrl+'/admission_form')
        .send(admission_form)        
        .expect(200)
        .expect('Content-Type', /application\/json/)

    await new Promise((t) => setTimeout(t, 1000))
    const admissionsInDb = await helper.admissionsInDb()
    expect(admissionsInDb.length).toBe(1)

    const infoObject= {
        email: 'pekka.polliisi@poliisi.fi',
        value: admissionsInDb[0].id,
    }
    await api
        .post(baseUrl+'/upload_form')
        .send(infoObject)        
        .expect(200) 
    
    await new Promise((t) => setTimeout(t, 1000))
    maildev.getAllEmail(function (err, emails) {
        expect(err).toBeNull()
        expect(emails.length).toBe(2)
        email = emails[1]
        expect(email.to).toStrictEqual([{ address: infoObject.email, name: '' }])
        expect(email.text.includes(admissionsInDb[0].id)).toBe(true)
    }) 
})



test('Link to admission form is sent after POST request', async () => {
    const basicInfo = helper.basicInfoFormTestData

    await api
        .post(baseUrl+'/basic_information_form')
        .send(basicInfo)        
        .expect(200)

    await new Promise((t) => setTimeout(t, 1000))
    const basicsInDb = await helper.basicsInDb()
    expect(basicsInDb.length).toBe(1)
    maildev.getAllEmail(function (err, emails) {
        expect(err).toBeNull()
        expect(emails.length).toBe(1)
        email = emails[0]
        expect(email.to).toStrictEqual([{ address: basicInfo.email, name: '' }])
        expect(email.text.includes(basicsInDb[0].id)).toBe(true)
    })
})

test('Confirmation is sent after POST request', async () => {
    const admission_form = helper.admissionFormTestData
    admission_form.basicInformation = await helper.saveTestBasicInfoFormAndReturnId()

    await api
        .post(baseUrl+'/admission_form')
        .send(admission_form)        
        .expect(200)
        .expect('Content-Type', /application\/json/)

    await new Promise((t) => setTimeout(t, 1000))
    const admissionsInDb = await helper.admissionsInDb()
    expect(admissionsInDb.length).toBe(1)
    maildev.getAllEmail(function (err, emails) {
        expect(err).toBeNull()
        expect(emails.length).toBe(1)
        email = emails[0]
        expect(email.text.includes(admissionsInDb[0].diaariNumber)).toBe(true)
        expect(email.text.includes(admissionsInDb[0].id)).toBe(true)
    })
})
