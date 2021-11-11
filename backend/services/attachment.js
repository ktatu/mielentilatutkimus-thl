const AttachmentForm = require('../models/attachmentForm.model.js')
const AdmissionForm = require('../models/admissionForm.model.js')

async function attachFile(admissionFormId, files, filesInfo) {
    const parsedFilesInfo = JSON.parse(filesInfo)

    files.forEach(file => {
        const attachmentForm = new AttachmentForm({
            admissionFormId: admissionFormId,
            fileName: file.originalname,
            fileData: file.buffer,
            whichFile: parsedFilesInfo.find(fileInfo => fileInfo.name === file.originalname).whichFile
        })

        attachmentForm.save().then(savedFile => AdmissionForm.findByIdAndUpdate(
            admissionFormId,
            {
                $push: {
                    attachments: {
                        _id: savedFile._id
                    }
                }
            }
        ))
    })
}

module.exports = { attachFile }