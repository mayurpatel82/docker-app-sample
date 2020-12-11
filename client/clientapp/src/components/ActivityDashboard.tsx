import React, { SyntheticEvent } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityDetails from "./ActivityDetail";
import ActivityList from "./ActivityList";
import * as ActivitiesStore from "../store/Activities";
import "./style.css"
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import ActivityForm from "./ActivityForm";

// At runtime, Redux will merge together...
type ActivitiesProps = ActivitiesStore.ActivityState &
  typeof ActivitiesStore.actionCreators;

const ActivityDashboard : React.FC<ActivitiesProps> = (props: ActivitiesProps) => {
    return (
        <Grid>
          <GridColumn width={10}>
            <ActivityList />
          </GridColumn> 
          <GridColumn width={6}>
            <h2>Activity filters</h2>
          </GridColumn>  
        </Grid>
      );
    }

    export default connect(
      (state: ApplicationState) => state.activities,
      ActivitiesStore.actionCreators)
      (ActivityDashboard as any);

/*
export default class ActivityDashboard extends React.PureComponent {
  render(){
    return (
        <Grid>
          <GridColumn width={10}>
            <ActivityList />
          </GridColumn>       
        </Grid>
      );
  }   
};
*/