import React from "react";
import Button from "../components/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => {
  const cardShadow = "0px 14px 80px rgba(34, 35, 58, 0.2)";
  const headerShadow = "4px 4px 20px 1px rgba(33, 203, 243, .3)";
  return {
    card: {
      borderRadius: theme.spacing(0.5),
      transition: "0.3s",
      boxShadow: cardShadow,
      position: "relative",
      overflow: "initial",
      background: "#ffffff",
      marginTop: theme.spacing(4),
      padding: theme.spacing(2, 0, 0, 0),
      [theme.breakpoints.only("xs")]: {
        marginTop: theme.spacing(6)
      }
    },
    header: {
      flexShrink: 0,
      position: "absolute",
      right: 20,
      left: 20,
      borderRadius: theme.spacing(2),
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.light} 90%)`,
      overflow: "hidden",
      boxShadow: headerShadow,
      textAlign: "center",
      top: theme.spacing(-4),
      [theme.breakpoints.only("xs")]: {
        top: theme.spacing(-6)
      }
    },
    title: {
      color: theme.palette.getContrastText(theme.palette.primary.main),
      fontWeight: 700,
      letterSpacing: 1
    },
    subheader: {
      color: theme.palette.getContrastText(theme.palette.primary.main),
      opacity: 0.87,
      fontWeight: 400,
      letterSpacing: 0.4
    },
    contentContainer: {
      textAlign: "center"
    },
    content: {
      paddingTop: "38px",
      overflowX: "auto"
    }
  };
});

export default function Index() {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title={
          <Typography variant="subtitle1" component="h1" className={classes.title}>
            أول منصة لمراجعات المستخدمين بالشرق الأوسط
          </Typography>
        }
        subheader={
          <Typography
            variant="subtitle2"
            component="h1"
            className={classes.subheader}
          >
            اَراء مستخدمي الهواتف في مكان واحد
          </Typography>
        }
      />
      <CardContent className={classes.contentContainer}>
        <div className={classes.content}>
          <Typography variant="subtitle1" component="h3">
            هدفنا مساعدتك تختار
          </Typography>
          <Button color="red">راجع الاَن</Button>
          <Button color="red">سجل الاَن</Button>
        </div>
      </CardContent>
    </Card>
  );
}
