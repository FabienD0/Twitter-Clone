import { useState } from "react";
import styled from "styled-components";
import { useEffect } from "react";
import { ContainerSpinner } from "./Spinner";
import Spinner from "./Spinner";
import Error from "./Error";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { COLORS } from "../constants";

const FollowerUsers = ({ user, userProfile, reloadTweet, setReloadTweet }) => {
  const navigate = useNavigate();

  //Follow & Unfollow FUNCTION
  const isFollowed = () => {
    if (user.isBeingFollowedByYou) {
      fetch(`/api/${user.handle}/unfollow`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success === true) {
            setReloadTweet(!reloadTweet);
          }
        })
        .catch((error) => {
          return <Error />;
        });
    }
    if (!user.isBeingFollowedByYou) {
      fetch(`/api/${user.handle}/follow`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success === true) {
            setReloadTweet(!reloadTweet);
          }
        })
        .catch((error) => {
          return <Error />;
        });
    }
  };
  ///

  return (
    <Container>
      <ContainerInfoUser>
        <Avatar
          src={user.avatarSrc}
          onClick={() => navigate(`/${user.handle}`)}
        ></Avatar>
        <InfoUser>
          <p style={{ fontWeight: "bold" }}> {user.displayName}</p>
          <LinkHandle to={`/${user.handle}`}>@{user.handle}</LinkHandle>
          <p> {user.bio}</p>
        </InfoUser>
      </ContainerInfoUser>
      {user.isBeingFollowedByYou && <FollowButton>Following</FollowButton>}
      {!user.isBeingFollowedByYou && (
        <FollowButton
          style={{
            border: `2px solid ${COLORS.primary}`,
            color: `${COLORS.primary}`,
            backgroundColor: "white",
            width: "120px",
            marginRight: "50px",
          }}
          onClick={isFollowed}
        >
          Follow
        </FollowButton>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 100px;
  width: 960px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgb(239, 243, 244);
  border-bottom: 1px solid rgb(239, 243, 244);
`;

const ContainerInfoUser = styled.div`
  display: flex;
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

const InfoUser = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15em;
`;

const LinkHandle = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  opacity: 50%;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
    color: ${COLORS.primary};
  }
`;

const FollowButton = styled.button`
  background-color: ${COLORS.primary};
  color: white;
  height: 40px;
  width: 90px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  margin: 35px 15px;
  border-radius: 30px;
`;

export default FollowerUsers;
