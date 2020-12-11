import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";
import { ApplicationState } from "../store";
import * as ActivitiesStore from "../store/Activities";

// At runtime, Redux will merge together...
type ActivitiesProps = ActivitiesStore.ActivityState &
  typeof ActivitiesStore.actionCreators;

export const NavBar: React.FC<ActivitiesProps> = (props: ActivitiesProps) => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header exact as={NavLink} to="/">
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} to="/activities" />
        <Menu.Item name="friends">
          <Button
            positive
            content="Create Activity"
            as={NavLink}
            to="/createActivity"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default connect(
  (state: ApplicationState) => state.activities,
  ActivitiesStore.actionCreators
)(NavBar as any);
