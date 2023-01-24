import styled from "styled-components";
import { ReactComponent as CatLogo } from "../images/logo.svg";
import { NavLink, redirect } from "react-router-dom";
import { COLORS } from "../constants";
import { FiHome, FiUser, FiBell, FiBookmark } from "react-icons/fi";
import { CurrentUserContext } from "./CurrentUserContext";
import { useContext, useState } from "react";

const Sidebar = () => {
  // const { currentUser, status } = useContext(CurrentUserContext);

  return (
    <Wrapper>
      <Container>
        <Cat />
        <NavigationLink to="/">
          <Home />
          <TextMenu>Home</TextMenu>
        </NavigationLink>
        {/* <NavigationLink to={`${currentUser.handle}`}> */}
        <NavigationLink to="/treasurymog">
          <User />
          <TextMenu>Profile</TextMenu>
        </NavigationLink>
        <NavigationLink to="/notifications">
          <Bell />
          <TextMenu>Notifications</TextMenu>
        </NavigationLink>
        <NavigationLink to="/bookmarks">
          <Bookmark />
          <TextMenu>Bookmarks</TextMenu>
        </NavigationLink>
        <MeowButton></MeowButton>
      </Container>
    </Wrapper>
  );
};

export default Sidebar;

const Wrapper = styled.div`
  height: 600px;
  width: 300px;
  margin: 0px 50px;
  @media (max-width: 1260px) {
    width: 130px;
    margin: 0px 5px;
  }
`;

const Container = styled.div`
  position: fixed;
  /* position: sticky; */
  display: flex;
  flex-direction: column;
  width: 300px;
  height: fit-content;
  margin: 25px 0px;
`;

const Cat = styled(CatLogo)`
  min-width: 80px;
  min-height: 80px;
  margin-bottom: 15px;
`;
const NavigationLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  margin: 15px 12px;
  border-radius: 30px;
  text-decoration: none;
  width: fit-content;

  &:hover {
    background-color: rgb(76, 0, 255, 0.1);
  }

  &:visited {
    color: inherit;
  }
  &.active {
    color: ${COLORS.primary};
  }
  @media (max-width: 1260px) {
  }
`;

const TextMenu = styled.p`
  font-size: 24px;
  font-weight: bold;
  @media (max-width: 1260px) {
    display: none;
  }
`;

const Home = styled(FiHome)`
  font-size: 32px;
  margin-right: 20px;
  @media (max-width: 1260px) {
    margin: 0px;
  }
`;

const User = styled(FiUser)`
  font-size: 32px;
  margin-right: 20px;
  @media (max-width: 1260px) {
    margin: 0px;
  }
`;

const Bell = styled(FiBell)`
  font-size: 32px;
  margin-right: 20px;
  @media (max-width: 1260px) {
    margin: 0px;
  }
`;

const Bookmark = styled(FiBookmark)`
  font-size: 32px;
  margin-right: 20px;
  @media (max-width: 1260px) {
    margin: 0px;
  }
`;

const MeowButton = styled.button`
  height: 50px;
  background-color: ${COLORS.primary};
  border: none;
  font-size: 24px;
  color: white;
  width: 250px;
  margin: 10px 15px;
  border-radius: 30px;

  &:after {
    content: "Meow";
  }
  &:hover {
    opacity: 80%;
    cursor: pointer;
  }

  @media (max-width: 1260px) {
    margin-left: 25px;
    width: 50px;
    &:after {
      content: "🐈";
    }
    &:hover {
      opacity: 100%;
      &:after {
        content: "🐈‍⬛";
      }
    }
  }
`;
