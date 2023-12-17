import React, { useEffect, useState } from "react";
import { supabase } from "./lib/helper/supabaseClient";
import Books from "./components/Books";

export default function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) throw error;
  };
  const logout = async () => {
    await supabase.auth.signOut();
  };

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
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <div>{user ? <Books user={user} /> : <button onClick={login}>Login with github</button>}</div>;
}
