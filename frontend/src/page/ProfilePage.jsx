// import React, {useState, useEffect } from "react";
// import { useProfileStore } from "../store/useProfileStore";



// const ProfilePage = () => {
//   const [activeTab, setActiveTab] = useState("submissions");

//   const {
//     loggedInUser,
//     isLoading,
//     getSolvedProblems,
//     getPlaylists,
//     getRecentSubmissions,
//     profileData,
//     getAllProblemsSolvedByUser,
//     getAllPlaylist,
//     getAllSubmission,
//   } = useProfileStore();

//   useEffect(() => {
//     profileData();
//     getAllSubmission();
//     getAllPlaylist();
//     getAllProblemsSolvedByUser();
//   }, []);

//   const renderData = () => {
//     if (isLoading) {
//       return <div className="text-white">Loading...</div>;
//     }

//     switch (activeTab) {
//       case "submissions":
//         return getRecentSubmissions && getRecentSubmissions.length > 0 ? (
//           getRecentSubmissions.map((submission) => (
//             <div key={submission.id} className="text-white p-2">
//               {submission.problem.title} - {submission.status}
//             </div>
//           ))
//         ) : (
//           <div className="text-white">No submissions found.</div>
//         );
//       case "playlists":
//         return getPlaylists && getPlaylists.length > 0 ? (
//           getPlaylists.map((playlist) => (
//             <div key={playlist.id} className="text-white p-2">
//               {playlist.name} ({playlist.count} problems)
//             </div>
//           ))
//         ) : (
//           <div className="text-white">No playlists found.</div>
//         );
//       case "solved":
//         return getSolvedProblems && getSolvedProblems.length > 0 ? (
//           getSolvedProblems.map((problem) => (
//             <div key={problem.id} className="text-white p-2">
//               {problem.title}
//             </div>
//           ))
//         ) : (
//           <div className="text-white">No solved problems found.</div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="h-screen bg-[#0f172a] text-center py-10">
//       <h1 className="text-white text-2xl mb-6">Profile: {loggedInUser ? loggedInUser.name : "Undefined"}</h1>
//       <div className="flex justify-center gap-4 mb-8">
//         <button
//           onClick={() => setActiveTab("submissions")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "submissions"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-700 text-gray-300"
//           }`}
//         >
//           Submissions
//         </button>
//         <button
//           onClick={() => setActiveTab("playlists")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "playlists"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-700 text-gray-300"
//           }`}
//         >
//           Playlists
//         </button>
//         <button
//           onClick={() => setActiveTab("solved")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "solved"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-700 text-gray-300"
//           }`}
//         >
//           Solved Problems
//         </button>
//       </div>
//       <div>{renderData()}</div>
//     </div>
//   );
// };

// export default ProfilePage;



import React, { useState, useEffect } from "react";
import { useProfileStore } from "../store/useProfileStore";
import { Trash2 } from "lucide-react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("submissions");

  const {
    loggedInUser,
    isLoading,
    getSolvedProblems,
    getPlaylists,
    getRecentSubmissions,
    profileData,
    getAllProblemsSolvedByUser,
    getAllPlaylist,
    getAllSubmission,
    deletePlaylist,
  } = useProfileStore();

  useEffect(() => {
    profileData();
    getAllSubmission();
    getAllPlaylist();
    getAllProblemsSolvedByUser();
  }, []);

  const handleDeletePlaylist = async (id) => {
    await deletePlaylist(id);
    getAllPlaylist(); // Refresh after deletion
  };

  const renderData = () => {
    if (isLoading) {
      return <div className="text-white">Loading...</div>;
    }

    switch (activeTab) {
      case "submissions":
        return (
          <div className="space-y-2">
            {getRecentSubmissions.length > 0 ? (
              getRecentSubmissions.map((submission) => (
                <div key={submission.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-lg font-medium">
                    {submission.problem.title}
                  </div>
                  <div
                    className={`text-sm ${
                      submission.status === "Accepted"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {submission.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No submissions found.</div>
            )}
          </div>
        );

      case "playlists":
        return (
          <div className="space-y-4">
            {getPlaylists.length > 0 ? (
              getPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="text-lg font-semibold">{playlist.name}</div>
                    <div className="text-sm text-gray-400">
                      {playlist.count} problems
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePlaylist(playlist.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No playlists found.</div>
            )}
          </div>
        );

      case "solved":
        return (
          <div className="space-y-2">
            {getSolvedProblems.length > 0 ? (
              getSolvedProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-gray-800 p-4 rounded-lg text-white"
                >
                  {problem.title}
                </div>
              ))
            ) : (
              <div className="text-gray-400">No solved problems found.</div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0f172a] text-white flex flex-col">
      <header className="py-6 px-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">
          Profile: {loggedInUser ? loggedInUser.name : "Loading..."}
        </h1>
      </header>

      <nav className="flex justify-center gap-4 py-4 border-b border-gray-700">
        {["submissions", "playlists", "solved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-md transition duration-200 ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto px-6 py-4">{renderData()}</main>
    </div>
  );
};

export default ProfilePage;
