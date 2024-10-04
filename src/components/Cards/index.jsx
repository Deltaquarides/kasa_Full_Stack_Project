import styled from "styled-components";

const HostNameWrapper = styled.span`
  font-size: clamp(1rem, 2vw, 1.188rem);
  color: rgb(255, 114, 97);
  width: min-content;
  text-align: end;
`;

const HostPictureWrapper = styled.div`
  width: 98px;
  @media screen and (max-width: 480px) {
    width: 54px;
  }
`;
const HostPicture = styled.img`
  border-radius: 50%;
  width: -webkit-fill-available;
`;

export const Cards = ({ name, pic }) => {
  return (
    <>
      <HostNameWrapper>{name}</HostNameWrapper>
      <HostPictureWrapper>
        <HostPicture src={pic} alt="portrait" />
      </HostPictureWrapper>
    </>
  );
};
