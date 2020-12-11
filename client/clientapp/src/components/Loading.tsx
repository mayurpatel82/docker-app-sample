import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

export const Loading: React.FC<{inverted?: string; content?: string;}> = ({ inverted = true, content }) => {
  return (
    <Dimmer active inverted={inverted}>
      <Loader content={content} />
    </Dimmer>
  );
};