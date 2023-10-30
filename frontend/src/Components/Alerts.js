import React from 'react'

const Alerts = (props) => {

    const capitalize = (word) => {
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    return (
        <>
            <div className="d-flex justify-content-center">
                <div className='alertbar' style={{ display:'inline-block' , width: "min(100%, 400px)" , textAlign: "center", position: "absolute"}}>
                    {props.alert && (
                        <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert" >
                            <strong style={{background : "transparent"}}>{capitalize(props.alert.message)}</strong>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Alerts