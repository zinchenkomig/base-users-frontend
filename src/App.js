import {createBrowserRouter, Link, Outlet, RouterProvider} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RequireAuth from "./components/RequireAuth";
import "./assets/style.css"
import Profile from "./pages/Profile";
import RequireSuperuser from "./components/RequireSuperuser";
import UserManagement from "./pages/UsersManagement";
import {useContext} from "react";
import AuthContext from "./context/auth";
import ProfileDropDown from "./components/ProfileDropDown";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                element: <RequireAuth/>,
                children: [
                    {
                        path: "profile",
                        element: <Profile/>,
                    },
                ]
            },
            {
                element: <RequireSuperuser/>,
                children: [
                    {
                        path: "manage/users",
                        element: <UserManagement/>,
                    }
                ]
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "signup",
                element: <SignUp/>
            }
        ]
    },
])

export default function App(){

    return (
            <RouterProvider router={router}/>
    )
}


function Root() {
    const { userInfo } = useContext(AuthContext);


  return (
      <div>
      <nav>
          <Link className="nav-link" to={`/`}>Home</Link>

          {userInfo?.roles?.includes("admin")
              ? <Link className="nav-link" to={`/manage/users`}>Manage</Link>
              : <></>
          }

          <div className="right-align">
                      <ProfileDropDown/>
          </div>

      </nav>
          <div className="main-content">
              <Outlet/>
          </div>
      </div>

  );
}

