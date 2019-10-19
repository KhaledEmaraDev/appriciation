import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FacebookBoxIcon from "mdi-material-ui/FacebookBox";
import GoogleIcon from "mdi-material-ui/Google";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import MuiLink from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

import * as firebase from "firebase/app";
import firebaseAuth from "../../firebase";
import "firebase/auth";

import { useStateValue } from "../../store";
import { setDialog, showSnackbar } from "../../actions";

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(2, 0, 2, 0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(4)
  },
  facebook: {
    backgroundColor: "#3c5a99",
    color: theme.palette.getContrastText("#3c5a99"),
    marginBottom: theme.spacing(2)
  },
  google: {
    backgroundColor: "#4285f4",
    color: theme.palette.getContrastText("#4285f4"),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginBottom: 0
    }
  },
  submit: {
    margin: theme.spacing(2, 0)
  }
}));

export default function SignInDialog() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // eslint-disable-next-line no-empty-pattern
  const [{}, dispatch] = useStateValue();

  function handleEmailSignIn() {
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(function() {
        dispatch(showSnackbar("success", "تم تسجيل الدخول بنجاح"));
      })
      .catch(function(error) {
        dispatch(showSnackbar("error", error.message));
      });
  }

  function handleGoogleSignIn() {
    firebaseAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(function() {
        dispatch(showSnackbar("success", "تم تسجيل الدخول بنجاح"));
      })
      .catch(function(error) {
        dispatch(showSnackbar("error", error.message));
      });
  }

  function handleFacebookSignIn() {
    firebaseAuth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(function() {
        dispatch(showSnackbar("success", "تم تسجيل الدخول بنجاح"));
      })
      .catch(function(error) {
        dispatch(showSnackbar("error", error.message));
      });
  }

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          سجل دخولك
        </Typography>
        <Grid className={classes.form} container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              endIcon={<GoogleIcon />}
              variant="contained"
              className={classes.google}
              onClick={handleGoogleSignIn}
            >
              Google
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              endIcon={<FacebookBoxIcon />}
              variant="contained"
              className={classes.facebook}
              onClick={handleFacebookSignIn}
            >
              Facebook
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="البريد الألكتروني"
              name="email"
              autoComplete="email"
              onChange={e => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.submit}
          onClick={handleEmailSignIn}
        >
          سجل الدخول
        </Button>
        <Grid container>
          <Grid item xs>
            <MuiLink component="button" variant="body2">
              نسيت كلمة المرور؟
            </MuiLink>
          </Grid>
          <Grid item>
            <MuiLink
              component="button"
              variant="body2"
              onClick={() => {
                dispatch(setDialog("sign-up"));
              }}
            >
              لا تملك حساباً؟ سجل الاَن
            </MuiLink>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
