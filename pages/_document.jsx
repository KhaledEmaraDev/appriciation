import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/styles";
import theme from "../components/theme";

class MyDocument extends Document {
  render() {
    return (
      <html lang="ar">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <style global jsx>
            {`
              /* arabic */
              @font-face {
                font-family: "Tajawal";
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: local("Tajawal Light"), local("Tajawal-Light"),
                  url(/static/fonts/tajawal-arabic-300.woff2) format("woff2");
                unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F,
                  U+2E41, U+FB50-FDFF, U+FE80-FEFC;
              }
              /* latin */
              @font-face {
                font-family: "Tajawal";
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: local("Tajawal Light"), local("Tajawal-Light"),
                  url(/static/fonts/tajawal-latin-300.woff2) format("woff2");
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC,
                  U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                  U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
              /* arabic */
              @font-face {
                font-family: "Tajawal";
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: local("Tajawal"), local("Tajawal-Regular"),
                  url(/static/fonts/tajawal-arabic-400.woff2) format("woff2");
                unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F,
                  U+2E41, U+FB50-FDFF, U+FE80-FEFC;
              }
              /* latin */
              @font-face {
                font-family: "Tajawal";
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: local("Tajawal"), local("Tajawal-Regular"),
                  url(/static/fonts/tajawal-latin-400.woff2) format("woff2");
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC,
                  U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                  U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
              /* arabic */
              @font-face {
                font-family: "Tajawal";
                font-style: normal;
                font-weight: 500;
                font-display: swap;
                src: local("Tajawal Medium"), local("Tajawal-Medium"),
                  url(/static/fonts/tajawal-arabic-500.woff2) format("woff2");
                unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F,
                  U+2E41, U+FB50-FDFF, U+FE80-FEFC;
              }
              /* latin */
              @font-face {
                font-family: "Tajawal";
                font-style: normal;
                font-weight: 500;
                font-display: swap;
                src: local("Tajawal Medium"), local("Tajawal-Medium"),
                  url(/static/fonts/tajawal-latin-500.woff2) format("woff2");
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC,
                  U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                  U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
              /* arabic */
              @font-face {
                font-family: "Tajawal";
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: local("Tajawal Bold"), local("Tajawal-Bold"),
                  url(/static/fonts/tajawal-arabic-700.woff2) format("woff2");
                unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F,
                  U+2E41, U+FB50-FDFF, U+FE80-FEFC;
              }
              /* latin */
              @font-face {
                font-family: "Tajawal";
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: local("Tajawal Bold"), local("Tajawal-Bold"),
                  url(/static/fonts/tajawal-latin-700.woff2) format("woff2");
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC,
                  U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                  U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
            `}
          </style>
        </Head>
        <body dir="rtl">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />)
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      <React.Fragment key="styles">
        {initialProps.styles}
        {sheets.getStyleElement()}
      </React.Fragment>
    ]
  };
};

export default MyDocument;
