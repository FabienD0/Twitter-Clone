import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import Tweet from "./SmallTweet";
import styled from "styled-components";
import Spinner from "./Spinner";
import Error from "./Error";
import { ContainerSpinner } from "./Spinner";
import { COLORS } from "../constants";
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { parseISO, format, set } from "date-fns";

const Profile = () => {
  const [tweetIds, setTweetIds] = useState([]);
  const [tweetsById, setTweetsById] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const navigate = useNavigate();
  const [reloadTweet, setReloadTweet] = useState(false);
  const { profileId } = useParams();
  const [isError, setIsError] = useState(false);

  //Get User Profile
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

    fetch(`/api/${profileId}/feed`)
      .then((json) => json.json())
      .then((data) => {
        setTweetIds(data.tweetIds);
        setTweetsById(data.tweetsById);
      })
      .catch((error) => {
        setIsError(true);
      });
  }, [profileId, reloadTweet]);

  const isFollowed = () => {
    if (userProfile.isBeingFollowedByYou) {
      fetch(`/api/${userProfile.handle}/unfollow`, {
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
          setIsError(true);
        });
    }
    if (!userProfile.isBeingFollowedByYou) {
      fetch(`/api/${userProfile.handle}/follow`, {
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
          setIsError(true);
        });
    }
  };

  if (isError) {
    return <Error />;
  }

  if (
    tweetIds.length === 0 &&
    tweetsById.length === 0 &&
    userProfile.length === 0
  ) {
    return (
      <ContainerSpinner>
        <Spinner />
      </ContainerSpinner>
    );
  }
  return (
    <Container>
      <Header>
        <Banner src={userProfile.bannerSrc} />
        <Avatar src={userProfile.avatarSrc} />
      </Header>
      <ContainerUser>
        <ContainerTop>
          {userProfile.isBeingFollowedByYou &&
            userProfile.handle !== "treasurymog" && (
              <FollowButton onClick={isFollowed}>Following</FollowButton>
            )}
          {!userProfile.isBeingFollowedByYou &&
            userProfile.handle !== "treasurymog" && (
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
        </ContainerTop>
        <ContainerInfoUser>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            {userProfile.displayName}
          </p>
          <Separator>
            <p style={{ opacity: "70%" }}>@{userProfile.handle}</p>
            {userProfile.isFollowingYou && <FollowText>Follows you</FollowText>}
          </Separator>
          <Bio>{userProfile.bio}</Bio>
          <Separator style={{ margin: "12px 0px" }}>
            <FiMapPin />
            <p style={{ marginRight: "15px" }}>{userProfile.location}</p>
            <FiCalendar />
            {userProfile.joined && (
              <p>Joined {format(parseISO(userProfile.joined), "MMMM yyy")}</p>
            )}
          </Separator>
          <Separator>
            <FollowLinks
              to={`/${userProfile.handle}/following`}
              style={{ marginRight: "22px" }}
            >
              {userProfile.numFollowing} Following
            </FollowLinks>
            <FollowLinks to={`/${userProfile.handle}/followers`}>
              {userProfile.numFollowers} Followers
            </FollowLinks>
          </Separator>
        </ContainerInfoUser>
        <UserMenuLink>
          <MenuLink className="active">Tweets</MenuLink>
          <MenuLink>Media</MenuLink>
          <MenuLink>Likes</MenuLink>
        </UserMenuLink>
      </ContainerUser>
      <ContainerTweet>
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
      </ContainerTweet>
    </Container>
  );
};

//Styled
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 960px;
  border-left: 1px solid rgb(239, 243, 244);
  border-right: 1px solid rgb(239, 243, 244);
  @media (max-width: 1260px) {
    /* margin: 0px 100px; */
    /* width: 700px; */
  }
`;

const Header = styled.header`
  position: relative;
  height: 320px;
`;

const Banner = styled.img`
  width: 100%;
  height: 320px;
`;

const Avatar = styled.img`
  position: absolute;
  border-radius: 50%;
  width: 200px;
  border: 4px solid white;
  left: 20px;
  bottom: -99px;
`;

const ContainerUser = styled.div`
  height: 300px;
  font-size: 18px;
`;

const ContainerTop = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 100px;
`;

const FollowButton = styled.button`
  background-color: ${COLORS.primary};
  color: white;
  height: 60px;
  width: 180px;
  font-size: 1.3em;
  font-weight: bold;
  border: none;
  margin: 35px 15px;
  border-radius: 30px;

  &:hover {
    cursor: pointer;
    opacity: 90%;
  }
`;

const ContainerInfoUser = styled.div`
  height: 200px;
  padding: 15px 25px;
`;

const Separator = styled.div`
  display: flex;
  gap: 0.3em;
  align-items: center;
`;

const FollowText = styled.p`
  background-color: #e8e9ef;
  padding: 2px 7px;
  border-radius: 8px;
  opacity: 80%;
`;

const Bio = styled.p`
  margin: 12px 0px;
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

const FollowLinks = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  &:hover {
    border-bottom: 1px solid black;
    cursor: pointer;
  }
  &:visited {
    color: inherit;
  }
`;

const ContainerTweet = styled.div`
  margin: 100px 0px;
`;

export default Profile;
