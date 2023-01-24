import styled from "styled-components";

const HoverUser = ({ user }) => {
  return (
    <Container>
      <Avatar src={user.author.avatarSrc} />
      <UserName>{user.author.displayName}</UserName>
      <Handle>@{user.author.handle}</Handle>
      <p>{user.author.bio}</p>
      <div style={{ display: "flex", gap: "0.5em" }}>
        <p>
          <span style={{ fontWeight: "bold" }}>{user.author.numFollowers}</span>{" "}
          followers
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>{user.author.numFollowing}</span>{" "}
          following
        </p>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25em;
`;

const Avatar = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  /* margin: 0px 10px; */
`;

const UserName = styled.p`
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

export default HoverUser;
