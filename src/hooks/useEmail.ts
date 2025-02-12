import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function useEmail(userId: string | number) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmail() {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (data?.user?.id === userId) {
          setEmail(data.user.email ?? null);
        } else {
          setEmail(null);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEmail();
  }, [userId]);

  return { email, loading, error };
}
