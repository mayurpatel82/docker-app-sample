import React, { SyntheticEvent, useEffect } from "react";
import * as ActivitiesStore from "../store/Activities";
import { IActivity } from "../app/layout/model/activity";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import { Item, Segment, Button } from "semantic-ui-react";
import { Loading } from "./Loading";
import { loadavg } from "os";
import { Link } from "react-router-dom";

// At runtime, Redux will merge together...
type ActivitiesProps = ActivitiesStore.ActivityState &
  typeof ActivitiesStore.actionCreators;

export const ActivityList: React.FC<ActivitiesProps> = (
  props: ActivitiesProps
) => {
  useEffect(() => {
    props.requestActivities();
  }, []);

  if (props.loading) return <Loading content="Loading Activities ...." />;

  return (
    <Segment clearing>
      <Item.Group divided>
        {props.activities.map((activity: IActivity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={(e) => props.deleteActivity(e, activity.id)}
                  loading= {props.target === activity.id && props.submitting}
                  content="Delete"
                  floated="right"
                  color="red"
                  name={activity.id}
                />
                <Button
                  as={Link}
                  to={`/activities/${activity.id}`}
                  content="View"
                  floated="right"
                  color="green"
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default connect(
  (state: ApplicationState) => state.activities,
  ActivitiesStore.actionCreators
)(ActivityList as any);
