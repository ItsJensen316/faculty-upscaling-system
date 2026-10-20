import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";

function FacultyStrip({ faculty }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] border-t border-b grid-flow-col py-3 px-2 hover:bg-[#f8f8f8]">
      <div className="flex">
        <div className="  flex items-center">
          <FontAwesomeIcon
            icon={faCircleUser}
            className="mx-auto h-11 opacity-50"
          />
        </div>
        <div className=" flex flex-col ml-3">
          <span className=" font-bold">{faculty["username"]}</span>
          {/* Employee ID */}
          {/* <span className=" truncate">{faculty["Employee Code"]}</span> */}
        </div>
      </div>
      {/* <div className="hidden lg:flex flex-col ml-3">
        <span className="truncate">{faculty["designation"]}</span>
        <span className="truncate">{faculty["Department"]}</span>
      </div>
      <div className="hidden lg:flex">
        <a
          className="truncate hover:underline "
          href={`mailto:` + faculty["Contact Email"]}
        >
          {faculty["Contact Email"]}
        </a>
      </div> */}
      
        <Button to={`/faculty/profile/${faculty._id}`} type={"profile"}>View Profile</Button>
    </div>
  );
}

export default FacultyStrip;
