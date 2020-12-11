import React, { FormEvent, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../app/layout/model/activity";
import { v4 as uuid } from "uuid";
import * as ActivitiesStore from "../store/Activities";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import { RouteComponentProps } from "react-router";

interface IActivityDetail {
  id: string;
}

// At runtime, Redux will merge together...
type ActivitiesProps = ActivitiesStore.ActivityState &
  typeof ActivitiesStore.actionCreators &
  RouteComponentProps<IActivityDetail>;

export const ActivityForm: React.FC<ActivitiesProps> = (
  props: ActivitiesProps
) => {

  useEffect(() => {
    if (props.match.params.id) {
      props.loadingActivity(props.match.params.id);
      if(props.selectedActivity){
      setActivity(props.selectedActivity);
      }
    }
  }, [props.loadingActivity, props.selectedActivity]);

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: "",
  });

  const handleInputeChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if (activity.id.length > 0) {
      props.upateActivity(activity);
    } else {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      props.createActivity(newActivity);
    }
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputeChange}
          placeholder="Title"
          name="title"
          value={activity.title}
        />
        <Form.TextArea
          onChange={handleInputeChange}
          rows={2}
          placeholder="Description"
          name="description"
          value={activity.description}
        />
        <Form.Input
          onChange={handleInputeChange}
          placeholder="Category"
          name="category"
          value={activity.category}
        />
        <Form.Input
          onChange={handleInputeChange}
          type="date"
          placeholder="Date"
          name="date"
          value={activity.date}
        />
        <Form.Input
          onChange={handleInputeChange}
          placeholder="City"
          name="city"
          value={activity.city}
        />
        <Form.Input
          onChange={handleInputeChange}
          placeholder="Veune"
          name="venue"
          value={activity.venue}
        />
        <Button
          floated="right"
          positive
          type="Submit"
          content="Submit"
          loading={props.target === "" && props.submitting}
        />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          onClick={props.requestCancelEditActivity}
        />
      </Form>
    </Segment>
  );
};

export default connect(
  (state: ApplicationState) => state.activities,
  ActivitiesStore.actionCreators
)(ActivityForm as any);
