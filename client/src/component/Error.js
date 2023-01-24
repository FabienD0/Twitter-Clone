import { GiUnlitBomb } from "react-icons/gi";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <Container>
      <BombImage />
      <H2>An unknow error has occured.</H2>
      <MessageError>
        Please try refreshing the page, or{" "}
        <LinkSupport to="/">contact support</LinkSupport> if the problem
        persists.
      </MessageError>
    </Container>
  );
};

export default Error;

const Container = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
  flex-direction: column;
  gap: 1.5em;
  width: 1000px;
  border-left: 1px solid rgb(239, 243, 244);
  border-right: 1px solid rgb(239, 243, 244);
`;

const BombImage = styled(GiUnlitBomb)`
  font-size: 74px;
  margin-bottom: 50px;
  margin-top: 50px;
`;

const MessageError = styled.p`
  font-size: 24px;
`;

const H2 = styled.h2`
  font-size: 32px;
`;

const LinkSupport = styled(Link)``;
