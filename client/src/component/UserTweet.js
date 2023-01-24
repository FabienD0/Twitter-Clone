import { useState, useContext } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "./CurrentUserContext";
import { COLORS } from "../constants";
import Error from "./Error";

const UserTweet = ({
  setReloadTweet,
  reloadTweet,
  disableButton,
  setDisableButton,
}) => {
  const [limitColor, setLimitColor] = useState("black");
  const [tweet, setTweet] = useState("");
  const { currentUser } = useContext(CurrentUserContext);

  const tweetFunction = (e) => {
    if (tweet.length < 225 || tweet.length === 0) {
      setLimitColor("black");
    } else if (tweet.length > 225 && tweet.length <= 280) {
      setLimitColor("#fdc900");
    } else if (tweet.length >= 281) {
      setLimitColor("red");
    }
    setTweet(e.target.value);
  };

  const handleSubmit = (e) => {
    setDisableButton(true);
    e.preventDefault();
    e.target.reset();
  };

  const postTweet = () => {
    fetch("/api/tweet", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: tweet }),
    })
      .then((res) => res.json())
      .then((data) => {
        setReloadTweet(!reloadTweet);
        setTweet("");
      })
      .catch((error) => {
        return <Error />;
      });
  };

  return (
    <Container>
      <Home>Home</Home>
      <WriteTweetContainer>
        <ContainerMessage>
          <ProfileAvatar src={currentUser.avatarSrc} />
          <Form onSubmit={handleSubmit}>
            <Label>
              <Input
                placeholder="What's happening?"
                type="text"
                onChange={tweetFunction}
              />
            </Label>
            <ContainerButtonTweet>
              <TextRemain
                style={
                  tweet.length === 0
                    ? { color: "black" }
                    : { color: limitColor }
                }
              >
                {280 - tweet.length}
              </TextRemain>
              <ButtonTweet
                type="submit"
                disabled={
                  tweet.length > 280
                    ? true
                    : "" || tweet.length === 0
                    ? true
                    : "" || disableButton
                }
                onClick={postTweet}
              >
                {disableButton ? "..." : "Meow"}
              </ButtonTweet>
            </ContainerButtonTweet>
          </Form>
        </ContainerMessage>
      </WriteTweetContainer>
      <Separator></Separator>
    </Container>
  );
};

export default UserTweet;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 960px;
  border-left: 1px solid rgb(239, 243, 244);
  border-right: 1px solid rgb(239, 243, 244);
  @media (max-width: 1000px) {
    width: auto;
  }
`;

export const Home = styled.h2`
  padding: 15px;
  border-bottom: 1px solid rgb(239, 243, 244);
  display: flex;
  align-items: center;
  gap: 1em;
`;

const WriteTweetContainer = styled.div`
  height: 220px;
`;

const ContainerMessage = styled.div`
  margin: 8px 0px;
  display: flex;
  height: 150px;
`;

const ContainerButtonTweet = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  height: 55px;
`;

const ButtonTweet = styled.button`
  color: white;
  font-size: 16px;
  font-weight: bold;
  background-color: ${COLORS.primary};
  width: 95px;
  height: 40px;
  border: none;
  border-radius: 30px;

  &:hover {
    cursor: pointer;
    opacity: 90%;
  }

  &:disabled {
    opacity: 50%;
    cursor: default;
  }
`;

const TextRemain = styled.p`
  margin-right: 10px;
  opacity: 65%;
  font-weight: bold;
`;

const ProfileAvatar = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin: 10px; ;
`;

const Form = styled.form`
  width: 100%;
  margin-left: 10px;
`;

const Label = styled.label``;

const Input = styled.textarea`
  font-size: 22px;
  width: 99%;
  height: 100%;
  border: none;
  outline: 0px none transparent;
  resize: none;
  padding: 10px 10px;
`;

const Separator = styled.div`
  background-color: rgba(220, 220, 220, 0.8);
  width: 100%;
  height: 5px;
`;
