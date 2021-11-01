/* eslint-disable no-undef */
var created_at = ''

before(function() {
    cy.emptyDatabase()
    cy.wait(1000)

    cy.sendBasicInformation()
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
        prosecuted : true
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


describe('All admissions can be viewed', () => {

    it('New admission can be viewed', function () {

        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.contains('Mielentilatutkimuspyynnöt')

        cy.get('a').last().click()

        cy.contains('Tutkittavan henkilön yleistiedot')
        cy.contains('Reijo')
        cy.contains('Tomi Tuomari')

        cy.get('#handleShowLessInfo').click()
        cy.contains('Mielentilatutkimuspyynnöt')
    }
    )

    it('If prosecuted is false extra fields are shown',function() {
        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.get('a').first().click()

        cy.contains('Jos syytettä ei ole nostettu, syytteen nostamisen määräaika:')
        cy.contains('Jos syytettä ei ole nostettu, esitutkinnan suorittava poliisilaitos:')
    })

    it('If prosecuted is true extra fields are hidden', function() {
        cy.visit('http://localhost:3002/thl/thl-admissions')
        cy.get('a').last().click()
        cy.get('prosecutionDeadLine').should('not.exist')
        cy.get('preTrialPoliceDepartment').should('not.exist')
    })

    it('Sort by state sorts correctly', function () {

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

    it('Pdf attachments are listed and can be opened', function ()  {

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

}
)
