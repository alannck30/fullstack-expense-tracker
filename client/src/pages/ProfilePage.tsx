import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import ProfileView from "@/components/Profile/ProfileView";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

function ProfilePage() {
  const { getProfile, user, isLoading, error } = useAuthStore();

  const [mode, setMode] = useState<"view" | "edit">("view");

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  function handleEdit() {
    setMode("edit");
  }

  function handleCancel() {
    setMode("view");
  }

  return (
    <main className="bg-slate-950 px-4 py-8 sm:px-8 sm:py-12 grid gap-8 grid-cols-1 md:grid-cols-2">
      {isLoading && (
        <div className="flex justify-center items-center py-24">
          <p className="text-gray-400 text-lg">Loading Profile...</p>
        </div>
      )}
      {error && mode === "view" && (
        <div className="mb-4 px-4 py-3 bg-red-900/20 border border-red-700 rounded-sm text-red-400 max-w-2xl">
          <p className="px-4 py-3 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
            {error}
          </p>
        </div>
      )}
      {!isLoading && user && mode === "view" ? (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
          <ProfileView user={user} />
          <button
            onClick={handleEdit}
            className="px-6 py-3 bg-purple-950 text-gray-100 rounded-sm hover:bg-purple-800 transition-colors cursor-pointer border border-purple-700 font-medium self-start">
            Edit Profile
          </button>
        </div>
      ) : (
        <ProfileEditForm onCancel={handleCancel} />
      )}
    </main>
  );
}

export default ProfilePage;
