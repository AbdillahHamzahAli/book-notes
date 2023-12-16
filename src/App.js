import React, { useEffect, useState } from "react";
import { supabase } from "./lib/helper/supabaseClient";

export default function App() {
  const [user, setUser] = useState(null);
  const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) throw error;
  };
  const logout = async () => {
    await supabase.auth.signOut();
  };

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    setUser(data.session?.user);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
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
    getSession();
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Authenticated</h1>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login with github</button>
      )}
    </div>
  );
}
