import { actionTypes } from "./actions";

export const initialState = { dialog: null };

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.user };

    case actionTypes.SET_DIALOG:
      return { ...state, dialog: action.dialog };

    default:
      return state;
  }
};
