const AdmissionForm = require('../models/admissionForm.model.js')
const IdSerializer = require('./idSerializer')

const getAllAdmissions = async () => {
    const admissionForms = await AdmissionForm.find({}).select('thlRequestId formState createdAt updatedAt')
    return admissionForms.map((admissionform) => admissionform.toJSON())
}

const getAdmissionsByResearchUnit = async (researchUnit) => {

    const admissionForms = await AdmissionForm.find({researchUnit: (researchUnit), formState: ('Tutkimuspaikka pyydetty')}).select('thlRequestId formState createdAt updatedAt')
    return admissionForms.map((admissionform) => admissionform.toJSON())
}

const saveAdmission = async (data) => {
    const form = new AdmissionForm(
        { ...data }
    )
    const prevAdmission = await AdmissionForm.findOne().sort({ createdAt: 'descending' })
    const prevId = prevAdmission == null ? -1 : prevAdmission.thlRequestId

    form.thlRequestId = IdSerializer.getNextThlRequestId(prevId)

    const savedForm = await form.save()
    await savedForm.populate('basicInformation')
    
    savedForm.log({
        action: 'save_admission_form',
        category: 'admission_form',
        createdBy: data.basicInformation.sender ? data.basicInformation.sender : 'undefined',
        createdByRole: data.basicInformation.organization ? data.basicInformation.organization : 'undefined',
        message: 'Tutkimuspyyntö tallennettu',
    })

    return savedForm.toJSON()
}

const getAdmission = async (id, username, role) => {
    const form = await AdmissionForm.findById(id).populate('attachments', { fileName: 1, whichFile: 1 }).populate('basicInformation')

    form.log({
        action: 'get_admission_form',
        category: 'admission_form',
        createdBy: username ? username : form.sender,
        createdByRole: role ? role : 'undefined',
        message: 'Tutkimuspyyntö avattu'
    })
    return form.toJSON()
}

const getAdmissionForEdit = async (id) => {
    const form = await AdmissionForm.findById(id)
        .select('basicInformation formState')
    await form.populate('basicInformation')

    form.log({
        action: 'get_admission_form',
        category: 'admission_form',
        createdBy: form ? form.basicInformation.sender : 'user not found',
        createdByRole: form ? form.basicInformation.organization : 'undefined',
        message: 'Tutkimuspyynnön lähettäjän tiedot haettu lisätietojen täydennystä varten'
    })

    return form.toJSON()
}

const updateAdmission = async (id, data, username, role) => {

    const form = await AdmissionForm.findById(id).populate('attachments', { fileName: 1, whichFile: 1 })
   
    for (var [key, value] of Object.entries(data)) {
        form[key] = value
    }

    await form.save()

    form.log({
        action: 'update_admission_form',
        category: 'admission_form',
        createdBy: username ? username : 'anonymous',
        createdByRole: role ? role : 'undefined',
        message: 'Tutkimuspyyntö päivitetty',
    })
    return form
}

module.exports = { getAllAdmissions, getAdmission, getAdmissionForEdit, saveAdmission, updateAdmission, getAdmissionsByResearchUnit }