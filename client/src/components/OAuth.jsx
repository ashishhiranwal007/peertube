import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/reducers/userSlice"
import { useNavigate } from "react-router-dom";

const CLIENT_ID = "1008178499286-83qh7731dhnns5g66tku3u1ablr1ml83.apps.googleusercontent.com";

const SCOPES = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.upload ";


const OAuth = ({ role }) => {

  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [tokenClient, setTokenClient] = useState(null);
  const navigate = useNavigate();

  const onGoogleClientLoad = async () => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (response) => {
        const accessToken = response.access_token;
        const userDetails = await fetchUserDetails(accessToken);
        setUser({ ...userDetails, accessToken });
        await callBackend(role, userDetails, accessToken);
      },
    });

    setTokenClient(client);
  };

  useEffect(() => {
    const initializeGoogleClient = () => {
      console.log(role);

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;

      script.onload = onGoogleClientLoad;

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    initializeGoogleClient();
  }, [role]);

  useEffect(() => {
    console.log(user);
  },[user])


  const fetchUserDetails = async (token) => {
    try {
      console.log("cc");
      const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      return null;
    }
  };

  const callBackend = async (role, userDetails, accessToken) => {
    try {
      console.log("role", role)
      const response = await fetch("http://localhost:3000/api/auth/loginwihtgoogle", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userDetails.email,
          fullName: userDetails.name,
          role: role,
        }),
      });

      const data = await response.json();

      dispatch(login({
        user: data.user,
        role: data.user.role,
        googleToken: accessToken
      }))
      console.log("Backend response:", data);
      navigate("/");
      // Handle the response accordingly, maybe update user state or UI
    } catch (error) {
      console.error("Error calling backend:", error);
    }
  };



  const handleGoogleClick = () => {
    if (tokenClient) {
      console.log(role);
      tokenClient.requestAccessToken();
    }
  };

  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 flex-1'>Contiue With Google</button>
  )

};

export default OAuth;