import { Link } from "react-router-dom";

const base = "rounded-full text-white bg-[#FE444F] hover:bg-[#F0305C]";

const styles = {
  login: base + " px-4 py-2.5 text-2xl ",
  //   login: base + " flex py-2.5 justify-center w-36 text-2xl border-0",
  small: base + " px-4 py-2 text-base border-0 ",
  submit: base + " px-4 py-2 text-base border-0 mt-8 ",
  profile: ' my-auto px-2 h-10 w-28 rounded-lg border-2 hover:border-0 border-[#FE444F] hover:bg-[#F0305C] hover:text-white '
};

function Button({ children,to, type, onClick }) {
  if (to) {
    return (
      <button
        className={styles[type] + "font-sans"}
        // onClick={() => navigate(to)}
      >
        <Link to={to}>{children}</Link>
      </button>
    );
  }
  return (
    <button onClick={onClick}
      className={styles[type] + "font-sans"}
      // onClick={() => navigate("/apprisal-from")}
    >
      {children}
      {/* <i class="fa-solid fa-angle-right ml-1"></i> */}
    </button>
  );
}

export default Button;
