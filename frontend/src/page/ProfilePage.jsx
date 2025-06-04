import React, { useState, useEffect } from "react";
import { useProfileStore } from "../store/useProfileStore";
import { Trash2, Eye } from "lucide-react";
// import { useProblemStore } from "../store/useProblemStore";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);

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
    getPlaylistDetails,
  } = useProfileStore();

  // const { getProblemById } = useProblemStore();
  const [playlistDetails, setPlaylistDetails] = useState({});

  useEffect(() => {
    profileData();
    getAllSubmission();
    getAllPlaylist();
    getAllProblemsSolvedByUser();
  }, []);

  const handleDeletePlaylist = async (id) => {
    await deletePlaylist(id);
    getAllPlaylist();
  };

  // const redirecToCodeEditor = async (id) => {
  //   try {
  //     const res = await getProblemById(id);
  //   } catch (error) {}
  // };

  const handleToggleShowPlaylist = async (id) => {
    if (expandedPlaylistId === id) {
      setExpandedPlaylistId(null);
      return;
    }
    try {
      const data = await getPlaylistDetails(id);
      console.log("Data inside profile: ", data);
      if (data) {
        setPlaylistDetails((prev) => ({ ...prev, [id]: data }));
        setExpandedPlaylistId(id);
        // console.log("setPlaylistDetails:", setPlaylistDetails)
      }
    } catch (e) {
      console.error("Error fetching playlist details", e);
    }
  };

  const renderData = () => {
    if (isLoading) return <div className="text-white">Loading...</div>;

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
                <div key={playlist.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold">
                        {playlist.name}
                      </div>
                      {/* <div className="text-sm text-gray-400">
                        {playlist.count} problems
                      </div> */}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleShowPlaylist(playlist.id)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlaylist(playlist.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {expandedPlaylistId === playlist.id && (
                    <div className="mt-3 bg-gray-700 p-3 rounded">
                      {playlistDetails[playlist.id]?.problems?.length > 0 ? (
                        playlistDetails[playlist.id].problems?.map((pb) => (
                          <div
                            key={pb.id}
                            className="text-white text-sm py-1"
                          >
                           
                            <Link
                                to={`/problem/${pb.problem.id}`}
                                className="font-semibold hover:underline"
                              >
                                {pb.problem.title}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-300 text-sm">
                          No problems in this playlist.
                        </div>
                      )}
                    </div>
                  )}
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
                <div key={problem.id} className="bg-gray-800 p-4 rounded-lg">
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
    <div className="h-screen w-screen bg-[#0f172a] p-6">
      <h1 className="text-white text-3xl font-bold mb-6 text-center">
        Profile: {loggedInUser ? loggedInUser.name : "Undefined"}
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        {["submissions", "playlists", "solved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded capitalize transition-all duration-300 ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">{renderData()}</div>
    </div>
  );
};

export default ProfilePage;
