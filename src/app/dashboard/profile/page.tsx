"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { UserService } from "@/services/user.service";
import { AlertCircle, CheckCircle, User, Phone, Lock, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  
  // Profile form state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  
  // Pass form state
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // UI state
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    try {
      await updateProfile({ fullName, phoneNumber });
      setProfileMsg("Profile details saved successfully.");
    } catch {
      setProfileMsg("Failed to update details.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    setPassMsg(null);
    setPassErr(null);

    if (newPass !== confirmPass) {
      setPassErr("New passwords do not match.");
      setPassLoading(false);
      return;
    }

    try {
      const res = await UserService.changePassword({ oldPass, newPass });
      setPassMsg(res.message);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch {
      setPassErr("Failed to update password.");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Account Profile</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your personal details and adjust credential passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Info */}
        <div className="lg:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>Profile Details</span>
          </h3>

          {profileMsg && (
            <div className="p-3.5 bg-success/15 border border-success/30 rounded-xl text-xs text-success flex items-center gap-2 font-medium">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{profileMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
            {/* Email (Read Only) */}
            <div className="space-y-1.5 opacity-70">
              <label className="text-xs font-semibold">Email Address (Cannot change)</label>
              <input
                type="email"
                disabled
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted border border-border text-foreground font-mono"
                value={user?.email}
              />
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Phone Number</label>
              <input
                type="text"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
            >
              {profileLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : null}
              <span>Save Details</span>
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="lg:col-span-6 bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <span>Change Password</span>
          </h3>

          {passMsg && (
            <div className="p-3.5 bg-success/15 border border-success/30 rounded-xl text-xs text-success flex items-center gap-2 font-medium">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{passMsg}</span>
            </div>
          )}

          {passErr && (
            <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{passErr}</span>
            </div>
          )}

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            {/* Old Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Old Password</label>
              <input
                type="password"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
              />
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">New Password</label>
              <input
                type="password"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
            >
              {passLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : null}
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
