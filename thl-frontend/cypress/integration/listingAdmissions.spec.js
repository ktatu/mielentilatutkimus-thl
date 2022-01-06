/* eslint-disable no-undef */
var created_at = ''

const login = (role) => {

    if(role === 'THL') {
        cy.loginAsThlRole()
        cy.wait(1000)
    }

    if(role === 'Toimintayksikkö') {
        cy.loginAsReseachUnitRole()
        cy.wait(1000)
    }
}

before(function() {
    cy.emptyDatabase()
    cy.wait(1000)

    cy.sendBasicInformation()

    login('THL')

    cy.wait(1000)

    cy.sendAdmissionForm({
        formState: 'Odottaa tarkistusta',
        prosecuted : false
    })
    cy.wait(1000)

    cy.sendAdmissionForm({
        formState: 'Pyyntö saapunut'
    })
    cy.wait(1000)

    cy.sendAdmissionForm({
        formState: 'Saatu lisätietoja',
        prosecuted: true,
    }).then((res) => {
        const createdAt = localStorage.createdAt
        created_at = createdAt
        cy.sendAttachment({
            id: res.body.id,
            whichFile: 'valituomio'
        })
        cy.sendAttachment({
            id: res.body.id,
            whichFile: 'poytakirja'
        })
    })
})

describe('Redirect to login page occurs when', () => {

    it('user has not logged in', () => {
        localStorage.removeItem('user')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.contains('Kirjaudu sisään')
    })

    it('token has expired', () => {
        cy.setShortLoginToken()
        cy.wait(6000)

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.contains('Kirjaudu sisään')
    })
})

describe('All admissions can be viewed', () => {

    it('New admission can be viewed', function () {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.contains('Mielentilatutkimuspyynnöt')

        cy.get('a').last().click()

        cy.contains('Tutkittavan henkilön yleistiedot')
        cy.contains('Reijo')

        cy.get('#handleShowLessInfo').click()
        cy.contains('Mielentilatutkimuspyynnöt')
    }
    )

    it('If prosecuted is false extra fields are shown',function() {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.get('a').first().click()

        cy.contains('Jos syytettä ei ole nostettu, syytteen nostamisen määräaika:')
        cy.contains('Jos syytettä ei ole nostettu, esitutkinnan suorittava poliisilaitos:')
    })

    it('If prosecuted is true extra fields are hidden', function() {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.get('a').last().click()
        cy.get('prosecutionDeadLine').should('not.exist')
        cy.get('preTrialPoliceDepartment').should('not.exist')
    })

})


describe('Sorting forms', () => {
    it('Sort by state sorts correctly', function () {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')

        cy.contains('Odottaa tarkistusta')
        cy.get('#sortState').click()
        cy.wait(200)

        cy.get('#admissionsListRow').first().contains('Odottaa tarkistusta')
        cy.get('#sortState').click()
        cy.wait(200)

        cy.get('#admissionsListRow').first().contains('Odottaa tarkistusta').should('not.exist')
        cy.get('#admissionsListRow').first().contains('Saatu lisätietoja')

    })

    it('Sort by time sorts correctly', function () {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')

        cy.contains(created_at)
        cy.get('#sortTime').click()
        cy.wait(200)

        cy.get('#admissionsListRow').first().contains(created_at)
        cy.get('#sortTime').click()
        cy.wait(200)

        cy.get('#admissionsListRow').first().contains(created_at).should('not.exist')
    })

    it('The state of the form can be changed', function () {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')

        cy.contains('Mielentilatutkimuspyynnöt')

        cy.get('a').last().click()

        cy.get('#selectState').click()
        cy.get('#1')
            .contains('Pyyntö tarkastelussa')
            .click()

        cy.wait(200)

        cy.get('#updateFormState').click()
        cy.contains('Pyyntö tarkastelussa')

        cy.get('#handleShowLessInfo').click()
        cy.contains('Mielentilatutkimuspyynnöt')

        cy.get('a').last().click()
        cy.contains('Pyyntö tarkastelussa')

    })

    it('Listing view shows states correctly', function () {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')

        cy.get('a').first().click()
        cy.get('#selectState').click()
        cy.get('#2')
            .contains('Pyydetty lisätietoja')
            .click()

        cy.get('#updateFormState').click()
        cy.get('#handleShowLessInfo').click()
        cy.get('#formState').first().contains('Pyydetty lisätietoja')

        cy.get('a').first().click()
        cy.get('#selectState').click()
        cy.get('#3')
            .contains('Saatu lisätietoja')
            .click()

        cy.get('#updateFormState').click()
        cy.get('#handleShowLessInfo').click()

        cy.get('#formState').first().contains('Saatu lisätietoja')
    })
})

describe('Asking for additional information from form sender', () => {
    it('Additional information can be asked', function () {

        cy.request('DELETE', 'http://localhost:1080/email/all').then((res) => {
            expect(res.status).equal(200)
        })

        login('THL')
        cy.visit('http://localhost:3002/thl/thl-admissions')

        cy.get('a').first().click()
        cy.get('#handleAdditionalInfo').click()
        cy.get('#inputForAdditionalInfo').type('Diaarinumero, sijainti sekä prosessiosoite ovat virheellisessä muodossa')
        cy.get('#sendAdditionalInfo').click()
        cy.wait(1000)
        cy.contains('Muokkauspyyntö lähetetty')
    })

    it('Additional information can be added', function () {

        cy.wait(1000)
        login('THL')

        var admissionId = ''

        cy.request('GET', 'http://localhost:1080/email').then((emails) => {
            assert.equal(emails.body[0].subject, 'Mielentilatutkimuspyyntö vaatii lisätietoja')
            expect(emails.body[0].text.includes('Diaarinumero, sijainti sekä prosessiosoite ovat virheellisessä muodossa'))

            const parts = emails.body[0].text.split('/')
            const id_from_email = parts[parts.length-2].replace('\n','').replace('edit','').replace(/['"]+/g,'').trim()
            localStorage.setItem('admission_id', JSON.stringify(id_from_email))
            admissionId = localStorage.admission_id.replace(/['"]+/g,'')

        }).then(() => {

            const updatedForm = { diaariNumber: '119/10/22', location: 'Kouvola', processAddress: 'Koulutie 4A' }

            cy.sendEditedForm({
                id: admissionId,
                updatedForm: updatedForm,
            })
            cy.wait(1000)
        })
    })

    it('THL can see updated form', function(){

        login('THL')
        cy.visit('http://localhost:3002/thl/thl-admissions')

        cy.get('a').first().click()
        cy.contains('119/10/22')
        cy.contains('Kouvola')
        cy.contains('Koulutie 4A')
        cy.wait(2000)
    })
})

describe('Attachments', () => {
    it('Pdf attachments are listed and can be opened', function ()  {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')

        cy.get('a').last().click()
        cy.get('.MuiButton-text').first().click()
        cy.wait(1000)

        cy.contains('This is a test pdf :)')
        cy.contains('random text that should not exist :)').should('not.exist')

        cy.get('#next').click()
        cy.wait(1000)

        cy.contains('two pages!')
        cy.contains('random text that should not exist :)').should('not.exist')

    })

    it('A new attachements can be added to the form', function () {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.get('a').last().click()
        cy.get('#handleAddAttachment').click()
        cy.fixture('test_pdf.pdf', 'binary')
            .then(Cypress.Blob.binaryStringToBlob)
            .then(fileContent => {
                cy.get('input[type="file"]').eq(3).attachFile({
                    fileContent,
                    fileName: 'test_pdf.pdf',
                    whichFile: 'Rikosrekisteriote'
                })
            })

        cy.get('#uploadFiles').click()
        cy.contains('Liitteet lisätty')
        cy.wait(1000*7)
        cy.get('.MuiButton-root').contains('rikosrekisteriote')

    })
}
)

describe('Send to research unit', () => {
    it('Sending a request to research unit can be done and it changes form state to "Tutkimuspaikka pyydetty"', function ()  {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')

        cy.get('a').last().click()
        cy.get('#handleSendToOperatingUnit').click()
        cy.wait(1000)

        cy.get('#selectResearchUnit').click()
        cy.get('#0')
            .click()

        cy.get('#inputForInfoForResearchUnit').type('Oikeuslaitos toivoo tutkimuksen suoritusta ennen 1.1.2022.')
        cy.get('#buttonSendToResearchUnit').click()
        cy.contains('Tutkimuspaikkapyyntö lähetetty onnistuneesti')
        cy.wait(1000*6)
        cy.get('#showState').contains('Tutkimuspaikka pyydetty')
    })
}
)


describe('Event history can be viewed when role is "THL"', () => {
    it('Event history can be viewed', function() {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.get('a').last().click()
        cy.get('.MuiTab-root').last().click()
        cy.wait(1000)
        cy.contains('Tapahtuma-aika')

    })

    it('Event history can be sorted by event time', function () {

        login('THL')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.get('a').last().click()
        cy.get('.MuiTab-root').last().click()
        cy.get('#eventListRow').contains('Tutkimuspyyntö tallennettu')
        cy.get('#sortEventTime').click()
        cy.wait(1000)
        cy.get('#eventListRow').contains('Tutkimuspyyntö tallennettu').should('not.exist')
    })
})

describe('Reseach unit role', () => {

    it('Statement view can be viewed', function() {

        login('Toimintayksikkö')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.wait(1000)

        cy.get('a').last().click()
        cy.get('.MuiTab-root').last().click()
        cy.wait(1000)

        cy.contains('Mielentilalausunto:')
    })

    it('Some options are limited', function() {

        login('Toimintayksikkö')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.wait(1000)

        cy.get('a').last().click()
        cy.should('not.contain', 'Päivitä lomakkeen tilaa:')
        cy.should('not.contain', 'Pyydä lisätietoja')
        cy.should('not.contain', 'Lähetä tutkimuspaikkapyyntö')

        cy.get('#handleAdditionalInfo').should('not.exist')
        cy.get('#handleSendToOperatingUnit').should('not.exist')
    })

    it('Form listing view only shows the forms for a specific research unit', function() {

        login('Toimintayksikkö')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.wait(1000)

        cy.get('a').first().click()
        cy.contains('Tutkimuspaikka:')
        cy.contains('Niuvanniemen sairaala')

        cy.get('a').last().click()
        cy.contains('Tutkimuspaikka:')
        cy.contains('Niuvanniemen sairaala')
    })

    it('Statement draft can be saved', function() {

        login('Toimintayksikkö')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.wait(1000)

        cy.get('a').last().click()
        cy.get('.MuiTab-root').last().click()
        cy.wait(1000)

        const content = ['Teksti1', 'Teksti2', 'Teksti3', 'Teksti4', 'Teksti5', 'Teksti6', 'Teksti7', 'Teksti8', 'Teksti9',
            'Teksti10', 'Teksti11', 'Teksti12', 'Teksti13', 'Teksti14']

        cy.get('#1').type(content[0])
        cy.get('#2').type(content[1])
        cy.get('#3').type(content[2])
        cy.get('#4').type(content[3])
        cy.get('#5').type(content[4])
        cy.get('#6').type(content[5])
        cy.get('#7').type(content[6])
        cy.get('#8').type(content[7])
        cy.get('#9').type(content[8])
        cy.get('#10').type(content[9])
        cy.get('#11').type(content[10])
        cy.get('#12').type(content[11])
        cy.get('#13').type(content[12])
        cy.get('#14').type(content[13])

        cy.get('#saveDraft').click()

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.wait(1000)

        cy.get('a').last().click()
        cy.get('.MuiTab-root').last().click()
        cy.wait(1000)

        content.forEach(function (value) {
            cy.contains(value)
        })
    })

    it('Statement can be previewed', function() {

        login('Toimintayksikkö')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.wait(1000)

        cy.get('a').last().click()
        cy.get('.MuiTab-root').last().click()
        cy.wait(1000)

        cy.get('#preview').click()
        cy.wait(1000)

        const content = ['Teksti1', 'Teksti2', 'Teksti3', 'Teksti4', 'Teksti5', 'Teksti6', 'Teksti7', 'Teksti8', 'Teksti9',
            'Teksti10', 'Teksti11', 'Teksti12', 'Teksti13', 'Teksti14']

        content.forEach(function (value) {
            cy.contains(value)
        })

    })
    it('Statement is not submitted if user do not confirm sending', function() {

        login('Toimintayksikkö')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.wait(1000)

        cy.get('a').last().click()
        cy.get('.MuiTab-root').last().click()
        cy.wait(1000)

        cy.get('#sendStatement').click()
        cy.get('#abortSending').click()

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.get('a').should('exist')

    })
    it('Statement can be submitted after confirming sending', function() {

        login('Toimintayksikkö')

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.wait(1000)

        cy.get('a').last().click()
        cy.get('.MuiTab-root').last().click()
        cy.wait(1000)

        cy.get('#sendStatement').click()
        cy.get('#confirmSending').click()

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.get('a').should('not.exist')
    })
})
