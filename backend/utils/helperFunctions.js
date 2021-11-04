const config = require('../utils/config')
const emailValidator = require('email-validator')

const emailOnListOfAllowedDomains = (email) => {
    const domain_part = email.split('@')[1]
    return config.ALLOWED_SENDER_EMAIL_DOMAIN.includes(domain_part)
}

const valdidateEmailAddress = (email) => {
    return emailValidator.validate(email) && emailOnListOfAllowedDomains(email)
}

const validateBasicInformationData = (basicInformationForm) => {
    return valdidateEmailAddress(basicInformationForm.sendersEmail)
}

const validateAdmissionFormData = (admissionForm) => {
    return valdidateEmailAddress(admissionForm.assistantsEmail) &&
    valdidateEmailAddress(admissionForm.legalGuardianEmail)
}

module.exports = {
    validateBasicInformationData,
    validateAdmissionFormData
}