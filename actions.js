export const actionTypes = {
  SET_USER: "SET_USER",
  SET_DIALOG: "SET_DIALOG"
};

export function setUser(user) {
  return {
    type: actionTypes.SET_USER,
    user
  };
}

export function setDialog(dialog) {
  return {
    type: actionTypes.SET_DIALOG,
    dialog
  };
}
