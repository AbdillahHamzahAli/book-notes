import React, { useEffect, useState } from "react";
import { supabase } from "./lib/helper/supabaseClient";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Books from "./pages/Books";

export default function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      switch (_event) {
        case "SIGNED_IN":
          setUser(session?.user);
          break;
        case "SIGNED_OUT":
          setUser(null);
          break;
        default:
          break;
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // return <div>{user ? <Books user={user} /> : <button onClick={login}>Login with github</button>}</div>;
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      {user ? <Route path="/books" element={<Books user={user} />} /> : ""}
    </Routes>
  );
}
