import React from "react";
import PropTypes from "prop-types";
import App from "next/app";
import Head from "next/head";
import { create } from "jss";
import rtl from "jss-rtl";
import theme from "../theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainNav from "../components/MainNav";
import {
  ThemeProvider,
  StylesProvider,
  jssPreset,
  withStyles
} from "@material-ui/styles";

import { StateProvider } from "../store";
import { reducer, initialState } from "../reducer";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

/* eslint-disable no-dupe-keys */

const styles = {
  "@font-face": [
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 300,
      fontDisplay: "swap",
      src:
        'local("Tajawal Light"), local("Tajawal-Light"), url(/static/fonts/tajawal-arabic-300.woff2) format("woff2"); unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 300,
      fontDisplay: "swap",
      src:
        'local("Tajawal Light"), local("Tajawal-Light"), url(/static/fonts/tajawal-latin-300.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 400,
      fontDisplay: "swap",
      src:
        'local("Tajawal"), local("Tajawal-Regular"), url(/static/fonts/tajawal-arabic-400.woff2) format("woff2"); unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 400,
      fontDisplay: "swap",
      src:
        'local("Tajawal"), local("Tajawal-Regular"), url(/static/fonts/tajawal-latin-400.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 500,
      fontDisplay: "swap",
      src:
        'local("Tajawal Medium"), local("Tajawal-Medium"), url(/static/fonts/tajawal-arabic-500.woff2) format("woff2"); unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 500,
      fontDisplay: "swap",
      src:
        'local("Tajawal Medium"), local("Tajawal-Medium"), url(/static/fonts/tajawal-latin-500.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 700,
      fontDisplay: "swap",
      src:
        'local("Tajawal Bold"), local("Tajawal-Bold"), url(/static/fonts/tajawal-arabic-700.woff2) format("woff2"); unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC'
    },
    {
      fontFamily: '"Tajawal"',
      fontStyle: "normal",
      fontWeight: 700,
      fontDisplay: "swap",
      src:
        'local("Tajawal Bold"), local("Tajawal-Bold"), url(/static/fonts/tajawal-latin-700.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
    }
  ]
};

/* eslint-disable no-dupe-keys */

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>URrevs</title>
        </Head>
        <StateProvider initialState={initialState} reducer={reducer}>
          <ThemeProvider theme={theme}>
            <StylesProvider jss={jss}>
              <CssBaseline />
              <MainNav>
                <Component {...pageProps} />
              </MainNav>
            </StylesProvider>
          </ThemeProvider>
        </StateProvider>
      </React.Fragment>
    );
  }
}

MyApp.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MyApp);
