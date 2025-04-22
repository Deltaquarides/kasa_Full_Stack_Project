import styled from "styled-components";

const TagsSpan = styled.span`
  display: flex;
  justify-content: center;
  color: white;
  background-color: rgb(255, 114, 97);
  padding: 3px 11px;
  border-radius: 6px;
  width: clamp(55px, 31vw, 133px);

  font-size: clamp(0.6rem, 2vw, 1rem);
`;

export const Tags = ({ content }) => {
  return (
    <>
      {content.map((spec, index) => (
        <TagsSpan key={`${spec}-${index}`}>{spec} </TagsSpan>
      ))}
    </>
  );
};
