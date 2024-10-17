import React from 'react'
import "./css/AlertBox.css"
import { useNavigate } from 'react-router-dom'

const AlertBox = ({title,path}) => {
    let naviget = useNavigate()
    return (
        <div className="alertBox">
            <h3 onClick={()=>naviget(`/${path}`)}>{title}</h3>
        </div>
    )
}

export default AlertBox
