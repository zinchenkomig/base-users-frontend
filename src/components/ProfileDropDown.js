import { useContext, useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import AuthContext from "../context/auth";
import axios from "../api/backend";
import { Link, useNavigate } from "react-router-dom";


function useOutsideAlerter(ref, setIsOpened) {
  useEffect(() => {
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
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [isOpened, setIsOpened] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setIsOpened);
  const navigate = useNavigate()

  async function onLogoutClick() {
    await axios.post('/auth/logout').catch((_)=>{});
    localStorage.removeItem('access_token');
    setUserInfo({});
    navigate('/login')
  }

  return (
    <div ref={wrapperRef}>
      <div className={(isOpened ? "link--elara-active" : "") + " link link--elara box-content align-baseline"}
        onClick={() => {
          if (!isOpened && userInfo.user_guid) { setIsOpened(true) }
          else if (!userInfo.user_guid) { navigate('/login') }
          else { setIsOpened(false) }
        }
        }>
        <FaUser />
      </div>
      {isOpened && userInfo.user_guid &&
        <div className="absolute m-2 pt-2 pb-4 px-12 right-4 z-10 md shadow-xl rounded-3xl bg-gradient-to-t from-slate-800 to-slate-700">
          <div className="px-4 py-2 text-2xl relative text-center text-gray-200 font-medium">
            {userInfo.first_name || 'unknown username'}
            </div>
          <div className="p-4 pt-0">
            <ul>
              <li className="py-8 text-center"> <Link className="text-2xl font-normal underline underline-offset-4"
                onClick={() => { setIsOpened(false) }}
                to={`/profile`}>Profile</Link> </li>
            </ul>
            <button onClick={onLogoutClick} className="text-xl w-44 h-14 p-0 rounded-2xl">Log Out</button>
          </div>
        </div>
      }
    </div>
  );
}

export default ProfileDropDown
