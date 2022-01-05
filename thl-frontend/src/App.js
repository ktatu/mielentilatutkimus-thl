import React from 'react'
import ThlAdmissions from './components/ThlAdmissions'
import LoginForm from './components/LoginView'
import jwtDecode from 'jwt-decode'

import { useStyles, theme } from './styles'

import {
    Switch, Route, Redirect
} from 'react-router-dom'
import { ThemeProvider, StyledEngineProvider } from '@mui/material'

const App = () => {
    const classes = useStyles()

    const loggedIn = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        return user && !tokenIsExpired(user.accessToken)
    }

    const tokenIsExpired = token => {
        let decodedToken = jwtDecode(token)
        return decodedToken.exp * 1000 < Date.now() ? true : false
    }

    const AdmissionsRoute = () => (
        <div>
            { loggedIn() ? <ThlAdmissions/> : <Redirect to='/login'/> }
        </div>
    )

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <div className={classes.app}>
                    <Switch>
                        <Route path='/thl-admissions'>
                            <AdmissionsRoute/>
                        </Route>
                        <Route path='/login'>
                            <LoginForm/>
                        </Route>
                    </Switch>
                </div>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}


export default App
