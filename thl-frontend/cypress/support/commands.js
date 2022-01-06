/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import dayjs from 'dayjs'
//const testData = require('./test_data.json')
const testData = require('../../../backend/tests/test_data.json')

import 'cypress-file-upload'
const testPdfName = 'test_pdf.pdf'

var senders_id = ''
var created_at = ''

const admissionFormData = testData.admission_forms[0]
let basicInfoFormTestData = testData.basic_info_forms[0]



Cypress.Commands.add('emptyDatabase', () => {
    cy.request({
        url: 'http://localhost:3001/tests/reset',
        method: 'POST',
    })
})


Cypress.Commands.add('sendBasicInformation', () => {
    cy.request({
        url: 'http://localhost:3001/tests/basic_information_form',
        method: 'POST',
        body: {
            ...basicInfoFormTestData
        },
    }).then(response => {

        localStorage.setItem('sender_id', JSON.stringify(response.body.id))
        const sender_id = localStorage.sender_id
        senders_id = sender_id.replace(/['"]+/g,'')
    })
})

Cypress.Commands.add('sendAdmissionForm', ( data ) => {
    if (senders_id === '') {
        console.log('POST-request of admission form not valid before basic-information has been sent for basicInformation id')
        return
    }
    return cy.request({
        url: 'http://localhost:3001/api/admissions/admission_form',
        method: 'POST',
        body: { ...admissionFormData, formState: data.formState, basicInformation: senders_id }
    }).then(response => {
        localStorage.setItem('createdAt', dayjs(response.body.createdAt).format('DD.MM.YYYY HH:mm:ss'))
        const createdAt = localStorage.createdAt
        created_at = createdAt.replace(/['"]+/g,'')
        return response
    }
    )
})

Cypress.Commands.add('form_request', (url, formData) => {
    const user = JSON.parse(localStorage.user)

    return cy
        .server()
        .route('POST', url)
        .as('formRequest')
        .window()
        .then(win => {
            var xhr = new win.XMLHttpRequest()
            xhr.open('POST', url)
            xhr.setRequestHeader('x-access-token', user.accessToken)
            xhr.send(formData)
        })
        .wait('@formRequest')
})

Cypress.Commands.add('sendAttachment', ( { id, whichFile } ) => {
    const fileName = testPdfName

    cy.fixture(fileName, 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then((blob) => {

            // Build up the form
            const formData = new FormData()

            const filesInfo = [{ name: fileName, whichFile: whichFile }]

            formData.append('filesInfo', JSON.stringify(filesInfo))
            formData.append('files', blob, fileName)

            // Perform the request
            cy.form_request('http://localhost:3001/api/thl/admissions/admission_form_attachment/'+id, formData)
        })


})

Cypress.Commands.add('loginAsThlRole', () => {

    const loggedInUser = { username: 'Tero Testaaja', role: 'THL' }

    return cy.request({
        url: 'http://localhost:3001/api/thl/auth/login',
        method: 'POST',
        body: { ...loggedInUser },
    }).then(res => {
        if(res.body.accessToken) {
            localStorage.setItem('user', JSON.stringify(res.body))
        }
        return res.body
    }
    )
})


Cypress.Commands.add('loginAsReseachUnitRole', () => {

    const loggedInUser = { username: 'Tiina Testaaja', role: 'Niuvanniemen sairaala' }

    return cy.request({
        url: 'http://localhost:3001/api/thl/auth/login',
        method: 'POST',
        body: { ...loggedInUser },
    }).then(res => {
        if(res.body.accessToken) {
            localStorage.setItem('user', JSON.stringify(res.body))
        }
        return res.body
    }
    )
})

Cypress.Commands.add('sendEditedForm', ( data ) => {

    return cy.request({
        url: `http://localhost:3001/api/admissions/admission_form/${data.id}/edit`,
        method: 'PUT',
        id: data.id,
        body: data.updatedForm,
    }).then(response => {
        return response
    }
    )
})

Cypress.Commands.add('setShortLoginToken', () => {

    return cy.request({
        url: 'http://localhost:3001/tests/short_token',
        method: 'POST',
        body: { 'user': 'cypress', 'role': 'THL' }
    }).then(response => {
        const user = response.body
        localStorage.setItem('user', JSON.stringify(user))
    })
})

Cypress.Commands.overwrite('click', (originalFn, selector, options = {}) => {
    options.force = true
    return originalFn(selector, options) })
