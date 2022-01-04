/*eslint-disable no-undef */

import React, { useState } from 'react'
import admissionService from '../services/admissionService'
import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import BasicInformation from './BasicInformation'
import basicInformationService from '../services/basicInformationService'
import { Paper, Grid, Button, TextField, FormControl, Select, MenuItem, Typography, FormHelperText } from '@mui/material'
import DateAdapter from '@mui/lab/AdapterDayjs'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import validator from 'validator'
import { useStyles } from '../styles'
import useMessage from '../utils/messageHook'
import Messages from './Messages'

const NotProsecuted = (props) => {
    if (props.prosecuted === false){
        return (
            <span>
                <Grid item xs={5,5}>
                    <TextField fullWidth
                        name='preTrialPoliceDepartmentChange'
                        helperText='Jos syytettä ei ole nostettu, esitutkinnan suorittava poliisilaitos' id='preTrialPoliceDepartment'
                        onChange={props.handlePreTrialPoliceDepartmentChange} variant='outlined' margin='normal' />
                </Grid>
                <Grid item xs={5,5}>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <DesktopDatePicker
                            name='deadlineForProsecution'
                            InputProps={{
                                disableUnderline: true,
                            }}
                            inputFormat="DD/MM/YYYY"
                            value={props.deadlineForProsecution}
                            onChange={props.handleDeadlineForProsecutionChange}
                            renderInput={(params) => <TextField id='deadlineDate' variant='filled' {...params} />}
                        />
                        <FormHelperText>Syytteen nostamisen määräaika</FormHelperText>
                    </LocalizationProvider>
                </Grid>
            </span>
        )
    }
    else {
        return (
            <div>
            </div>
        )
    }
}

const Form = () => {
    const basicInformationId = useParams().id
    const paramFormId = useParams().id
    const [senderInfo, setSenderInfo] = useState(null)
    const [formVisible, setFormVisible] = useState(true)
    const [formId, setFormId] = useState('')
    const [formState, setFormState] = useState(null)

    const [formValues, setFormValues] = useState({ preTrialPoliceDepartment: '' })
    const [datePrescribedForPsychiatricAssesment, setDatePrescribedForPsychiatricAssesment] = useState('')
    const [deadlineForProsecution, setDeadlineForProsecution] = useState('')

    const hideWhenVisible = { display: formVisible ? 'none' : '' }
    const showWhenVisible = { display: formVisible ? '' : 'none' }

    const toggleVisibility = () => {
        if(!msg.errorMessagesNotEmpty()){
            setFormVisible(!formVisible)
        }
    }

    const classes = useStyles()

    if (window.location.toString().includes('edit')){
        useEffect(() => {
            admissionService.getForEdit(paramFormId).then(res => {
                setSenderInfo(res)
                setFormState(res.formState)
            })
        }, [])

    } else {
        useEffect(() => {
            basicInformationService.get(basicInformationId).then(res => {
                setSenderInfo(res)
            })
        }, [])
    }

    const msg = useMessage()

    document.title = 'Mielentilatutkimuspyyntö'

    const handleFormChange = event => {
        const changedField = event.target.name
        const newValue = event.target.value

        setFormValues((formValues) => (
            { ...formValues, [changedField]: newValue }
        ))
    }

    const getFormValuesAndBasicId = () => ({
        ...formValues,
        datePrescribedForPsychiatricAssesment: datePrescribedForPsychiatricAssesment,
        deadlineForProsecution: deadlineForProsecution,
        basicInformation: senderInfo.id
    })

    const handleDatePrescribedForPsychiatricAssesment = (newValue) => {
        setDatePrescribedForPsychiatricAssesment(newValue)
    }
    const handleDeadlineForProsecutionChange = (newValue) => {
        setDeadlineForProsecution(newValue)
    }

    const isValidEmailAddress = (formField) => {
        const formValue = formValues[formField]
        // only validated if field has been filled, it's not required
        if (!formValue) {
            return true
        }
        if (formValue > 0 && !validator.isEmail(formValue)) {
            return false
        }
        return true
    }

    const updatePerson = (event) => {

        event.preventDefault()

        if(formState === 'Pyydetty lisätietoja') {

            if (!isValidEmailAddress('assistantsEmail') || !isValidEmailAddress('legalGuardianEmail')) {
                msg.setErrorMsg('Tarkista syöttämiesi sähköpostiosoitteiden oikeellisuus', 7)
                return            admissionService
                .update(paramFormId, updateAdmission)
                .then(response => {
                    setFormId(response.data.id)
                    toggleVisibility()
                })
                .catch(() => {
                    msg.setErrorMsg('Mielentilatutkimuspyynnön muokkaamisessa tapahtui virhe!', 7)
                })
            }

            const updateAdmission = {
                formState : 'Saatu lisätietoja',
                name: name,
                lastname: lastname,
                identificationNumber: identificationNumber,
                address: address,
                location: location,
                processAddress: processAddress,
                trustee: trustee,
                citizenship: citizenship,
                hazardAssesment: hazardAssesment,
                diaariNumber: diaariNumber,
                datePrescribedForPsychiatricAssesment: datePrescribedForPsychiatricAssesment,
                nativeLanguage: nativeLanguage,
                desiredLanguageOfBusiness: desiredLanguageOfBusiness,
                municipalityOfResidence: municipalityOfResidence,
                prosecuted: prosecuted,
                deadlineForProsecution: deadlineForProsecution,
                preTrialPoliceDepartment: preTrialPoliceDepartment,
                crime: crime,
                crimes: crimes,
                assistantsEmail: assistantsEmail,
                assistantsPhonenumber: assistantsPhonenumber,
                assistantsAddress: assistantsAddress,
                legalGuardianEmail: legalGuardianEmail,
                legalGuardianPhonenumber: legalGuardianPhonenumber,
                legalGuardianAddress: legalGuardianAddress,
                legalGuardianInstitute: legalGuardianInstitute,
                appealedDecision: appealedDecision,
                researchUnit: '',
                researchUnitInformation: ''
            }

            for (const value in updateAdmission) {

                if (
                    updateAdmission[value] === null ||
                updateAdmission[value] === undefined ||
                updateAdmission[value] === ''
                ) {
                    delete updateAdmission[value]
                }
            }

            admissionService
                .update(paramFormId, updateAdmission)
                .then(response => {
                    setFormId(response.data.id)
                    toggleVisibility()
                })
                .catch(() => {
                    msg.setErrorMsg('Mielentilatutkimuspyynnön muokkaamisessa tapahtui virhe!', 7)
                })
            
        } else {
            msg.setErrorMsg('Lisätietoja ei olla pyydetty', 7)
        }
    }

    const addPerson = (event) => {

        if (window.location.toString().includes('edit')){
            updatePerson(event)
        }
        else {
            event.preventDefault()


            if (!isValidEmailAddress('assistantsEmail') || !isValidEmailAddress('legalGuardianEmail')) {
                msg.setErrorMsg('Tarkista syöttämiesi sähköpostiosoitteiden oikeellisuus', 7)
                return
            }

            admissionService
                .create(getFormValuesAndBasicId())
                .then(response => {
                    setFormId(response.data.id)
                    toggleVisibility()
                    setFormValues({})
                })
                .catch(() => {
                    msg.setErrorMsg('Mielentilatutkimuspyynnön lähettämisessä tapahtui virhe!', 7)
                })
        }
    }

    const getSubmittedMessage = () => {

        var message = 'Pyyntö lähetettiin onnistuneesti!'

        if (formState !== null){
            message = 'Muokatut tiedot lähetetty!'
        }
        return (<p>{message}</p>)
    }


    return (

        <div>
            <div style={showWhenVisible}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Paper
                        className={classes.form}
                        variant='outlined'
                        square={false}
                        align='left'
                        justify='center'
                    >
                        <br></br>
                        <br></br>
                        <Typography variant={'h4'}>Mielentilatutkimuspyyntö</Typography>
                        <br></br>
                        <div>
                          Lomake on tarkoitettu mielentilatutkimuspyynnön lähettämiseen Terveyden- ja hyvinvoinnin laitokselle (THL).
                        </div>
                        <br></br>
                        <br></br>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'left' }}>
                            {(senderInfo && <BasicInformation basicInformation={senderInfo} />)} </div>
                        <br></br>
                        <br></br>

                        <Typography variant={'h5'}>Tutkittavan henkilön yleistiedot:</Typography>
                        <p></p>
                        <form onSubmit={addPerson}>
                            <Grid
                                container
                                rowSpacing={2}
                            >
                                <Grid item xs={5,5} >
                                    <TextField fullWidth
                                        name='name' helperText='Etunimet' id='name' value={formValues.name || ''}
                                        onChange={handleFormChange}  variant='outlined' margin='normal'/>
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='lastname' helperText='Sukunimi' id='lastname' value={formValues.lastname || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='identificationNumber' helperText='Henkilötunnus' id='identificationNumber' value={formValues.identificationNumber || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='address' helperText='Kotiosoite' id='address' value={formValues.address || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='location' helperText='Sijainti' id='location' value={formValues.location || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='processAddress' helperText='Prosessiosoite' id='processAddress' value={formValues.processAddress || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='trustee' helperText='Edunvalvoja' id='trustee' value={formValues.trustee || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='citizenship' helperText='Kansalaisuus' id='citizenship' value={formValues.citizenship || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                            </Grid>
                            <br></br>
                            <Typography variant={'h5'}>Mielentilatutkimuslomake:</Typography>
                            <p></p>
                            <Grid
                                container rowSpacing={2}
                                columnSpacing={{ xs: 2 }}
                            >
                                <Grid item xs={5,5}>
                                    <FormControl>
                                        <Select
                                            name='hazardAssesment'
                                            onChange={handleFormChange}
                                            value={formValues.hazardAssesment || false}
                                            variant = 'outlined'
                                            id='selectHazardAssesment'>
                                            <MenuItem id='0' value={true}> Kyllä</MenuItem>
                                            <MenuItem id='1' value={false}>Ei</MenuItem>
                                        </Select>
                                        <FormHelperText>Halutaanko lisäksi vaarallisuusarvio?</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <LocalizationProvider dateAdapter={DateAdapter}>
                                        <DesktopDatePicker
                                            InputProps={{
                                                disableUnderline: true,
                                            }}
                                            inputFormat="DD/MM/YYYY"
                                            value={datePrescribedForPsychiatricAssesment}
                                            onChange={handleDatePrescribedForPsychiatricAssesment}
                                            renderInput={(params) => <TextField name='datePrescribedForPsychiatricAssesment' id='date-picker' variant='filled' {...params} />}
                                        />
                                        <FormHelperText>Päivämäärä, jolla oikeus on määrännyt tutkittavan mielentilatutkimukseen</FormHelperText>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='diaariNumber' helperText='Diaarinumero' id='diaariNumber' value={formValues.diaariNumber || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='nativeLanguage' helperText='Tutkittavan äidinkieli'id='nativeLanguage' value={formValues.nativeLanguage || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='desiredLanguageOfBusiness' helperText='Tutkittavan toivoma asiointikieli' id='desiredLanguageOfBusiness'
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='municipalityOfResidence' helperText='Tutkittavan kotikunta' id='municipalityOfResidence' value={formValues.municipalityOfResidence || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <FormControl >
                                        <Select
                                            name='prosecuted'
                                            onChange={handleFormChange}
                                            value={formValues.prosecuted || false}
                                            variant = 'outlined'
                                            id='selectIfProsecuted'>
                                            <MenuItem id='0' value={true}> Kyllä</MenuItem>
                                            <MenuItem id='1' value={false}>Ei</MenuItem>
                                        </Select>
                                        <FormHelperText>Onko syyte nostettu</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={12} >
                                    <NotProsecuted
                                        formValues = {formValues}
                                        prosecuted = {formValues.prosecuted || false}
                                        deadlineForProsecution = {deadlineForProsecution}
                                        handleDeadlineForProsecutionChange = {handleDeadlineForProsecutionChange}
                                        preTrialPoliceDepartment = {formValues.preTrialPoliceDepartment}
                                        handlePreTrialPoliceDepartmentChange = {handleFormChange}
                                    />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='crime' helperText='Vakavin teko (päätös tai välituomio)'id='crime' value={formValues.crime || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='crimes' helperText='Muut kyseessä olevat teot, joista mielentilatutkimusta pyydetään' id='crimes' value={formValues.crimes || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='assistantsEmail' helperText='Tutkittavan avustajan sähköposti' id='assistantsEmail' value={formValues.assistantsEmail || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal'
                                    />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='assistantsPhonenumber' helperText='Tutkittavan avustajan puhelinnumero' id='assistantsPhonenumber' value={formValues.assistantsPhonenumber || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='assistantsAddress' helperText='Tutkittavan avustajan osoite' id='assistantsAddress' value={formValues.assistantsAddress || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='legalGuardianEmail' helperText= 'Alaikäisen tutkittavan huoltajan/sosiaalitoimen sähköposti' id='legalGuardianEmail'
                                        value={formValues.legalGuardianEmail || ''} onChange={handleFormChange} variant='outlined' margin='normal'/>
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='legalGuardianPhonenumber' helperText='Alaikäisen tutkittavan huoltajan/sosiaalitoimen puhelinnumero' id='legalGuardianPhonenumber'
                                        value={formValues.legalGuardianPhonenumber || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='legalGuardianAddress' helperText='Alaikäisen tutkittavan huoltajan/sosiaalitoimen osoite' id='legalGuardianAddress'
                                        value={formValues.legalGuardianAddress || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='legalGuardianInstitute' helperText='Alaikäisen tutkittavan huoltajan/sosiaalitoimen mahdollinen laitos' id='legalGuardianInstitute'
                                        value={formValues.legalGuardianInstitute || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='appealedDecision' helperText='Mikäli lähettäjä hovioikeus/korkein oikeus, mihin päätökseen haettu muutosta' id='appealedDecision'
                                        value={formValues.appealedDecision || ''}
                                        onChange={handleFormChange} variant='outlined' margin='normal' />
                                </Grid>
                            </Grid>

                            {(msg.errorMessagesNotEmpty && <Messages msgArray={msg.errorMessages} severity='error' />)}

                            <Button variant='contained' color='primary' id='createPersonButton' type="submit">Lähetä</Button>
                            <p></p>
                            <p></p>
                        </form>
                    </Paper>
                </div>
            </div>

            <div style={hideWhenVisible}>
                <p></p>
                <p></p>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Paper
                        className={classes.form}
                        variant='outlined'
                        square={false}
                        align='center'
                        justify='center'
                    >
                        <h2>{getSubmittedMessage()}</h2>
                        <p></p>
                        <Grid
                            container rowSpacing={2}
                            columnSpacing={{ xs: 1 }}
                        >
                            <Grid item xs={6}>
                                <Button onClick={toggleVisibility} type="submit" style={{ color: '#228B22', bordercolor: '#228B22' }} >Lähetä uusi pyyntö</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button style={{ color: '#228B22', bordercolor: '#228B22' }}>
                                    <Link to={`/upload_form/${formId}`} id="addAttachments">Lisää liitteitä</Link>
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            </div>
        </div>
    )
}

export default Form