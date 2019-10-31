import { actionTypes } from "./actions";

export const initialState = {
  user: null,
  dialog: null,
  snackbar: { queue: [], open: false, messageInfo: undefined },
  menus: { account: null },
  forms: {
    review: {
      brand: null,
      product: null,
      date_buy: new Date("2007-01"),
      pros: "",
      cons: "",
      ratings: {},
      brand_rating: 0,
      brand_pros: "",
      brand_cons: ""
    }
  }
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.user };

    case actionTypes.SET_DIALOG:
      return { ...state, dialog: action.dialog };

    case actionTypes.SHOW_SNACKBAR: {
      const newQueue = [
        ...state.snackbar.queue,
        {
          key: new Date().getTime(),
          variant: action.variant,
          message: action.message,
          actionLabel: action.actionLabel,
          action: action.action
        }
      ];
      let open = undefined,
        messageInfo = undefined;
      if (!state.open) {
        if (newQueue.length > 0) {
          open = true;
          messageInfo = newQueue.shift();
        }
      }
      return {
        ...state,
        snackbar: {
          open: open ? open : state.open,
          messageInfo: messageInfo ? messageInfo : state.open,
          queue: newQueue
        }
      };
    }

    case actionTypes.SET_SNACKBAR:
      return {
        ...state,
        snackbar: {
          ...state.snackbar,
          open: action.open,
          messageInfo: action.messageInfo
            ? action.messageInfo
            : state.snackbar.messageInfo
        }
      };

    case actionTypes.FILL_FORM:
      return {
        ...state,
        forms: {
          ...state.forms,
          [action.form]: {
            ...state.forms[action.form],
            [action.field]: action.value
          }
        }
      };

    case actionTypes.SET_MENU_ANCHOR:
      return {
        ...state,
        menus: {
          ...state.menus,
          [action.menu]: action.anchor
        }
      };

    default:
      return state;
  }
};
