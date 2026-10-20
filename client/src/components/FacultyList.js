import { useEffect, useState } from "react";
import FacultyStrip from "./FacultyStrip";
import axios from "axios";
export default function FacultyList() {
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    axios.get("http://localhost:5000/faculty-list")
      .then(({data}) => setFaculties(data))
      .catch(() => setError("Unable to load faculty list"));
  }, []);
  return <div className="max-w-4xl mx-auto mt-10 mb-24 px-4">
    <h1 className="text-2xl font-bold mb-4">Faculty directory</h1>
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {!error && faculties.length===0 && <p>No faculty accounts found.</p>}
    <ul className="list-none p-0">{faculties.map(faculty => <li key={faculty._id}><FacultyStrip faculty={faculty}/></li>)}</ul>
  </div>;
}
