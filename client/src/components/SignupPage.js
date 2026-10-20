import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useState } from "react";
import axios from "axios";

function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Use at least 8 characters"); return; }
    if (password === confirmPassword) {
      try {
        const res = await axios.post("http://localhost:5000/faculty/signup", {
          username: username,
          password: password,
        });
        navigate(`/faculty/profile/edit/${res.data.objId}`);
        // alert("Data sent!");
      } catch (err) {
        console.error("error", err?.response?.data);
        console.error("error..............");
        setError(err?.response?.data?.error || "Signup failed");
      }
    }
  };

  return (
    <div className="mx-auto my-20 w-80 px-4 py-4 border-2 rounded-3xl flex flex-col items-center">
      <h1 className="font-bold text-2xl mb-3 text-[#FE444F]">Faculty Signup</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          className="py-1 px-3 mb-3 w-full border rounded-full"
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="py-1 px-3 mb-3 w-full border rounded-full"
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="py-1 px-3 ml-1 mb-3 w-full border rounded-full"
          type="password"
          id="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span className="">
          <Button type={"small"}>SignUp</Button>
        </span>
        <p>{error}</p>
        <p className="w-fit mx-auto mt-2">
          click here for{" "}
          <Link
            to={"/login"}
            className="underline text-blue-500 cursor-pointer"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
export default SignupPage;
