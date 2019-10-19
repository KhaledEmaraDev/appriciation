import React, { useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import AccountCircleTwoTone from "@material-ui/icons/AccountCircleTwoTone";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import CreateIcon from "@material-ui/icons/Create";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import FacebookBox from "mdi-material-ui/FacebookBox";
import ForumIcon from "@material-ui/icons/Forum";
import Hidden from "@material-ui/core/Hidden";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import KeyboardArrowLeftRoundedIcon from "@material-ui/icons/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@material-ui/icons/KeyboardArrowRightRounded";
import Link from "./Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MuiLink from "@material-ui/core/Link";
import RateReviewIcon from "@material-ui/icons/RateReview";
import ReviewDialog from "../components/dialogs/ReviewDialog";
import SearchBar from "./SearchBar";
import SignInDialog from "../components/dialogs/SignInDialog";
import SignUpDialog from "../components/dialogs/SignUpDialog";
import SignUpPromptDialog from "../components/dialogs/SignUpPromptDialog";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContentWrapper from "../components/SnackbarContentWrapper";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import firebaseAuth from "../firebase";

import { useStateValue } from "../store";
import { setUser, setDialog, setSnackbar } from "../actions";

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired
};

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  grow: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("sm")]: {
      // zIndex: theme.zIndex.drawer + 1,
      marginLeft: theme.spacing(9) + 1,
      width: `calc(100% - ${theme.spacing(9) + 1}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    }
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  hide: {
    display: "none"
  },
  logo: {
    width: theme.spacing(7),
    margin: theme.spacing(0, 2, 0, 0),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  logoHide: {
    width: 0,
    margin: 0,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  swipableDrawer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(9) + 1
  },
  toolbar: {
    padding: theme.spacing(0, 0, 0, 2),
    ...theme.mixins.toolbar
  },
  inline: {
    display: "inline"
  },
  listItem: {
    margin: theme.spacing(1),
    width: "auto",
    borderRadius: theme.spacing(1)
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  main: {
    padding: theme.spacing(2)
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: "auto",
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
  },
  facebookIcon: {
    verticalAlign: "middle",
    marginLeft: theme.spacing(1)
  },
  sponsorIcon: {
    verticalAlign: "middle",
    height: theme.spacing(6)
  }
}));

export default function MainNav(props) {
  const router = useRouter();
  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [searchFocus, setSearchFocus] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [{ user, dialog, snackbar }, dispatch] = useStateValue();

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user));
        dispatch(setDialog(null));
        return user.getIdToken().then(token => {
          // eslint-disable-next-line no-undef
          return fetch("/api/login", {
            method: "POST",
            // eslint-disable-next-line no-undef
            headers: new Headers({ "Content-Type": "application/json" }),
            credentials: "same-origin",
            body: JSON.stringify({ token })
          });
        });
      } else {
        dispatch(setUser(null));
        // eslint-disable-next-line no-undef
        fetch("/api/logout", {
          method: "POST",
          credentials: "same-origin"
        });
      }
    });
  }, [firebaseAuth]);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccountClick = () => {
    if (!user) dispatch(setDialog("sign-in"));
    else firebaseAuth.signOut();
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOn = () => {
    if (isDesktop) {
      handleDrawerOpen();
    } else {
      handleDrawerToggle();
    }
  };

  const handleDrawerOff = () => {
    if (isDesktop) {
      handleDrawerClose();
    } else {
      handleDrawerToggle();
    }
  };

  const handleSearchFocus = focused => () => {
    setSearchFocus(focused);
  };

  const handleDialogClose = () => {
    dispatch(setDialog(null));
  };

  const handleProductSelected = suggestion => {
    const { brand, product } = suggestion;
    router.push("/reviews/[brand]/[product]", `/reviews/${brand}/${product}`);
  };

  const processQueue = () => {
    if (snackbar.queue.length > 0) {
      dispatch(setSnackbar(true, snackbar.queue.shift()));
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setSnackbar(false));
  };

  const handleSnackbarExited = () => {
    processQueue();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleAccountClick}>
        {!user ? "تسجيل الدخول" : "تسجيل الخروج"}
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <React.Fragment>
      <List>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            {user && user.photoURL ? (
              <Avatar alt="user avatar" src={user.photoURL} />
            ) : (
              <AccountCircleTwoTone fontSize="large" />
            )}
          </ListItemAvatar>
          <ListItemText
            primary="مرحباً بك"
            secondary={user && user.displayName ? user.displayName : "مجهول"}
          />
          {(open || mobileOpen) && (
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="close drawer"
                onClick={handleDrawerOff}
              >
                {isDesktop ? (
                  theme.direction === "rtl" ? (
                    <KeyboardArrowRightRoundedIcon />
                  ) : (
                    <KeyboardArrowLeftRoundedIcon />
                  )
                ) : (
                  <KeyboardArrowDownRoundedIcon />
                )}
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </List>
      <Divider variant="middle" />
      <List>
        <ListItem className={classes.listItem} button selected>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="الصفحة الرئيسية" />
        </ListItem>
        <ListItem className={classes.listItem} button>
          <ListItemIcon>
            <RateReviewIcon />
          </ListItemIcon>
          <ListItemText primary="أخر المراجعات" />
        </ListItem>
        <ListItem className={classes.listItem} button>
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="المقالات" />
        </ListItem>
        <ListItem className={classes.listItem} button>
          <ListItemIcon>
            <ForumIcon />
          </ListItemIcon>
          <ListItemText primary="المنتديات" />
        </ListItem>
        <ListItem className={classes.listItem} button>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="نبذة عنا" />
        </ListItem>
      </List>
    </React.Fragment>
  );

  function Copyright() {
    return (
      <React.Fragment>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          gutterBottom
        >
          {"مدعوم من قبل "}
          <MuiLink color="inherit" href="http://ihub.asu.edu.eg/">
            <img
              className={classes.sponsorIcon}
              src="/static/images/iHub.png"
              alt="iHub logo"
            ></img>
          </MuiLink>
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          {"حقوق النشر محفوظة © "}
          <Link color="inherit" href="/">
            URrevs
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
          <MuiLink color="inherit" href="https://www.facebook.com/URrevs/">
            <FacebookBox className={classes.facebookIcon} />
          </MuiLink>
        </Typography>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className={clsx(classes.root, classes.grow)}>
        <ElevationScroll {...props}>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open
            })}
            color="inherit"
          >
            <Toolbar className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOn}
                edge="start"
                className={clsx({
                  [classes.hide]: open
                })}
              >
                <MenuIcon />
              </IconButton>
              <Link href="/">
                <img
                  className={clsx(classes.logo, {
                    [classes.logoHide]: searchFocus
                  })}
                  src="/static/images/logo.png"
                  alt="logo"
                />
              </Link>
              <SearchBar
                id="main-product-search"
                placeholder="ابحث عن منتج"
                onFocus={handleSearchFocus(true)}
                onBlur={handleSearchFocus(false)}
                handleSuggestionSelected={handleProductSelected}
              />
              <IconButton
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {user && user.photoURL ? (
                  <Avatar
                    className={classes.avatar}
                    alt="user avatar"
                    src={user.photoURL}
                  />
                ) : (
                  <AccountCircleTwoTone />
                )}
              </IconButton>
            </Toolbar>
          </AppBar>
        </ElevationScroll>
        {renderMenu}
        <nav aria-label="site pages">
          <Hidden smUp implementation="css">
            <SwipeableDrawer
              anchor="bottom"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
              PaperProps={{
                square: false
              }}
              classes={{
                paper: classes.swipableDrawer
              }}
              disableBackdropTransition={!iOS}
              disableSwipeToOpen={false}
              onOpen={handleDrawerToggle}
            >
              {drawer}
            </SwipeableDrawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              variant="permanent"
              className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open
              })}
              classes={{
                paper: clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open
                })
              }}
              open={open}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Container className={classes.main} component="main" maxWidth="md">
            {props.children}
          </Container>
          <footer className={classes.footer}>
            <Copyright />
          </footer>
        </div>
      </div>
      <Dialog
        open={dialog === "sign-in"}
        onClose={handleDialogClose}
        aria-labelledby="sign-in-dialog"
      >
        <SignInDialog />
      </Dialog>
      <Dialog
        open={dialog === "sign-up"}
        onClose={handleDialogClose}
        aria-labelledby="sign-up-dialog"
      >
        <SignUpDialog />
      </Dialog>
      <Dialog
        open={dialog === "sign-up-prompt"}
        onClose={handleDialogClose}
        aria-labelledby="sign-up-prompt-dialog"
      >
        <SignUpPromptDialog />
      </Dialog>
      <Dialog
        open={dialog === "review"}
        onClose={handleDialogClose}
        aria-labelledby="review-dialog"
      >
        <ReviewDialog />
      </Dialog>
      <Snackbar
        key={snackbar.messageInfo ? snackbar.messageInfo.key : undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        onExited={handleSnackbarExited}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
      >
        <SnackbarContentWrapper
          onClose={handleSnackbarClose}
          variant={
            snackbar.messageInfo ? snackbar.messageInfo.variant : undefined
          }
          message={
            snackbar.messageInfo ? snackbar.messageInfo.message : undefined
          }
        />
      </Snackbar>
    </React.Fragment>
  );
}

MainNav.propTypes = {
  children: PropTypes.object.isRequired
};
