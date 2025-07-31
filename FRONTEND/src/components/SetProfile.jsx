import React, { useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // Or any icon you like
import { profileUpdate } from "../lib/api";
import Notification from "../pages/Notification";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
function SetProfile() {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [bio, setbio] = useState("");
  const [response, setresponse] = useState(null);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setPreview(imageUrl);
    }
  };

  const submit = async (e) => {
    try {
      e.preventDefault();
      await profileUpdate({ file: inputRef.current.files[0], bio: bio }).then(
        (response) => {
          setresponse({
            className: "text-green-400 bg-green-100",
            message: response?.data?.message,
            success: true,
          });
          setPreview(null);
          setbio("");
        }
      );
    } catch (error) {}
  };
  return (
    <div className="w-full h-screen p-1 flex justify-center place-items-center">
      <div
        className="absolute  bg-neutral-200 left-1 top-1 p-4 rounded-full m-1 cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        <FaArrowLeft size={32} className="text-sky-400" />
      </div>
      {response && <Notification setresponse={setresponse} {...response} />}
      <div className="w-80 h-[400px] my-auto bg-white shadow-lg shadow-gray-500 border-2 border-gray-300 rounded-lg">
        <form action="">
          <div className="w-full flex justify-center p-3">
            <label
              htmlFor="profile"
              className="cursor-pointer w-36 h-36 rounded-full border-2 border-gray-300 bg-gray-200 flex items-center justify-center overflow-hidden shadow-md hover:ring-2 ring-blue-400"
              onClick={(e) => {
                inputRef.current.click();
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-4xl text-white" size={140} />
              )}

              <input
                type="file"
                id="profile-upload"
                ref={inputRef}
                onChange={handleFileChange}
                accept="image/*"
                hidden
              />
            </label>
          </div>

          <div className="flex  flex-col justify-center w-full p-3">
            <label htmlFor="">Bio</label>
            <textarea
              name=""
              id=""
              className="w-full p-3 border-2 border-gray-500 rounded-lg"
              value={bio}
              onChange={(e) => setbio(e.target.value)}
            ></textarea>
          </div>

          <div className="w-full flex justify-center">
            <button
              className="w-40 h-12 rounded-lg bg-gray-800 text-white"
              onClick={submit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SetProfile;
