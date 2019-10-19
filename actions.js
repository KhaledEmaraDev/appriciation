export const actionTypes = {
  SET_USER: "SET_USER",
  SET_DIALOG: "SET_DIALOG",
  SHOW_SNACKBAR: "SHOW_SNACKBAR",
  SET_SNACKBAR: "SET_SNACKBAR",
  FILL_FORM: "FILL_FORM"
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

export function showSnackbar(variant, message) {
  return {
    type: actionTypes.SHOW_SNACKBAR,
    variant,
    message
  };
}

export function setSnackbar(open, messageInfo) {
  return {
    type: actionTypes.SET_SNACKBAR,
    open,
    messageInfo
  };
}

export function fillForm(form, field, value) {
  return {
    type: actionTypes.FILL_FORM,
    form,
    field,
    value
  };
}
