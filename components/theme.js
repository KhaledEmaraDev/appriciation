import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
  direction: 'rtl',
  typography: {
    fontFamily: ['Tajawal', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(
        ', '
    ),
  },
});

export default theme;
