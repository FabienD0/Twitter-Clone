import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BigTweet from "./BigTweet";
import styled from "styled-components";
import Spinner from "./Spinner";
import { ContainerSpinner } from "./Spinner";
import { Home } from "./UserTweet";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Error from "./Error";

const TweetDetails = () => {
  const [tweetDetails, setTweetDetails] = useState([]);
  const { tweetId } = useParams();
  const [reloadTweet, setReloadTweet] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/tweet/${tweetId}`)
      .then((json) => json.json())
      .then((data) => {
        setTweetDetails(data.tweet);
      })
      .catch((error) => {
        setIsError(true);
      });
  }, [reloadTweet]);

  if (tweetDetails.length === 0) {
    return (
      <ContainerSpinner>
        <Spinner />
      </ContainerSpinner>
    );
  }

  if (isError) {
    return <Error />;
  }

  return (
    <Container>
      <Home>
        <ArrowBack
          onClick={() => {
            navigate(-1);
          }}
        />
        Meow
      </Home>
      <BigTweet
        key={tweetDetails.id}
        tweet={tweetDetails}
        reloadTweet={reloadTweet}
        setReloadTweet={setReloadTweet}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgb(239, 243, 244);
  border-right: 1px solid rgb(239, 243, 244);
  @media (max-width: 1000px) {
    margin: 0px 100px;
  }
`;

const ArrowBack = styled(FiArrowLeft)`
  &:hover {
    cursor: pointer;
    opacity: 70%;
  }
`;
export default TweetDetails;
