const OMNISEND_API_KEY = process.env.OMNISEND_API_KEY;
const OMNISEND_API_URL =
  process.env.OMNISEND_API_URL || "https://api.omnisend.com/v5";

class OmnisendService {
  static async _request(path, method = "GET", body = null) {
    const url = `${OMNISEND_API_URL}/${path}`;
    console.log(`[OmnisendService] ${method} Request to:`, url);
    if (body) console.log("[OmnisendService] Request body:", body);

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OMNISEND_API_KEY,
      },
      body: body ? JSON.stringify(body) : null,
    });

    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      console.warn("[OmnisendService] Failed to parse response JSON:", text);
    }

    if (!res.ok && res.status !== 409) {
      const err = (json && json.message) || text || `status ${res.status}`;
      const e = new Error(`Omnisend ${method} ${path} failed: ${err}`);
      e.status = res.status;
      e.body = json;
      console.error("[OmnisendService] Request error:", e);
      throw e;
    }

    console.log("[OmnisendService] Response:", json);
    return json;
  }

  // Get contact by email using filter query
  static async getContactByEmail(email) {
    console.log(`[OmnisendService] Searching contact by email: ${email}`);
    const encoded = encodeURIComponent(email);
    const json = await this._request(`contacts?email=${encoded}`, "GET");

    if (json && Array.isArray(json.contacts) && json.contacts.length > 0) {
      const contact = json.contacts[0];
      console.log("[OmnisendService] Contact found:", contact);
      return contact;
    }

    console.log("[OmnisendService] Contact not found");
    return null;
  }

  // Create a new contact with tags
  static async createContact(email, tags = []) {
    console.log(
      `[OmnisendService] Creating contact: ${email} with tags:`,
      tags
    );
    const payload = {
      identifiers: [
        {
          type: "email",
          id: email,
          channels: {
            email: {
              status: "subscribed",
              statusDate: new Date().toISOString(),
            },
          },
        },
      ],
      source: "payment_success",
      tags,
    };

    const result = await this._request("contacts", "POST", payload);
    console.log("[OmnisendService] Contact created:", result);
    return result;
  }

  // Update existing contact tags

  static async updateContactTags(contactID, finalTags = []) {
    console.log(
      `[OmnisendService] Replacing tags for contact ${contactID}:`,
      finalTags
    );

    const result = await this._request(`contacts/${contactID}`, "PATCH", {
      tags: finalTags, // FULL REPLACEMENT HERE
    });

    console.log("[OmnisendService] Contact tags fully replaced:", result);
    return result;
  }

  // Upsert contact: create if not exists, else update tags
  static async upsertContactWithTags(email, newTags = []) {
    console.log(
      `[OmnisendService] Upserting contact: ${email} with tags:`,
      newTags
    );

    const contact = await this.getContactByEmail(email);

    // List of plan tags you want to auto-remove
    const PLAN_TAGS = [
      "monthly-recurring-plan",
      "30-day-onetime-plan",
      "90-day-onetime-plan",
      "subscription-purchased",
    ];

    if (contact) {
      // Remove old plan tags from existing
      const cleanedExistingTags = (contact.tags || []).filter(
        (tag) => !PLAN_TAGS.includes(tag)
      );

      console.log("cleaned tags -->", cleanedExistingTags);

      // Merge cleaned tags + new tags
      const updatedTags = Array.from(
        new Set([...cleanedExistingTags, ...newTags])
      );

      console.log(
        `[OmnisendService] Updating tags after cleanup:`,
        updatedTags
      );

      await this.updateContactTags(contact.contactID, updatedTags);

      // verify new tags updated in backend (for testing)
      const verify = await this.getContactByEmail(email);
      console.log("🔥 VERIFIED TAGS FROM API AFTER UPDATE:", verify.tags);

      return { action: "tags_updated", contact };
    } else {
      // New contact → create normally
      const created = await this.createContact(email, newTags);
      return { action: "created", created };
    }
  }
}

export default OmnisendService;
