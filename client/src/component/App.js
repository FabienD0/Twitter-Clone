import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Spinner from "./Spinner";
import Bookmarks from "./Bookmarks";
import Home from "./HomeFeed";
import Notifications from "./Notifications";
import Profile from "./Profile";
import TweetDetails from "./TweetDetails";
import Sidebar from "./Sidebar";
import Followers from "./Followers";
import Following from "./Following";
import Error from "./Error";
import { CurrentUserContext } from "./CurrentUserContext";

const App = () => {
  const { currentUser, status } = useContext(CurrentUserContext);

  const routes = [
    { path: "/", element: <Home /> },
    { path: "/notifications", element: <Notifications /> },
    { path: "/bookmarks", element: <Bookmarks /> },
    { path: "/tweet/:tweetId", element: <TweetDetails /> },
    { path: "/:profileId", element: <Profile /> },
    { path: "/:profileId/following", element: <Following /> },
    { path: "/:profileId/followers", element: <Followers /> },
  ];

  routes.map((route) => <Route path={route.path} element={route.element} />);

  if (status === "loading") {
    return (
      <Router>
        <ContainerLoading>
          <Sidebar />
          <ContainerSpinner>
            <Spinner />
          </ContainerSpinner>
        </ContainerLoading>
      </Router>
    );
  }

  return (
    <Router>
      <Container>
        <Sidebar />
        {status === "error" && <Error />}
        <Routes>
          {routes.map((route) => {
            return <Route path={route.path} element={route.element} />;
          })}
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

const Container = styled.div`
  display: flex;
  border-top: 1px solid rgb(239, 243, 244);
`;

const ContainerLoading = styled.div`
  /* border: 5px solid red; */
  display: flex;
`;

const ContainerSpinner = styled.div`
  display: flex;
  padding-top: 100px;
  width: 300px;
  justify-content: center;
  min-width: 800px;
`;
