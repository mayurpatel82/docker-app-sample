import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { IActivity } from "../app/layout/model/activity";
import agent from "../api/agent";
import { SyntheticEvent } from "react";
import { isBuffer } from "util";

export interface ActivityState {
  activities: IActivity[];
  selectedActivity: IActivity | null;
  editMode: boolean;
  loading: boolean;
  submitting: boolean;
  target: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface IPostRequestActivitiesAction {
  type: "POST_REQUEST_ACTIVITIES";
}

export interface IRequestActivitiesAction {
  type: "REQUEST_ACTIVITIES";
  activities: IActivity[];
}

export interface ISelectedActivityAction {
  type: "SELECT_ACTIVITY";
  selectedActivityId: string;
}

export interface IRequestEditActivityDetailAction {
  type: "REQUEST_EDIT_ACTIVITY_DETAIL";
}

export interface ICancelEditActivityDetailAction {
  type: "CANCEL_EDIT_ACTIVITY_DETAIL";
}

export interface IRequestCancelEditActivityAction {
  type: "REQUEST_CANCEL_EDIT_ACTIVITY_FORM";
}

export interface IRequestCreateActivityAction {
  type: "REQUEST_CREATE_ACTIVITY";
}

export interface IUpdateActivityAction {
  type: "UPDATE_ACTIVITY";
  activity: IActivity;
}

export interface IPreUpdateActivityAction {
  type: "PRE_UPDATE_ACTIVITY";
}

export interface IPostUpdateActivityAction {
  type: "POST_UPDATE_ACTIVITY";
}

export interface ICreateActivityAction {
  type: "CREATE_ACTIVITY";
  activity: IActivity;
}

export interface IPreCreateActivityAction {
  type: "PRE_CREATE_ACTIVITY";
}

export interface IPostCreateActivityAction {
  type: "POST_CREATE_ACTIVITY";
}
export interface IDeleteActivityAction {
  type: "DELETE_ACTIVITY";
  id: string;
}
export interface IPreDeleteActivityAction {
  type: "PRE_DELETE_ACTIVITY";
  targetName: string;
}
export interface IPostDeleteActivityAction {
  type: "POST_DELETE_ACTIVITY";
}
export interface ILoadSelectedActivityAction {
  type: "LOAD_SELECTED_ACTIVITY";
  activity: IActivity;
}
export interface ILoadingActivitiesAction {
  type: "LOADING_ACTIVITIES";
  value: boolean;
}
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction =
  | IPostRequestActivitiesAction
  | IRequestActivitiesAction
  | ISelectedActivityAction
  | IRequestEditActivityDetailAction
  | IRequestCancelEditActivityAction
  | ICancelEditActivityDetailAction
  | IRequestCreateActivityAction
  | IUpdateActivityAction
  | IPreUpdateActivityAction
  | IPostUpdateActivityAction
  | ICreateActivityAction
  | IPostCreateActivityAction
  | IPreCreateActivityAction
  | IDeleteActivityAction
  | IPreDeleteActivityAction
  | IPostDeleteActivityAction
  | ILoadSelectedActivityAction
  | ILoadingActivitiesAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  requestActivities: (): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    agent.Activities.list()
      .then((response) => {
        let act: IActivity[] = [];
        response.forEach((activity) => {
          activity.date = activity.date.split("T")[0];
          act.push(activity);
        });
        dispatch({ type: "REQUEST_ACTIVITIES", activities: act });
      })
      .then(() => dispatch({ type: "POST_REQUEST_ACTIVITIES" }));
  },

  selectActivity: (id: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    dispatch({ type: "SELECT_ACTIVITY", selectedActivityId: id });
  },

  requestEditActivityDetail: (): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    dispatch({ type: "REQUEST_EDIT_ACTIVITY_DETAIL" });
  },
  cancelEditActivityDetail: (): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    dispatch({ type: "CANCEL_EDIT_ACTIVITY_DETAIL" });
  },

  requestCreateActivity: (): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    dispatch({ type: "REQUEST_CREATE_ACTIVITY" });
  },

  upateActivity: (activity: IActivity): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    dispatch({ type: "PRE_UPDATE_ACTIVITY" });

    agent.Activities.update(activity)
      .then(() => {
        dispatch({ type: "UPDATE_ACTIVITY", activity: activity });
      })
      .then(() => dispatch({ type: "POST_UPDATE_ACTIVITY" }));
  },

  createActivity: (activity: IActivity): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    dispatch({ type: "PRE_CREATE_ACTIVITY" });

    agent.Activities.create(activity)
      .then(() => {
        dispatch({ type: "CREATE_ACTIVITY", activity: activity });
      })
      .then(() => dispatch({ type: "POST_CREATE_ACTIVITY" }));
  },

  requestCancelEditActivity: (): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    dispatch({ type: "REQUEST_CANCEL_EDIT_ACTIVITY_FORM" });
  },

  deleteActivity: (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({
      type: "PRE_DELETE_ACTIVITY",
      targetName: event.currentTarget.name,
    });

    agent.Activities.delete(id)
      .then(() => {
        dispatch({ type: "DELETE_ACTIVITY", id: id });
      })
      .then(() => dispatch({ type: "POST_DELETE_ACTIVITY" }));
  },

  loadingActivity: (id: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    let state = getState().activities!.selectedActivity;
    if (state && state.id === id) {
      dispatch({ type: "SELECT_ACTIVITY", selectedActivityId: id });
    } else {
      dispatch({ type: "LOADING_ACTIVITIES", value: true });
      agent.Activities.details(id).then((response) => {
        dispatch({ type: "LOAD_SELECTED_ACTIVITY", activity: response });
      });
      dispatch({ type: "LOADING_ACTIVITIES", value: false });
    }
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
//const unloadedState: ActivityState = { activities: [] };

const unloadedState: ActivityState = {
  activities: [],
  selectedActivity: null,
  editMode: false,
  loading: true,
  submitting: false,
  target: "",
};

export const reducer: Reducer<ActivityState> = (
  state: ActivityState | undefined,
  incomingAction: Action
): ActivityState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "POST_REQUEST_ACTIVITIES":
      return {
        ...state,
        loading: false,
      };
    case "REQUEST_ACTIVITIES":
      return {
        ...state,
        activities: action.activities,
      };
    case "SELECT_ACTIVITY":
      return {
        ...state,
        selectedActivity: state.activities.filter((a) => a.id === action.selectedActivityId)[0],
        editMode: false,
      };
    case "LOAD_SELECTED_ACTIVITY":
      return {
        ...state,
        selectedActivity: action.activity,
        editMode: false,
      };
    case "LOADING_ACTIVITIES":
      return {
        ...state,
        loading: action.value,
      };
    case "REQUEST_EDIT_ACTIVITY_DETAIL":
      return {
        ...state,
        editMode: true,
      };
    case "CANCEL_EDIT_ACTIVITY_DETAIL":
      return {
        ...state,
        selectedActivity: null,
        editMode: false,
      };
    case "PRE_UPDATE_ACTIVITY":
      return {
        ...state,
        submitting: true,
      };
    case "POST_UPDATE_ACTIVITY":
      return {
        ...state,
        submitting: false,
      };
    case "REQUEST_CREATE_ACTIVITY":
      return {
        ...state,
        selectedActivity: null,
        editMode: true,
      };
    case "UPDATE_ACTIVITY":
      const activities = [
        ...state.activities.filter((a) => a.id !== action.activity.id),
        action.activity,
      ];
      return {
        ...state,
        selectedActivity: action.activity,
        editMode: false,
        activities: activities,
        submitting: false,
      };
    case "CREATE_ACTIVITY":
      const newObj = [...state.activities, action.activity];
      return {
        ...state,
        selectedActivity: action.activity,
        editMode: false,
        activities: newObj,
      };
    case "PRE_CREATE_ACTIVITY":
      return {
        ...state,
        submitting: true,
        target: "",
      };
    case "POST_CREATE_ACTIVITY":
      return {
        ...state,
        submitting: false,
      };

    case "REQUEST_CANCEL_EDIT_ACTIVITY_FORM":
      return {
        ...state,
        editMode: false,
      };
    case "DELETE_ACTIVITY":
      return {
        ...state,
        activities: state.activities.filter((a) => a.id !== action.id),
      };
    case "PRE_DELETE_ACTIVITY":
      return {
        ...state,
        submitting: true,
        target: action.targetName,
      };
    case "POST_DELETE_ACTIVITY":
      return {
        ...state,
        submitting: false,
      };

    default:
      return state;
  }
};
