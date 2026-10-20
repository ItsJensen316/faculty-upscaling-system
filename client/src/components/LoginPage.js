import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useState } from "react";
import axios from "axios";

function LoginPage() {
  const navigate= useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  // const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/faculty/login", {
        username: username,
        password: password,
      });
      setLoginStatus("logged in Successfully")
      navigate(`/faculty/profile/${res.data.objId}`)
      console.log(res.data.objId);
    } catch (err) {
      console.error("error", err?.response?.data);
      setLoginStatus(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="mx-auto my-20 w-80 px-4 py-4 border-2 rounded-3xl flex flex-col items-center">
      <h1 className="font-bold text-2xl mb-3 text-[#FE444F]">Faculty Login</h1>

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
        <span className="">
          <Button type={"small"}>Login</Button>
        </span>
        <p>{loginStatus}</p>
        <p className="w-fit mx-auto mt-2">
          click here for{" "}
          <Link
            to={"/signup"}
            className="underline text-blue-500 cursor-pointer"
          >
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
}
export default LoginPage;
