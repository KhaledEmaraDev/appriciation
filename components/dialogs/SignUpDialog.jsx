import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import FacebookBoxIcon from "mdi-material-ui/FacebookBox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import GoogleIcon from "mdi-material-ui/Google";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import MuiLink from "@material-ui/core/Link";
import Switch from "@material-ui/core/Switch";
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
  reviewerContainer: {
    width: "auto",
    margin: 0
  },
  submit: {
    margin: theme.spacing(2, 0)
  }
}));

export default function SignUpDialog() {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reviewer, setReviewer] = useState(false);
  const [youtubeURL, setYouTubeURL] = useState(false);
  const [twitterURL, setTwitterURL] = useState(false);
  const [facebookURL, setFacebookURL] = useState(false);

  // eslint-disable-next-line no-empty-pattern
  const [{}, dispatch] = useStateValue();

  function handleEmailSignUp() {
    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        if (result.additionalUserInfo.isNewUser) {
          const user = result.user;

          const updatePromise = user.updateProfile({
            displayName: `${firstName} ${lastName}`
          });

          const signupPromise = fetch("/api/account/signup", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            credentials: "same-origin",
            body: JSON.stringify({
              user: {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                avatar: user.photoURL,
                youtube: youtubeURL,
                twitter: twitterURL,
                facebook: facebookURL
              }
            })
          });

          return Promise.all([signupPromise, updatePromise]);
        }
      })
      .then(() => dispatch(showSnackbar("success", "تم التسجيل بنجاح")))
      .catch(error => {
        dispatch(showSnackbar("error", error.message));
      });
  }

  function handleGoogleSignUp() {
    firebaseAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(result => {
        if (result.additionalUserInfo.isNewUser) {
          const user = result.user;
          return fetch("/api/account/signup", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            credentials: "same-origin",
            body: JSON.stringify({
              user: {
                uid: user.uid,
                email: user.email
                  ? user.email
                  : user.providerData.length > 0 && user.providerData[0].email
                  ? user.providerData[0].email
                  : null,
                name: user.displayName,
                avatar: user.photoURL,
                youtube: youtubeURL,
                twitter: twitterURL,
                facebook: facebookURL
              }
            })
          });
        }
      })
      .then(() => dispatch(showSnackbar("success", "تم التسجيل بنجاح")))
      .catch(error => {
        dispatch(showSnackbar("error", error.message));
      });
  }

  function handleFacebookSignUp() {
    firebaseAuth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(result => {
        if (result.additionalUserInfo.isNewUser) {
          const user = result.user;
          return fetch("/api/account/signup", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            credentials: "same-origin",
            body: JSON.stringify({
              user: {
                uid: user.uid,
                email: user.email
                  ? user.email
                  : user.providerData.length > 0 && user.providerData[0].email
                  ? user.providerData[0].email
                  : null,
                name: user.displayName,
                avatar: user.photoURL,
                youtube: youtubeURL,
                twitter: twitterURL,
                facebook: facebookURL
              }
            })
          });
        }
      })
      .then(() => dispatch(showSnackbar("success", "تم التسجيل بنجاح")))
      .catch(error => {
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
          سجل حساب
        </Typography>
        <Grid className={classes.form} container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              endIcon={<GoogleIcon />}
              variant="contained"
              className={classes.google}
              onClick={handleGoogleSignUp}
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
              onClick={handleFacebookSignUp}
            >
              Facebook
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label="الاسم الأول"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="الاسم الأخير"
              name="lastName"
              autoComplete="lname"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
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
              value={email}
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
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={reviewer}
                  onChange={event => setReviewer(event.target.checked)}
                  value="reviewer"
                  color="primary"
                />
              }
              label="أنا مراجع تقني"
            />
          </Grid>
        </Grid>
        <Collapse in={reviewer}>
          <Grid className={classes.reviewerContainer} container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">
                إذا كنت تقوم بعمل مراجعات على يوتيوب أو تدون على تويتر أو فيسبوك
                و تريد أن تصبح مراجع موثق في موقعنا، من فضلك اكمل البيانات
                الاُتية بشكل صحيح حتى يتم تقييم طلبك و الرد عليه في أسرع وقت.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="youtubeURL"
                label="قناة يوتيوب"
                id="youtubeURL"
                autoComplete="url"
                value={youtubeURL}
                onChange={e => setYouTubeURL(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="twitterURL"
                label="حساب تويتر"
                id="twitterURL"
                autoComplete="url"
                value={twitterURL}
                onChange={e => setTwitterURL(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="facebookURL"
                label="صفحة فيسبوك"
                id="facebookURL"
                autoComplete="url"
                value={facebookURL}
                onChange={e => setFacebookURL(e.target.value)}
              />
            </Grid>
          </Grid>
        </Collapse>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.submit}
          onClick={handleEmailSignUp}
        >
          سجل الاَن
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <MuiLink
              component="button"
              variant="body2"
              onClick={() => {
                dispatch(setDialog("sign-in"));
              }}
            >
              عندك حساب بالفعل؟ سجل دخولك
            </MuiLink>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
