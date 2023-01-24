import { MdConstruction } from "react-icons/md";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Notifications = () => {
  return (
    <Container>
      <ConstructionImage />
      <H2>Page under construction.</H2>
      <MessageError>
        Go back to <LinkSupport to="/">Home</LinkSupport>
      </MessageError>
    </Container>
  );
};

export default Notifications;

const Container = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
  flex-direction: column;
  width: 1000px;
  border-left: 1px solid rgb(239, 243, 244);
  border-right: 1px solid rgb(239, 243, 244);
`;

const ConstructionImage = styled(MdConstruction)`
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
