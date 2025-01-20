import MainContent from "../components/MainContent";
import UserSuggetionSection from "../components/UserSuggetionSection";
import useGetAllPosts from "../hooks/useGetAllPosts";
import useGetAllSuggestedUsers from "../hooks/useGetAllSuggestedUsers";
import useGetLatestMessages from "../hooks/useGetLatestMessages";

export default function Home() {
  useGetAllPosts();
  useGetAllSuggestedUsers();
  useGetLatestMessages();

  return (
    <>
      <div className="flex-manage ">
        <MainContent />
        <UserSuggetionSection />
      </div>
    </>
  );
}
