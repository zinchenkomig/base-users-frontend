import {FaTrash, FaEdit, FaCheck, FaTimes} from "react-icons/fa"


export function DeleteButton(props){
    return (
        <button {...props} className="no-bg-button"><FaTrash/></button>
    )
}

export function EditButton(props){
    return(
        <button {...props} className="no-bg-button"><FaEdit/></button>
    )
}

export function CheckButton(props){
    return(
        <button {...props} className="no-bg-button"><FaCheck/></button>
    )
}

export function CancelButton(props){
    return(
        <button {...props} className="no-bg-button"><FaTimes/></button>
    )
}