import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateOrderStatus } from '../store/slices/orderSlice'
import { useParams } from 'react-router-dom'
import "./css/Cancel.css"

const Cancel = () => {
    let dispatch = useDispatch()
    let { orderId } = useParams()
    
    useEffect(() => {
        dispatch(updateOrderStatus(orderId))
    }, [dispatch, orderId])
    
    return (
        <div className="cancel-page">
            <div className="cancel-glass">
                <h1>Order Cancelled</h1>
                <p>Your order with ID {orderId} has been successfully cancelled.</p>
                <p>If you have any questions, please contact support.</p>
            </div>
        </div>
    )
}

export default Cancel
