import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FacultyProfileView = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/faculty/profile/${id}`);
        setUserDetails(data);
      } catch (err) {
        setError("Error fetching user details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const formatDate = (dateString) => {
    return (dateString ? new Date(dateString) : new Date(NaN)).toLocaleDateString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric"
    });
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const {
    basicInfo,
    professionalInfo,
    addressInfo,
    optionalQuestionsInfo
  } = userDetails;

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-4 text-[#FE444F]">User Details</h1>

      <Section title="Basic Information">
        <Detail label="Full Name" value={basicInfo?.full_name} />
        <Detail label="Date of Birth" value={formatDate(basicInfo?.date_of_birth)} />
        <Detail label="Gender" value={basicInfo?.gender} />
        <Detail label="Contact Number" value={basicInfo?.contact_number} />
        <Detail label="Email Address" value={basicInfo?.email_address} />
      </Section>

      <Section title="Professional Information">
        <Detail label="Employee Code" value={professionalInfo?.employee_code} />
        <Detail label="Designation" value={professionalInfo?.designation} />
        <Detail label="Department" value={professionalInfo?.department} />
        <Detail label="Date of Joining" value={professionalInfo?.date_of_joining} />
        <Detail label="Qualification" value={professionalInfo?.qualification} />
      </Section>

      <Section title="Address Details">
        <Detail label="Residential Address" value={addressInfo?.residential_address} />
        <Detail label="City" value={addressInfo?.city} />
        <Detail label="State" value={addressInfo?.state} />
        <Detail label="Country" value={addressInfo?.country} />
      </Section>

      <Section title="Optional Questions">
        <Detail label="Social Media Links" value={optionalQuestionsInfo?.social_media_links} />
        <Detail label="Research Interests" value={optionalQuestionsInfo?.research_interests} />
        <Detail label="Publications" value={optionalQuestionsInfo?.publications} />
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <>
    <h2 className="text-xl font-semibold mt-4">{title}</h2>
    <div className="mb-4">{children}</div>
  </>
);

const Detail = ({ label, value }) => (
  <p className="font-medium">
    {label}: <span className="font-normal">{value}</span>
  </p>
);

export default FacultyProfileView;
