const AdmissionForm = require('../models/admissionForm.model.js')
const BasicInformationForm = require('../models/basicInformationForm.model.js')

const admission_form_input = {
    // using default value for formState
    //basicInformation id
    basicInformationId: '',
    admissionNoteDate: '',
    formSender: '',
    name: '',
    lastName: '',
    identificationNumber: '',
    address: '',
    location: '',
    processAddress: '',
    trustee: '',
    citizenship: '',
    // THL more information
    hazardAssesment: false,
    diaariNumber: '',
    datePrescribedForPsychiatricAssesment: '',
    nativeLanguage: '',
    desiredLanguageOfBusiness: '',
    municipalityOfResidence: '',
    prosecuted: false,
    deadlineForProsecution: '',
    pretrialPoliceDepartment: '',
    emailFromTheDirectorOfInvestigations: '',
    phoneNumberFromTheDirectorOfInvestigations: '',
    addressFromTheDirectorOfInvestigations: '',
    crime: '',
    crimes: '',
    assistantEmail: '',
    asssistantPhoneNumber: '',
    assisstantsAddress: '',
    legalGuardianEmail: '',
    legalGuardianPhoneNumber: '',
    legalGuardianAddress: '',
    legalGuardianInstitute: '',
    appealedDecision: '',
    // TBD: attachments: ,
    conclusionIsReady: false,
    proceedingIsReady: false,
    applicationForASummonsIsReady: false,
    transcriptOfCriminalRecordIsReady: false,
    preliminaryInvestigationsAttachmentsAreReady: false,
    decisionOnDetentionIsReady: false,
    imprisonmentRequirementReady: false
}

const basic_information_input = {
    admissionNoteSenderOrganization: 'org',
    admissionNoteSender: 'sender',
    sendersEmail: 'smth@email.yes',
    sendersPhoneNumber: '0351254536',
    attachements: []
}

const admissionsInDb = async () => {
    const admis = await AdmissionForm.find({})
    return admis.map(a => a.toJSON())
}

const basicsInDb = async () => {
    const basics = await BasicInformationForm.find({})
    return basics.map(a => a.toJSON())
}

module.exports = {
    admission_form_input, basic_information_input, admissionsInDb, basicsInDb
}