import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
export default function Admin() {
  return <><NavBar /><Outlet /></>;
}
