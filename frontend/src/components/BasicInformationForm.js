import React, { useState } from 'react'
import basicInformationService from '../services/basicInformationService'
import { Paper, Grid, Button, TextField, Typography } from '@mui/material'
import validator from 'validator'
import { useStyles } from '../styles'

import useMessage from '../utils/messageHook'
import Messages from './Messages'

const BasicInformationForm = () => {

    const [formValues, setFormValues] = useState({})

    const msg = useMessage()

    document.title = 'Perustietolomake'

    const textFieldChange = event => {
        const changedField = event.target.name
        const changedValue = event.target.value

        setFormValues((formValues) => (
            { ...formValues, [changedField]: changedValue }
        ))
    }

    const validateSendersEmail = () => {
        if (!validator.isEmail(formValues.email)) {
            console.log('virheellinen email')
            msg.setErrorMsg('Virheellinen sähköpostiosoite!', 7)
            return false
        }
        return true
    }

    const validateEmail = ( email ) => {
        return !validator.isEmail(email + '')
    }

    const validateField = ( field ) => {
        if (!field) {
            return true
        }
        return validator.isEmpty(field)
    }

    const addBasicInformations = (event) => {
        event.preventDefault()

        if (!validateSendersEmail()) {
            return
        }

        if (!msg.errorMessagesNotEmpty()) {
            // formValues could change between sending request and response from backend, so email address is saved in var for msg
            const emailAddress = formValues.email
            basicInformationService
                .create(formValues)
                .then(response => {
                    console.log(response.data)
                    msg.setMsg(`Perustietojen lähettäminen onnistui! Linkki mielentilatutkimuspyynnön luomiseen lähetetty osoitteeseen: ${emailAddress}`, 7)
                    setFormValues({})

                })
                .catch(() => {
                    msg.setErrorMsg('Perustietojen lähettämisessä tapahtui virhe!', 7)
                })
        }
    }

    const classes = useStyles()

    return (
        <div className={classes.page}>

            {(msg.messagesNotEmpty && <Messages msgArray={msg.messages} severity='success' />)}
            {(msg.errorMessagesNotEmpty && <Messages msgArray={msg.errorMessages} severity='error' />)}

            <div style={{
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px'
            }}>
                <Typography variant={'h4'}>Lähettäjän perustiedot</Typography>
                <Typography variant={'body2'}>Lähetä perustiedot niin saat sähköpostiosoitteeseen linkin, jonka kautta pääset täyttämään mielentilatutkimuspyynnön.</Typography>

            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>

                <Paper
                    className={classes.form}
                    variant='outlined'
                    square={false}
                    align='center'
                    justify='center'
                >
                    <form onSubmit={addBasicInformations}>
                        <Grid
                            container spacing={1}
                        >
                            <Grid item xs={6}>
                                <TextField name='sender' id='setAdmissionNoteSender' value={formValues.sender || ''} onChange={textFieldChange}
                                    label='Nimi' variant='standard' margin='normal'
                                    required error={validateField(formValues.sender)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField name='organization' id='setadmissionNoteSendingOrganization' value={formValues.organization || ''} onChange={textFieldChange}
                                    label='Taho' variant='standard' margin='normal'
                                    required error={validateField(formValues.organization)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField name='email' id='setSendersEmail' value={formValues.email || ''} onChange={textFieldChange}
                                    label='Sähköposti' variant='standard' margin='normal'
                                    required error={validateEmail(formValues.email)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField name='phoneNumber' id='setSendersPhoneNumber' value={formValues.phoneNumber || ''} onChange={textFieldChange}
                                    label='Puhelinnumero' variant='standard' margin='normal'
                                    required error={validateField(formValues.phoneNumber)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button id='createBasicInformationsButton' type='submit' variant='outlined'>lähetä</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </div>
        </div>
    )
}

export default BasicInformationForm