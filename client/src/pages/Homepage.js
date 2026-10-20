import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import Section from "../components/Section";
import { Outlet } from "react-router-dom";

function Homepage() {
  // const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Outlet />

      <NavBar>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Button type={"small"} to={"/login"}>
              Login
            </Button>
            <Button type={"small"} to={"/signup"}>
              Signup
            </Button>
          </Nav>
        </Navbar.Collapse>
      </NavBar>
      <Main>
        <Section>
          <div className="flex flex-col items-center pt-20">
            <h1 className="homepage-title text-5xl font-bold mb-3 ">
              Welcome to 🔖SkillPathway
            </h1>
            <p className="text-2xl mb-5">
              Empowering Faculty and Learners to Achieve Excellence
            </p>
            <Button type={"login"} to={"/signup"}>
              Get started
            </Button>
          </div>
          <div className="relative w-full ">
            <svg
              className=" "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="#EF305B"
                fill-opacity="1"
                d="M0,224L1440,192L1440,320L0,320Z"
              ></path>
            </svg>

            <svg
              className="absolute top-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="#FA3E52"
                fill-opacity="1"
                d="M0,32L1440,288L1440,320L0,320Z"
              ></path>
            </svg>
          </div>
        </Section>
      </Main>
    </>
  );
}

export default Homepage;

function Main({ children }) {
  return <main>{children}</main>;
}
