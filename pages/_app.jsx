import React from "react";
import App from "next/app";
import Head from "next/head";
import { ThemeProvider, StylesProvider, jssPreset } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { create } from "jss";
import rtl from "jss-rtl";
import theme from "../components/theme";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export default class MyApp extends App {
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
        <ThemeProvider theme={theme}>
          <StylesProvider jss={jss}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </StylesProvider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
