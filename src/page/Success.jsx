import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateOrderStatus } from '../store/slices/orderSlice'
import { useParams } from 'react-router-dom'

const Success = () => {
    let dispatch = useDispatch()
    let { orderId } = useParams()

    useEffect(() => {
        dispatch(updateOrderStatus(orderId))
    }, [dispatch, orderId])

    return (
        <div className="cancel-page">
            <div className="cancel-glass">
                <h1>Order Successful</h1>
                <p>Your order with ID {orderId} has been placed successfully!</p>
                <p>Thank you for shopping with us!</p>
            </div>
        </div>
    )
}

export default Success
