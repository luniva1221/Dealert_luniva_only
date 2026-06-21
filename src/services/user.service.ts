import { UserProfile } from "@/types/user";

export const UserService = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    } catch {
      if (typeof window === "undefined") throw new Error("Window undefined");
      const user = localStorage.getItem("dealert_user");
      if (!user) throw new Error("Unauthorized");
      return JSON.parse(user);
    }
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    } catch {
      if (typeof window === "undefined") throw new Error("Window undefined");
      const userStr = localStorage.getItem("dealert_user");
      if (!userStr) throw new Error("Unauthorized");
      const user: UserProfile = JSON.parse(userStr);
      const updated = { ...user, ...data };
      localStorage.setItem("dealert_user", JSON.stringify(updated));
      return updated;
    }
  },

  changePassword: async (data: {
    oldPass: string;
    newPass: string;
  }): Promise<{ success: boolean; message: string }> => {
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) {
      throw new Error(resData.error || "Failed to change password");
    }
    return resData;
  }
};
