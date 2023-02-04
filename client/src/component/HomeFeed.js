import { useEffect, useState, useContext } from "react";
import Tweet from "./SmallTweet";
import styled from "styled-components";
import Spinner from "./Spinner";
import UserTweet from "./UserTweet";
import Error from "./Error";

const HomeFeed = () => {
  const [tweetIds, setTweetIds] = useState([]);
  const [tweetsById, setTweetsById] = useState([]);
  const [reloadTweet, setReloadTweet] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch("/api/me/home-feed")
      .then((json) => json.json())
      .then((data) => {
        setTweetIds(data.tweetIds);
        setTweetsById(data.tweetsById);
        setDisableButton(false);
      })
      .catch((error) => {
        setIsError(true);
      });
  }, [reloadTweet]);

  if (tweetIds.length === 0 || tweetsById.length === 0) {
    return (
      <>
        <Container>
          <UserTweet />
          <ContainerSpinner>
            <Spinner />
          </ContainerSpinner>
        </Container>
      </>
    );
  }

  if (isError) {
    return <Error />;
  }

  return (
    <Container>
      <UserTweet
        setReloadTweet={setReloadTweet}
        reloadTweet={reloadTweet}
        disableButton={disableButton}
        setDisableButton={setDisableButton}
      />
      {tweetIds.map((tweetId) => {
        return (
          <Tweet
            key={tweetId}
            tweetId={tweetId}
            tweetsById={tweetsById}
            reloadTweet={reloadTweet}
            setReloadTweet={setReloadTweet}
          />
        );
      })}
    </Container>
  );
};

export default HomeFeed;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 960px;
  @media (max-width: 1000px) {
    margin: 0px 100px;
    width: 700px;
  }
`;

const ContainerSpinner = styled.div`
  width: 900px;
  padding-top: 80px;
  display: flex;
  justify-content: center;
`;
