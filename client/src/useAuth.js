import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) {
      setLoading(false);
      return;
    }


    axios.post("/login", { code })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, null, "/movieflex");
        setAuthError(false);
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Authentication Error:", error.response?.data?.error || error.message);
        setAuthError(true);
        setLoading(false); 

      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      axios.post("/refresh", { refreshToken })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch((error) => {
          console.error("Token Refresh Error:", error.response?.data?.error || error.message);
          setAuthError(true);
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return { accessToken, authError, loading };
}
