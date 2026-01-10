import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/db";
import { getAuthToken, getAuthTokenAsync } from "../utils/api";

export default function RequireInstructorAuth({ children }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // prefer fast sync API, fall back to async IndexedDB getter
        const token = getAuthToken() || await getAuthTokenAsync();
        console.log('[RequireInstructorAuth] token check', token);
        if (mounted) setAuthed(!!token);
      } catch (e) {
        if (mounted) setAuthed(false);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => { mounted = false };
  }, []);

  if (!ready) return null;
  if (!authed) return <Navigate to="/instructor/login" replace />;
  return children;
}
