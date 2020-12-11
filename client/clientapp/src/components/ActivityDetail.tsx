import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import { IActivity } from "../app/layout/model/activity";
import { ApplicationState } from "../store";
import * as ActivitiesStore from "../store/Activities";
import { Loading } from "./Loading";

interface IActivityDetail {
  id: string;
}

// At runtime, Redux will merge together...
type ActivitiesProps = ActivitiesStore.ActivityState &
  typeof ActivitiesStore.actionCreators &
  RouteComponentProps<IActivityDetail>;

export const ActivityDetail: React.FC<ActivitiesProps> = (
  props: ActivitiesProps
) => {
  useEffect(() => {
    props.loadingActivity(props.match.params.id);
  }, [props.loadingActivity, props.match.params.id]);

  if (props.loading || !props.selectedActivity)
    return <Loading content="Loading Activities ...." />;

  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${props.selectedActivity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{props.selectedActivity!.title}</Card.Header>
        <Card.Meta>
          <span>{props.selectedActivity!.date}</span>
        </Card.Meta>
        <Card.Description>
          {props.selectedActivity!.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            as={Link}
            to={`/manage/${props.selectedActivity.id}`}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            onClick={() => props.history.push("/activities")}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default connect(
  (state: ApplicationState) => state.activities,
  ActivitiesStore.actionCreators
)(ActivityDetail as any);
