import { createBrowserRouter, NavLink, Outlet, RouterProvider, useNavigate } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RequireAuth from "./components/RequireAuth";
import "./assets/style.css"
import Profile from "./pages/Profile";
import RequireSuperuser from "./components/RequireSuperuser";
import UserManagement from "./pages/UsersManagement";
import { useContext } from "react";
import AuthContext from "./context/auth";
import ProfileDropDown from "./components/ProfileDropDown";
import Verification from "./pages/Verification";
import ForgotPassword from "./pages/ForgotPassword";
import VerificationEmailSent from "./pages/info/VerificationEmailSent";
import SignupSuccess from "./pages/info/SignupSuccess";
import RecoverPassword from "./pages/RecoverPassword";
import Home from "./pages/Home";
import globalRouter from "./hooks/globalRouter";
import { useQueryClient } from "@tanstack/react-query";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
        ]
      },
      {
        element: <RequireSuperuser />,
        children: [
          {
            path: "manage/users",
            element: <UserManagement />,
          }
        ]
      },
      {
        path: "",
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "signup",
        element: <SignUp />
      },
      {
        path: "forgot_password",
        element: <ForgotPassword />
      },
      {
        path: "verification_sent",
        element: <VerificationEmailSent />
      },
      {
        path: "signup_success",
        element: <SignupSuccess />
      },
      {
        path: "recover_password/:token",
        element: <RecoverPassword />,
        loader: async ({ params }) => {
          return { "token": params.token };
        }
      },
      {
        path: "verify/:user_guid",
        element: <Verification />,
        loader: async ({ params }) => {
          return { "user_guid": params.user_guid };
        }
      }
    ]
  },
])

export default function App() {

  return (
    <RouterProvider router={router} />
  )
}

function NavBar({ to, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? `link--elara-active` : "") + ` link link--elara`}>
      {children}
    </NavLink>
  )
}


function Root() {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const queryClient = useQueryClient()

  globalRouter.navigate = useNavigate();
  globalRouter.setUserInfo = setUserInfo;
  globalRouter.queryClient = queryClient;


  return (
    <div>
      <nav>
        <NavBar to={`/`}>Home</NavBar>

        {userInfo?.roles?.includes("admin")
          ? <NavBar to={`/manage/users`}>Manage</NavBar>
          : <></>
        }

        <div className="absolute top-0 right-0 h-full">
          <ProfileDropDown />
        </div>

      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

