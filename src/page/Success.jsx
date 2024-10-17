import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateOrderStatus } from '../store/slices/orderSlice'
import { useParams } from 'react-router-dom'

const Success = () => {
    let dispatch = useDispatch()
    let { orderId } = useParams()
    useEffect(() => {
        dispatch(updateOrderStatus(orderId))
    }, [dispatch,orderId])
    return (
        <>
            <div>Success</div>
        </>
    )
}

export default Success
