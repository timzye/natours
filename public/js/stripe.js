import axios from 'axios'
import { showAlert } from './alerts'
const stripe = Stripe('pk_test_51HHHOkHJwoDhlLbnTWOrKzkuwHwiicLWaSXmOYiiwQKYmDMYzIImoIdBV97BEViT9wrysjrgXtBMyzYKgnVMSlRa00dbr8W635')


export const bookTour = async tourId => {
    try {
        const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`)
        
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    
    } catch (err) {
        console.log(err)
        showAlert('error', err)
    }
    
}