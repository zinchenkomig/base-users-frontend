import {useContext, useState, useEffect, useRef} from "react";
import {FaUser} from "react-icons/fa";
import AuthContext from "../context/auth";
import axios from "../api/backend";
import {Link, useNavigate} from "react-router-dom";


function useOutsideAlerter(ref, setIsOpened) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpened(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setIsOpened]);
}

const ProfileDropDown = () => {
    const {userInfo, setUserInfo} = useContext(AuthContext);
    const [isOpened, setIsOpened] = useState(false);
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setIsOpened);
    const navigate = useNavigate()

    async function onLogoutClick(){
        await axios.post('/auth/logout');
        localStorage.removeItem('username');
        localStorage.removeItem('roles');
        setUserInfo({});
        navigate('/')
    }
    console.log(userInfo?.roles?.includes('admin'));

    return (
        <div ref={wrapperRef} className="dropdown-profile-container">
        <div className={(isOpened ? "nav-link-toggled" :"nav-link") + " profile-icon"}
             onClick={() =>
             { if (!isOpened && userInfo.username){setIsOpened(true)}
                else if(!userInfo.username){navigate('/login')}
                else{setIsOpened(false)}}
        }>
            <FaUser/>
        </div>
        {isOpened && userInfo.username ?
                <div className="profile-dropdown">
                    <div className="profile-dropdown-name">{userInfo.username}</div>
                    <div className="profile-dropdown-body">
                        <ul>
                            <li> <Link className="profile-dropdown-link"
                                       onClick={()=>{setIsOpened(false)}}
                                       to={`/profile`}>Profile</Link> </li>
                        </ul>
                        <button onClick={onLogoutClick}>Log Out</button>
                    </div>
                </div>
                :
                <></>
        }
        </div>
    );
}

export default  ProfileDropDown