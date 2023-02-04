import styled, { css } from "styled-components";
import { parseISO, format } from "date-fns";
import { FiMessageCircle, FiRepeat, FiHeart, FiShare } from "react-icons/fi";
import { COLORS } from "../constants";
import {
  TweetActions,
  ContainerColor,
  ContainerBlue,
  ContainerGreen,
  ContainerRed,
} from "./SmallTweet";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Error from "./Error";

const BigTweet = ({ tweet, reloadTweet, setReloadTweet }) => {
  const navigate = useNavigate();
  const date = parseISO(tweet.timestamp);
  const formatDate = format(date, "p LLL d y");
  const [successLike, setSuccessLike] = useState(tweet.isLiked);
  const [likeNumber, setNumberLike] = useState(tweet.numLikes);
  const [isError, setIsError] = useState(false);

  const isLiked = () => {
    //Remove the LIKE
    if (tweet.isLiked) {
      fetch(`/api/tweet/${tweet.id}/like`, {
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
          setIsError(true);
        });
      //Add a LIKE
    } else if (!tweet.isLiked) {
      fetch(`/api/tweet/${tweet.id}/like`, {
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
            setNumberLike(tweet.numLikes + 1);
          }
          setReloadTweet(!reloadTweet);
        })
        .catch((error) => {
          return <Error />;
        });
    }
  };

  if (isError) {
    return <Error />;
  }

  return (
    <Wrapper>
      <ContainerTweet>
        <User>
          <Avatar
            src={tweet.author.avatarSrc}
            onClick={() => navigate(`/${tweet.author.handle}`)}
          ></Avatar>
          <ContainerUserName>
            <UserName to={`/${tweet.author.handle}`}>
              {tweet.author.displayName}
            </UserName>
            <Handle style={{ fontSize: "14px" }}>@{tweet.author.handle}</Handle>
          </ContainerUserName>
        </User>
        <Message>
          <p>{tweet.status}</p>
          {tweet.media.length !== 0 && <Media src={tweet.media[0].url}></Media>}
        </Message>
        <Time>{formatDate} · Critter web app</Time>
        <TweetActions style={{ justifyContent: "center" }}>
          <ContainerBlue>
            <FiMessageCircle />
          </ContainerBlue>
          <ContainerGreen>
            <FiRepeat />
          </ContainerGreen>
          <ContainerRed id={tweet.id} onClick={isLiked}>
            <FiHeart
              style={
                successLike ? { fill: "red", color: "red" } : { color: "black" }
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
    </Wrapper>
  );
};

export default BigTweet;

const Wrapper = styled.div`
  width: 950px;
  padding: 5px 0px;
  border-bottom: 1px solid rgb(239, 243, 244);
  border-top: 1px solid rgb(239, 243, 244);
  display: flex;
  align-items: center;
  width: fit-content;
`;

const Avatar = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
    opacity: 90%;
  }
`;

const ContainerUserName = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 10px;
`;

const ContainerTweet = styled.div`
  font-size: 17px;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  /* border: 2px solid red; */
`;

const User = styled.div`
  gap: 0.25em;
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-top: 15px;
`;

const UserName = styled(NavLink)`
  font-weight: bold;
  text-decoration: none;

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
  width: 900px;
  /* font-weight: bold; */
  font-size: 24px;
  padding-left: 15px;
`;

const Time = styled.p`
  border-bottom: 1px solid rgb(239, 243, 244);
  padding-bottom: 15px;
  padding-left: 15px;
`;
const Media = styled.img`
  /* width: 600px;
  height: 400px; */
  width: 900px;
  height: 550px;
  border-radius: 20px;
  margin-top: 5px;
`;
