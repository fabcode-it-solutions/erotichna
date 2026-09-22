// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import useAuth from "@/contexts/auth/AuthProvider";

// export default function TwitterCallback() {
//   const { setUser } = useAuth();
//   const router = useRouter();
//   const params = useSearchParams();

//   // ✔ FIX: read ?access_token=...
//   const access_token = params.get("access_token");

//   useEffect(() => {
//     if (!access_token) return;

//     async function verify() {
//       try {
//         const res = await fetch(
//           `/api/auth/twitter/verify?access_token=${access_token}`
//         );

//         const data = await res.json();
//         console.log("🐦 Twitter verify data:", data);

//         if (data.error) {
//           throw new Error(data.error);
//         }

//         // Save in auth context
//         setUser(data);

//         // Redirect based on role
//         router.replace(data.role === "admin" ? "/dashboard" : "/");
//       } catch (err) {
//         console.error("Twitter login failed:", err);
//         router.replace("/login");
//       }
//     }

//     verify();
//   }, [access_token]);

//   return (
//     <div className="text-white p-10 text-center">Connecting to Twitter...</div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/contexts/auth/AuthProvider";

export default function TwitterCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuth();

  const access_token = params.get("access_token");

  useEffect(() => {
    if (!access_token) return;

    async function verifyTwitterUser() {
      try {
        console.log("🔄 Verifying Twitter user...");

        const res = await fetch(
          `/api/auth/twitter/verify?access_token=${access_token}`,
          { cache: "no-store" }
        );

        // Twitter verify route ALWAYS redirects -> response is NOT JSON
        if (res.redirected) {
          console.log("➡ Redirected to:", res.url);
          router.replace(res.url);
          return;
        }

        let data;
        try {
          data = await res.json();
        } catch {
          console.log(
            "⚠ Non-JSON response — callback redirect already happened."
          );
          return;
        }

        console.log("🐦 Verify data:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        // Store user in context
        setUser(data);

        router.replace(data.role === "admin" ? "/dashboard" : "/");
      } catch (err) {
        console.error("❌ Twitter login failed:", err);
        router.replace("/login");
      }
    }

    verifyTwitterUser();
  }, [access_token]);

  return (
    <div className="text-white p-10 text-center text-lg">
      Connecting your Twitter account…
    </div>
  );
}
