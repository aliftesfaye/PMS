import { Navigate } from "react-router";
// import { useAuth } from "./authContext";

const RequireAuth = ({ children }) => {
  if (localStorage.getItem("userInfo")) {
    return children;
  }
  return <Navigate to="/" />;
};
export default RequireAuth;
