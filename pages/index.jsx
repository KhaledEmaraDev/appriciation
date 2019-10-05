import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "../components/Link";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"حقوق النشر محفوظة © "}
      <Link color="inherit" href="/">
        URrevs
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          الصفحة الرئيسية
        </Typography>
        <Copyright />
      </Box>
    </Container>
  );
}
