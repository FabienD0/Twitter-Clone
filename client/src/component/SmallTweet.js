import styled, { css } from "styled-components";
import { parseISO, format } from "date-fns";
import { FiMessageCircle, FiRepeat, FiHeart, FiShare } from "react-icons/fi";
import { COLORS } from "../constants";
import { useNavigate, NavLink } from "react-router-dom";
import { CurrentUserContext } from "./CurrentUserContext";
import { useEffect, useState, useContext } from "react";
import Error from "./Error";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import HoverUser from "./HoverUser";

const Tweet = ({ tweetId, tweetsById, reloadTweet, setReloadTweet }) => {
  const navigate = useNavigate();
  const date = parseISO(tweetsById[tweetId].timestamp);
  const formatDate = format(date, "LLL do");
  const { currentUser } = useContext(CurrentUserContext);
  const [successLike, setSuccessLike] = useState(tweetsById[tweetId].isLiked);
  const [likeNumber, setNumberLike] = useState(tweetsById[tweetId].numLikes);

  const clickTweet = (e) => {
    e.preventDefault();
    navigate(`/tweet/${tweetsById[tweetId].id}`);
  };

  const isLiked = () => {
    //Remove the LIKE
    if (tweetsById[tweetId].isLiked) {
      fetch(`/api/tweet/${tweetsById[tweetId].id}/like`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ like: false }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success === true) {
            setSuccessLike(false);
            setNumberLike(0);
          }
          setReloadTweet(!reloadTweet);
        })
        .catch((error) => {
          return <Error />;
        });
      //Add a LIKE
    } else if (!tweetsById[tweetId].isLiked) {
      fetch(`/api/tweet/${tweetsById[tweetId].id}/like`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ like: true }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success === true) {
            setSuccessLike(true);
            setNumberLike(tweetsById[tweetId].numLikes + 1);
          }
          setReloadTweet(!reloadTweet);
        })
        .catch((error) => {
          return <Error />;
        });
    }
  };

  return (
    <Wrapper>
      {tweetsById[tweetId].retweetFrom && (
        <ContainerRetweet>
          <Retweet>
            <FiRepeat />
            {tweetsById[tweetId].retweetFrom.handle === currentUser.handle
              ? "You Remeowed"
              : `${tweetsById[tweetId].retweetFrom.displayName}
            Remeowed`}
          </Retweet>
        </ContainerRetweet>
      )}
      <Container>
        <StyledTippy
          placement="bottom"
          theme="light"
          delay={[500, 200]}
          arrow={false}
          content={<HoverUser user={tweetsById[tweetId]} />}
        >
          <Avatar
            src={tweetsById[tweetId].author.avatarSrc}
            onClick={() => navigate(`/${tweetsById[tweetId].author.handle}`)}
          ></Avatar>
        </StyledTippy>
        <ContainerTweet>
          <User>
            <UserName to={`/${tweetsById[tweetId].author.handle}`}>
              {tweetsById[tweetId].author.displayName}
            </UserName>
            <Handle>
              @{tweetsById[tweetId].author.handle} · {formatDate}
            </Handle>
          </User>
          <Message onClick={clickTweet}>
            <p>{tweetsById[tweetId].status}</p>
            {tweetsById[tweetId].media.length !== 0 && (
              <Media src={tweetsById[tweetId].media[0].url}></Media>
            )}
          </Message>
          <TweetActions>
            <ContainerBlue>
              <FiMessageCircle />
            </ContainerBlue>
            <ContainerGreen>
              <FiRepeat />
              {tweetsById[tweetId].retweetFrom && (
                <p
                  style={{
                    right: "-10px",
                    position: "absolute",
                    color: "black",
                  }}
                >
                  {1 + tweetsById[tweetId].numRetweets}
                </p>
              )}
            </ContainerGreen>
            <ContainerRed id={tweetsById[tweetId].id} onClick={isLiked}>
              <FiHeart
                style={
                  successLike
                    ? { fill: "red", color: "red" }
                    : { color: "black" }
                }
              />
              {likeNumber > 0 && (
                <p
                  style={{
                    right: "-10px",
                    position: "absolute",
                    color: "black",
                  }}
                >
                  {likeNumber}
                </p>
              )}
            </ContainerRed>

            <ContainerBlue>
              <FiShare />
            </ContainerBlue>
          </TweetActions>
        </ContainerTweet>
      </Container>
    </Wrapper>
  );
};

export default Tweet;

const Wrapper = styled.div`
  width: 960px;
  padding: 5px 0px;
  border-bottom: 1px solid rgb(239, 243, 244);
  border-top: 1px solid rgb(239, 243, 244);
  border-left: 1px solid rgb(239, 243, 244);
  border-right: 1px solid rgb(239, 243, 244);
  display: flex;
  align-items: center;
  flex-direction: column;
  width: auto;
  @media (max-width: 1260px) {
    margin: 0px 100px;
    width: 700px;
  }
`;

const Container = styled.div`
  display: flex;
  gap: 1em;
  margin: 15px 0px;
`;

const Retweet = styled.p`
  margin-left: 55px;
  display: flex;
  gap: 0.35em;
`;

const ContainerRetweet = styled.div`
  width: 100%;
  margin-top: 10px;
  opacity: 80%;
`;
const Avatar = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin: 0px 10px;

  &:hover {
    cursor: pointer;
    opacity: 90%;
  }
`;

const ContainerTweet = styled.div`
  font-size: 17px;
  display: flex;
  flex-direction: column;
  gap: 0.3em;
`;

const User = styled.div`
  gap: 0.25em;
  display: flex;
`;

const UserName = styled(NavLink)`
  font-weight: bold;
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: underline;
  }

  &:visited {
    color: inherit;
  }
`;

const Handle = styled.p`
  opacity: 70%;
`;

const Message = styled.div`
  width: 800px;
  &:hover {
    cursor: pointer;
  }
`;

const Media = styled.img`
  /* width: 600px;
  height: 400px; */
  width: 800px;
  height: 450px;
  border-radius: 20px;
  margin-top: 5px;
`;

export const TweetActions = styled.div`
  display: flex;
  margin: 0px -15px;
  font-size: 17px;
  gap: 9.5em;
`;

export const ContainerColor = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border: none;
  background-color: inherit;
  &:hover {
    color: ${COLORS.primary};
    background-color: rgb(76, 0, 255, 0.1);
    /* border-radius: 30px; */
    border-radius: 50%;
    cursor: pointer;
  }
`;
export const ContainerBlue = styled.button`
  ${ContainerColor}
`;

export const ContainerGreen = styled.button`
  ${ContainerColor}
  position: relative;
  &:hover {
    color: rgb(58, 243, 22, 1);
    background-color: rgb(58, 243, 22, 0.1);
  }
`;

export const ContainerRed = styled.button`
  ${ContainerColor}
  position: relative;
  &:hover {
    color: rgb(243, 42, 27, 1);
    background-color: rgb(243, 42, 27, 0.1);
  }
`;

const StyledTippy = styled(Tippy)`
  padding: 10px;
  background-color: white;
  color: black;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
`;
