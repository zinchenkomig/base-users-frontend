import {FaRegCheckCircle, FaRegTimesCircle} from "react-icons/fa";

export function CheckedIcon (){
    return (<div className="icon success"><FaRegCheckCircle/></div>)
}

export function UncheckedIcon(){
    return (<div className="icon fail"><FaRegTimesCircle/></div> )
}