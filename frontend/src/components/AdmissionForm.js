/*eslint-disable no-unused-vars */
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
                        helperText='Jos syytettä ei ole nostettu, esitutkinnan suorittava poliisilaitos' id='preTrialPoliceDepartment' value={props.preTrialPoliceDepartment}
                        onChange={props.handlePreTrialPoliceDepartmentChange} variant='outlined' margin='normal' />
                </Grid>
                <Grid item xs={5,5}>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                        <DesktopDatePicker
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
                console.log('res ', res)
                setSenderInfo(res)
            })
        }, [])
    }

    const [hazardAssesment, setHazardAssesment] = useState(false)
    const [datePrescribedForPsychiatricAssesment, setDatePrescribedForPsychiatricAssesment] = useState('')
    const [prosecuted, setProsecuted] = useState(false)
    const [deadlineForProsecution, setDeadlineForProsecution] = useState('')
    const [preTrialPoliceDepartment, setPreTrialPoliceDepartment] = useState('')

    const [formValues, setFormValues] = useState({})

    const msg = useMessage()

    document.title = 'Mielentilatutkimuspyyntö'

    const formFieldChange = event => {
        const changedField = event.target.name
        const changedValue = event.target.value

        console.log('field ', changedField)
        console.log('value ', changedValue)

        setFormValues((formValues) => (
            { ...formValues, [changedField]: changedValue }
        ))
    }

    const handleDatePrescribedForPsychiatricAssesmentChange = (newValue) => {
        setDatePrescribedForPsychiatricAssesment(newValue)
    }
    const handleProsecutedChange = (event) => {
        setProsecuted(event.target.value)
    }
    const handleDeadlineForProsecutionChange = (newValue) => {
        setDeadlineForProsecution(newValue)
    }
    const handlePreTrialPoliceDepartmentChange = (event) => {
        setPreTrialPoliceDepartment(event.target.value)
    }

    const validateAssistantsEmail = () => {
        if (!validator.isEmail(assistantsEmail) && assistantsEmail.length>0) {
            msg.setErrorMsg('Avustajan sähköpostiosoite on virheellinen!', 7)
            return true
        } else {
            return false
        }
    }

    const validateLegalGuardianEmail = () => {
        if (!validator.isEmail(legalGuardianEmail) && legalGuardianEmail.length>0) {
            msg.setErrorMsg('Alaikäisen huoltajan/sosiaalitoimen sähköpostiosoite on virheellinen!', 7)
            return true
        } else {
            return false
        }
    }


    const updatePerson = (event) => {

        event.preventDefault()

        if(formState === 'Pyydetty lisätietoja') {

            const assistantUpdateError = validateAssistantsEmail()
            const guardianUpdateError= validateLegalGuardianEmail()

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

            if (!assistantUpdateError && !guardianUpdateError) {
                admissionService
                    .update(paramFormId, updateAdmission)
                    .then(response => {
                        setFormId(response.data.id)
                        toggleVisibility()
                    })
                    .catch(() => {
                        msg.setErrorMsg('Mielentilatutkimuspyynnön muokkaamisessa tapahtui virhe!', 7)
                    })
            }
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

            const createAdmission = {
                formState : 'Odottaa tarkistusta',
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
                basicInformation: senderInfo.id
            }

            const assistantError = validateAssistantsEmail()
            const guardianError = validateLegalGuardianEmail()

            if (!assistantError && !guardianError) {
                admissionService
                    .create(createAdmission)
                    .then(response => {
                        setFormId(response.data.id)
                        toggleVisibility()

                        setName('')
                        setLastname('')
                        setIdentificationNumber('')
                        setAddress('')
                        setLocation('')
                        setProcessAddress('')
                        setTrustee('')
                        setCitizenship('')
                        setHazardAssesment(false)
                        setDiaariNumber('')
                        setDatePrescribedForPsychiatricAssesment('')
                        setNativeLanguage('')
                        setDesiredLanguageOfBusiness('')
                        setMunicipalityOfResidence('')
                        setProsecuted(false)
                        setDeadlineForProsecution('')
                        setPreTrialPoliceDepartment('')
                        setCrime('')
                        setCrimes('')
                        setAssistantsEmail('')
                        setAssistantsPhonenumber('')
                        setAssistantsAddress('')
                        setLegalGuardianEmail('')
                        setLegalGuardianPhonenumber('')
                        setLegalGuardianAddress('')
                        setLegalGuardianInstitute('')
                        setAppealedDecision('')
                    })
                    .catch(() => {
                        msg.setErrorMsg('Mielentilatutkimuspyynnön lähettämisessä tapahtui virhe!', 7)
                    })
            }
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
                                        onChange={formFieldChange}  variant='outlined' margin='normal'/>
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='lastName' helperText='Sukunimi' id='lastname' value={lastname}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='identificationNumber' helperText='Henkilötunnus' id='identificationNumber' value={identificationNumber}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='address' helperText='Kotiosoite' id='address' value={address}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='location' helperText='Sijainti' id='location' value={location}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='processAddress' helperText='Prosessiosoite' id='processAddress' value={processAddress}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='trustee' helperText='Edunvalvoja' id='trustee' value={trustee}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='citizenship' helperText='Kansalaisuus' id='citizenship' value={citizenship}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
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
                                            onChange={formFieldChange}
                                            value={hazardAssesment}
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
                                            onChange={handleDatePrescribedForPsychiatricAssesmentChange}
                                            renderInput={(params) => <TextField id='date-picker' variant='filled' {...params} />}
                                        />
                                        <FormHelperText>Päivämäärä, jolla oikeus on määrännyt tutkittavan mielentilatutkimukseen</FormHelperText>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='diaariNumber' helperText='Diaarinumero' id='diaariNumber' value={diaariNumber}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='nativeLanguage' helperText='Tutkittavan äidinkieli'id='nativeLanguage' value={nativeLanguage}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='desiredLanguageOfBusiness' helperText='Tutkittavan toivoma asiointikieli' id='desiredLanguageOfBusiness'
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='municipalityOfResidence' helperText='Tutkittavan kotikunta' id='municipalityOfResidence' value={municipalityOfResidence}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <FormControl >
                                        <Select
                                            onChange={handleProsecutedChange}
                                            value={prosecuted}
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
                                        prosecuted ={prosecuted}
                                        deadlineForProsecution = {deadlineForProsecution}
                                        handleDeadlineForProsecutionChange = {handleDeadlineForProsecutionChange}
                                        preTrialPoliceDepartment = {preTrialPoliceDepartment}
                                        handlePreTrialPoliceDepartmentChange = {handlePreTrialPoliceDepartmentChange}
                                    />
                                </Grid>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='crime' helperText='Vakavin teko (päätös tai välituomio)'id='crime' value={crime}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='crimes' helperText='Muut kyseessä olevat teot, joista mielentilatutkimusta pyydetään' id='crimes' value={crimes}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='assistantsEmail' helperText='Tutkittavan avustajan sähköposti' id='assistantsEmail' value={assistantsEmail}
                                        onChange={formFieldChange} variant='outlined' margin='normal'
                                    />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='assistantsPhonenumber' helperText='Tutkittavan avustajan puhelinnumero' id='assistantsPhonenumber' value={assistantsPhonenumber}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='assistantsAddress' helperText='Tutkittavan avustajan osoite' id='assistantsAddress' value={assistantsAddress}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='legalGuardianEmail' helperText= 'Alaikäisen tutkittavan huoltajan/sosiaalitoimen sähköposti' id='legalGuardianEmail'
                                        value={legalGuardianEmail} onChange={formFieldChange} variant='outlined' margin='normal'/>
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='legalGuardianPhonenumber' helperText='Alaikäisen tutkittavan huoltajan/sosiaalitoimen puhelinnumero' id='legalGuardianPhonenumber' value={legalGuardianPhonenumber}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='legalGuardianAddress' helperText='Alaikäisen tutkittavan huoltajan/sosiaalitoimen osoite' id='legalGuardianAddress' value={legalGuardianAddress}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='legalGuardianInstitute' helperText='Alaikäisen tutkittavan huoltajan/sosiaalitoimen mahdollinen laitos' id='legalGuardianInstitute' value={legalGuardianInstitute}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={5,5}>
                                    <TextField fullWidth
                                        name='appealedDecision' helperText='Mikäli lähettäjä hovioikeus/korkein oikeus, mihin päätökseen haettu muutosta' id='appealedDecision' value={appealedDecision}
                                        onChange={formFieldChange} variant='outlined' margin='normal' />
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