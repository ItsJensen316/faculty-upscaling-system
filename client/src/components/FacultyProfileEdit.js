import { useState } from "react";
import Button from "../components/Button";
import defaultProfilePic from "../data/profile-icon.jpg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const loginDetails = {
  signup_questions: {
    basic_information: {
      full_name: {
        label: "Full Name",
        type: "text",
        required: true,
      },
      date_of_birth: {
        label: "Date of Birth",
        type: "date",
        required: true,
      },
      gender: {
        label: "Gender",
        type: "select",
        options: ["Male", "Female", "Other"],
        required: true,
      },
      contact_number: {
        label: "Contact Number",
        type: "tel",
        required: true,
      },
      email_address: {
        label: "Email Address",
        type: "email",
        required: true,
      },
    },
    // professional_information: {
    //   // "employee_code": {
    //   //   "label": "Employee Code",
    //   //   "type": "text",
    //   //   "required": true
    //   // },
    //   designation: {
    //     label: "Designation",
    //     type: "select",
    //     options: [
    //       "Professor",
    //       "Assistant Professor",
    //       "Associate Professor",
    //       "Lecturer",
    //     ],
    //     required: true,
    //   },
    //   department: {
    //     label: "Department",
    //     type: "text",
    //     required: true,
    //   },
    //   date_of_joining: {
    //     label: "Date of Joining",
    //     type: "date",
    //     required: true,
    //   },
    //   qualification: {
    //     label: "Qualification",
    //     type: "text",
    //     required: true,
    //   },
    //   specialization: {
    //     label: "Specialization",
    //     type: "text",
    //     required: false,
    //   },
    // },
    // address_details: {
    //   residential_address: {
    //     label: "Residential Address",
    //     type: "text",
    //     required: false,
    //   },
    //   city: {
    //     label: "City",
    //     type: "text",
    //     required: true,
    //   },
    //   state: {
    //     label: "State",
    //     type: "text",
    //     required: true,
    //   },
    //   country: {
    //     label: "Country",
    //     type: "text",
    //     required: true,
    //   },
    // },
    // "account_security": {
    //   // "password": {
    //   //   "label": "Password",
    //   //   "type": "password",
    //   //   "required": true
    //   // },
    //   "security_question": {
    //     "label": "Security Question",
    //     "type": "select",
    //     "options": ["What is your mother's maiden name?", "What was your first pet's name?", "What was the name of your first school?"],
    //     "required": true
    //   },
    //   "security_answer": {
    //     "label": "Security Answer",
    //     "type": "text",
    //     "required": true
    //   }
    // },
    // optional_questions: {
    //   social_media_links: {
    //     label: "Social Media Links",
    //     type: "url",
    //     required: false,
    //   },
    //   research_interests: {
    //     label: "Research Interests",
    //     type: "text",
    //     required: false,
    //   },
    //   publications: {
    //     label: "Publications",
    //     type: "text",
    //     required: false,
    //   },
    // },
  },
};

function FacultyProfileEdit() {
  // const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({});
  const {userid} = useParams();
  const navigate = useNavigate();
  // console.log(userid);

  function handleUpload(e) {
    const file = e.target.files[0]; // Get the first file
    if (file) {
      // setSelectedImage(file); // Save the selected file
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  }

  function handleChange(e, section, field) {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: e.target.value,
      },
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form Data: ", formData);

    try {
      await axios.post(`http://localhost:5000/faculty/profile/${userid}`, {
        formData,
      });
      // navigate(`/faculty/profile/${userid}`);
    } catch (err) {
      console.error("error", err?.response?.data);
      // setError(err?.response?.data);
    }
  };

  const renderField = (section, field, details) => {
    switch (details.type) {
      case "select":
        return (
          <div key={field} className="mb-4">
            <label>{details.label}:</label>
            <select
              onChange={(e) => handleChange(e, section, field)}
              required={details.required}
              className="border rounded p-2 w-full"
            >
              <option value="">Select</option>
              {details.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return (
          <div key={field} className="mb-4">
            <label>{details.label}:</label>
            <input
              type={details.type}
              required={details.required}
              onChange={(e) => handleChange(e, section, field)}
              className="border rounded p-2 w-full"
            />
          </div>
        );
    }
  };

  return (
    <>
      <div className="mx-auto my-5 rounded-2xl w-fit border-2 px-7 py-7">
        <h1 className="text-2xl font-semibold w-fit mx-auto mb-2">Profile</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center"
        >
          <div className="w-40 h-40 rounded-full bg-orange-500 overflow-hidden flex items-center justify-center mb-4">
            <img
              className="w-full h-full object-cover"
              src={imagePreview || defaultProfilePic}
              alt="Profile"
            />
          </div>
          <Button type={"button"}>
            <label htmlFor="profilePic" className="cursor-pointer">
              Upload image
            </label>
          </Button>
          <input
            className="hidden"
            type="file"
            id="profilePic"
            accept="image/*"
            onChange={handleUpload}
          />

          <div className="w-full">
            {Object.keys(loginDetails.signup_questions).map((section) => (
              <div key={section}>
                <h2 className="text-xl font-semibold my-3">
                  {section.replace("_", " ").toUpperCase()}
                </h2>
                {Object.keys(loginDetails.signup_questions[section]).map(
                  (field) => {
                    // console.log(loginDetails.signup_questions[section][field]);
                    return renderField(
                      section,
                      field,
                      loginDetails.signup_questions[section][field]
                    );
                  }
                )}
              </div>
            ))}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </>
  );
}

export default FacultyProfileEdit;
