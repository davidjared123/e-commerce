import React, {useState, useEffect} from 'react'
import {CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Buttom } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom';

import {commerce} from '../../../lib/commerce'

import AddressForm from '../AddressForm'
import PaymentForm from '../PaymentForm'

import useStyles from './styles'

const steps = ['Shipping address', 'Payment details']

const Checkout = ({cart, order, onCaptureCheckout, error}) => {
    const [activeStep, setActiveStep] = useState(0)
    const classes = useStyles()
    
    const [checkoutToken, setCheckoutToken] = useState(null)
    const [shippingData, setShippingData] = useState([])

    useEffect(()=>{
        const generateToken = async ()=>{
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'})
                // console.log(token)
                setCheckoutToken(token)
            } catch (error) {
                console.error('shippingData ERROR', shippingData)
            }
        }
        generateToken()
        console.log('data shipping _ EFFECT _ checkout',shippingData)
    }, [cart])

    const nextStep = () => setActiveStep((prevActiveStep)=> prevActiveStep + 1)
    const backStep = () => setActiveStep((prevActiveStep)=> prevActiveStep - 1)

    const next = (data) =>{
        setShippingData(data)
        console.log('data shipping _ NEXT _ checkout',shippingData)
        // console.log('data set shipping _ NEXT _ checkout',setShippingData)

        nextStep()
    }

    const Confirmation = () => (
        <div>Confirmation</div>
    )
    const Form = () => activeStep === 0 
        ? <AddressForm checkoutToken={checkoutToken} next={next} /> 
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout= {onCaptureCheckout} nextStep={nextStep}/>

    return (
        <React.Fragment>
            <div className={classes.toolbar}>
                <main className={classes.layout}>
                 <Paper className={classes.paper}>
                    <Typography variant='h4' align='center'>Pagar</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                    {steps.map((step)=>(
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                 </Paper>
                </main>
            </div>
        </React.Fragment>
    )
}

export default Checkout
