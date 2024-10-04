import { Banner } from "../../components/Banner";
import aboutBanner from "../../assets/images/logo/aboutBanner.png";
import RulesRegulations from "../../utils/RulesRegulations.json";
import { Collapse } from "../../components/Collapse";
import styled from "styled-components";

const AboutSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AboutWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 78%;
  margin-bottom: 1rem;
`;
export const About = () => {
  return (
    <main>
      <Banner img={aboutBanner} titre=" " style={{ height: "500px" }} />
      <AboutSection>
        {RulesRegulations.map((RulesRegulation) => {
          return (
            <AboutWrapper key={RulesRegulation.id}>
              <Collapse
                title={RulesRegulation.title}
                content={RulesRegulation.content}
              />
            </AboutWrapper>
          );
        })}
      </AboutSection>
    </main>
  );
};
