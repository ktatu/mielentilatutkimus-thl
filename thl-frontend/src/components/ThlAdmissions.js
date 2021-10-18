import React, { useState, useEffect } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import AdmissionForm from './AdmissionForm'
import formService from '../services/formService'
import { useStyles } from '../styles'
import dayjs from 'dayjs'

const ThlAdmissions = () => {
    const [forms, setForms] = useState([])
    const [ascending, setAscending] = useState(true)
    const [ascendingDate, setAscendingDate] = useState (false)

    const classes = useStyles()

    useEffect(() => {
        fetchForms()
    }, [])

    const fetchForms = async () => {
        const forms = await formService.getAll()
        setForms( forms )
    }

    const updateForms = async ( updateFormState ) => {
        setForms(forms.map(form => form.id !== updateFormState.id ? form : updateFormState))
    }

    const sortFormsByState = async () => {
        const forms = await formService.getAll()

        if (ascending) {
            setForms(forms.sort((a,b) => a.formState > b.formState ? 1 : -1))
            setAscending(false)
        } else {
            setForms(forms.sort((a,b) => b.formState > a.formState ? 1 : -1))
            setAscending(true)
        }
    }

    const sortFormsByDate= async () => {
        const forms = await formService.getAll()

        if (ascendingDate) {
            setForms(forms.sort((a,b) => a.createdAt > b.createdAt ? 1 : -1))
            setAscendingDate(false)
        } else {
            setForms(forms.sort((a,b) => b.createdAt > a.createdAt ? 1 : -1))
            setAscendingDate(true)
        }
    }


    return (
        <div className={classes.page}>
            <div>
                <h2>Lomakkeet:</h2>
            </div>
            <div>
                <TableContainer component={Paper} className={classes.form}>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell align="left">Luotu
                                    <button onClick={sortFormsByDate}>Järjestä</button>
                                </TableCell>
                                <TableCell align="left">Päivitetty
                                </TableCell>
                                <TableCell align="left">Tila
                                    <button onClick={sortFormsByState}>Järjestä</button>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {forms.slice().map(form => {
                                return (
                                    <TableRow key={form.id}>
                                        <TableCell>
                                            <AdmissionForm key={form.id} form={form} updateForms={updateForms}> </AdmissionForm>
                                        </TableCell>
                                        <TableCell align="left">{dayjs(form.createdAt).format('DD.MM.YYYY HH:mm:ss')}</TableCell>
                                        <TableCell align="left">{dayjs(form.updatedAt).format('DD.MM.YYYY HH:mm:ss')}</TableCell>
                                        <TableCell align="left" id="formState">{form.formState}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default ThlAdmissions