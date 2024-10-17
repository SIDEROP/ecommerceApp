import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateOrderStatus } from '../store/slices/orderSlice'
import { useParams } from 'react-router-dom'

const Cancel = () => {
    let dispatch = useDispatch()
    let { orderId } = useParams()
    useEffect(() => {
        dispatch(updateOrderStatus(orderId))
    }, [dispatch,orderId])
    return (
        <>
            <div>Cancel</div>
        </>
    )
}

export default Cancel
