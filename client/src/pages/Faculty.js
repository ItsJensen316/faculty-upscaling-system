import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

function Faculty() {
 
  return (
    <>
      <NavBar />
      <Outlet/>
    </>
  );
}

export default Faculty;
