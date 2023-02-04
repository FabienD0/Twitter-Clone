import { Home } from "./UserTweet";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ContainerSpinner } from "./Spinner";
import Error from "./Error";
import { FiArrowLeft } from "react-icons/fi";
import styled from "styled-components";
import { COLORS } from "../constants";
import FollowerUsers from "./FollowerUsers";

const Followers = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState([]);
  const [followerUsers, setFollowerUsers] = useState([]);
  const [reloadTweet, setReloadTweet] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch(`/api/${profileId}/profile`)
      .then((json) => json.json())
      .then((data) => {
        setUserProfile(data.profile);
        if (data.error === "user-not-found") {
          navigate(`/`);
          window.alert("User Not Found");
        }
      })
      .catch((error) => {
        setIsError(true);
      });

    fetch(`/api/${profileId}/followers`)
      .then((json) => json.json())
      .then((data) => {
        setFollowerUsers(data.followers);
      })
      .catch((error) => {
        setIsError(true);
      });
  }, [reloadTweet]);

  if (userProfile.length === 0) {
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          {userProfile.displayName}
          <Handle to={`/${userProfile.handle}`}>@{userProfile.handle}</Handle>
        </div>
      </Home>
      <UserMenuLink>
        <MenuLink>Followers you know</MenuLink>
        <MenuLink className="active">Followers</MenuLink>
        <MenuLink
          onClick={() => {
            navigate(`/${userProfile.handle}/following`);
          }}
        >
          Following
        </MenuLink>
      </UserMenuLink>
      <ContainerUsers>
        {followerUsers.map((user) => {
          return (
            <FollowerUsers
              key={user.handle}
              profileId={profileId}
              user={user}
              userProfile={userProfile}
              reloadTweet={reloadTweet}
              setReloadTweet={setReloadTweet}
            />
          );
        })}
      </ContainerUsers>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgb(239, 243, 244);
  border-right: 1px solid rgb(239, 243, 244);
  width: 960px;
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

const Handle = styled(NavLink)`
  font-size: 14px;
  text-decoration: none;
  opacity: 50%;
  color: inherit;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  &:visited {
    color: inherit;
  }
`;

const UserMenuLink = styled.div`
  height: 100px;
  display: flex;
  color: inherit;
  justify-content: space-around;
  border-bottom: 1.5px solid rgba(195, 195, 195, 0.3);
`;

const MenuLink = styled.button`
  background: none;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  border: none;
  width: 100%;
  text-align: center;

  &.active {
    color: ${COLORS.primary};
    border-bottom: 3px solid ${COLORS.primary};
  }
  &:hover {
    background-color: rgba(195, 195, 195, 0.3);
    cursor: pointer;
  }

  &:visited {
    color: inherit;
  }
`;

const ContainerUsers = styled.div``;
export default Followers;
