export const subscribeNewsLetter = async (email) => {
  try {
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Subscription failed");
    }
  } catch (err) {
    console.error("Newsletter subscription error:", err.message);
  }
};
