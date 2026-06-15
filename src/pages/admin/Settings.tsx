import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, LogOut, Check } from "lucide-react";
import { PageHeader } from "../../components/admin/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { useAppData } from "../../store/AppDataProvider";
import { useAuth } from "../../store/AuthContext";
import { uploadAvatar } from "../../store/supabaseRepo";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white focus:ring-2 focus:ring-teal/20";

export function Settings() {
  const { currentUser, upsertUser } = useAppData();
  const { user: authUser, logout, updatePassword } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser?.name ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  // currentUser is null only briefly before data loads (AdminLayout shows a spinner).
  if (!currentUser) return null;

  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg(null);
    upsertUser({ ...currentUser, name: name.trim() || currentUser.name });
    setSavingProfile(false);
    setProfileMsg("Profile saved.");
    setTimeout(() => setProfileMsg(null), 2500);
  };

  const onAvatar = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setProfileMsg(null);
    try {
      const url = await uploadAvatar(file, currentUser.id);
      upsertUser({ ...currentUser, avatar_url: url, name: name.trim() || currentUser.name });
      setProfileMsg("Avatar updated.");
      setTimeout(() => setProfileMsg(null), 2500);
    } catch (e) {
      setProfileMsg(e instanceof Error ? e.message : "Avatar upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwErr(null);
    setPwMsg(null);
    if (pw !== pw2) {
      setPwErr("Passwords don't match.");
      return;
    }
    setPwSaving(true);
    const res = await updatePassword(pw);
    setPwSaving(false);
    if (res.ok) {
      setPw("");
      setPw2("");
      setPwMsg("Password changed.");
      setTimeout(() => setPwMsg(null), 2500);
    } else {
      setPwErr(res.error ?? "Could not change password.");
    }
  };

  const signOut = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your profile and account." />

      {/* Profile */}
      <Card className="mb-6">
        <h3 className="mb-4 font-display text-lg font-bold text-navy">Profile</h3>
        <div className="flex items-center gap-4">
          <Avatar
            name={currentUser.name}
            color={currentUser.avatar_color}
            url={currentUser.avatar_url}
            className="h-16 w-16 text-lg"
          />
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onAvatar(e.target.files?.[0])}
            />
            <Button variant="outline" size="sm" icon={Camera} onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading…" : "Change avatar"}
            </Button>
            <p className="mt-1 text-xs text-slate-400">PNG or JPG, square works best.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Email</span>
            <input value={authUser?.email ?? ""} className={`${inputClass} cursor-not-allowed opacity-60`} disabled />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Role</span>
            <input value={currentUser.role} className={`${inputClass} cursor-not-allowed opacity-60`} disabled />
          </label>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Button onClick={saveProfile} disabled={savingProfile}>
            {savingProfile ? "Saving…" : "Save profile"}
          </Button>
          {profileMsg && (
            <span className="flex items-center gap-1 text-sm text-teal-dark">
              <Check className="h-4 w-4" /> {profileMsg}
            </span>
          )}
        </div>
      </Card>

      {/* Password */}
      <Card className="mb-6">
        <h3 className="mb-4 font-display text-lg font-bold text-navy">Change password</h3>
        <form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">New password</span>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputClass} autoComplete="new-password" minLength={6} required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Confirm password</span>
            <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputClass} autoComplete="new-password" minLength={6} required />
          </label>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={pwSaving}>
              {pwSaving ? "Updating…" : "Update password"}
            </Button>
            {pwMsg && (
              <span className="flex items-center gap-1 text-sm text-teal-dark">
                <Check className="h-4 w-4" /> {pwMsg}
              </span>
            )}
            {pwErr && <span className="text-sm text-rose-600">{pwErr}</span>}
          </div>
        </form>
      </Card>

      {/* Session */}
      <Card>
        <h3 className="mb-1 font-display text-lg font-bold text-navy">Session</h3>
        <p className="mb-4 text-sm text-slate-500">Sign out of the StrtDigital dashboard on this device.</p>
        <Button variant="outline" icon={LogOut} onClick={signOut} className="text-rose-600 hover:border-rose-300 hover:text-rose-700">
          Sign out
        </Button>
      </Card>
    </div>
  );
}
