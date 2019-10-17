import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import AccountCircleTwoTone from "@material-ui/icons/AccountCircleTwoTone";
import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "./Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Paper from "@material-ui/core/Paper";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

import { formatDistance, formatDistanceStrict } from "date-fns";
import arLocale from "date-fns/locale/ar-SA";

const categories = {
  phone: [
    "جودة التصنيع",
    "واجهة المستخدم",
    "القيمة للسعر",
    "الكاميرا",
    "جودة المكالمات",
    "البطارية"
  ]
};

const useStyles = makeStyles(theme => ({
  block: { display: "block" },
  iconAvatar: {
    fontSize: 48
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    fontWeight: 500
  },
  rating: { position: "relative", bottom: theme.spacing(1) },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  subtitle: {
    position: "relative",
    bottom: props => theme.spacing(props.review.ratings ? 1.75 : 0.75)
  },
  heading: {
    fontSize: theme.typography.pxToRem(theme.typography.fontSize * 1.125),
    fontWeight: 700
  },
  productLink: {
    textDecorationLine: "underline"
  }
}));

function Review(props) {
  const classes = useStyles(props);
  const [expanded, setExpanded] = React.useState(false);
  const { brand, product, review } = props;

  return (
    <ListItem
      alignItems="flex-start"
      button
      onClick={() => setExpanded(!expanded)}
    >
      <ListItemAvatar>
        {review.avatar ? (
          <Avatar alt={review.name} src={review.avatar} />
        ) : (
          <AccountCircleTwoTone className={classes.iconAvatar} />
        )}
      </ListItemAvatar>
      <ListItemText disableTypography>
        <React.Fragment>
          <div className={classes.headerContainer}>
            <div>
              <Typography
                className={clsx(classes.block, classes.title)}
                component="span"
                variant="subtitle1"
                color="textPrimary"
              >
                {review.name ? review.name : "مجهول"}
              </Typography>
              {review.ratings && (
                <Rating
                  className={classes.rating}
                  size="small"
                  value={Math.round(
                    review.ratings.reduce((a, b) => a + b) /
                      review.ratings.length
                  )}
                  readOnly
                />
              )}
            </div>
            {review.ratings && (
              <IconButton
                edge="end"
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded
                })}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            )}
          </div>
          {review.date_buy && (
            <Typography
              className={clsx(classes.block, classes.subtitle)}
              component="span"
              variant="body2"
              color="textSecondary"
            >
              امتلك لفترة{" "}
              {formatDistance(new Date(), new Date(review.date_buy), {
                locale: arLocale
              })}
            </Typography>
          )}
          <Typography
            className={clsx(classes.block, classes.subtitle)}
            component="span"
            variant="body2"
            color="textSecondary"
          >
            راجع منذ{" "}
            {formatDistanceStrict(new Date(), new Date(review.date_rev), {
              locale: arLocale
            })}
          </Typography>
          {review.ratings && (
            <Collapse in={expanded}>
              <Grid container>
                {review.ratings.map((rating, index) => (
                  <React.Fragment key={categories.phone[index]}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2">
                        {categories.phone[index]}:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Rating value={rating} readOnly />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
              <br />
            </Collapse>
          )}
          <Typography
            className={classes.heading}
            component="h1"
            variant="h6"
            color="textPrimary"
          >
            مميزات هاتف{" "}
            {brand ? (
              `${brand} ${product}`
            ) : (
              <Link
                className={classes.productLink}
                color="inherit"
                href="/reviews/[brand]/[product]"
                as={`/reviews/${review.brand}/${review.product}`}
              >
                {`${review.brand} ${review.product}`}
              </Link>
            )}
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {review.pros}
          </Typography>
          <br />
          <Typography
            className={classes.heading}
            component="h1"
            variant="h6"
            color="textPrimary"
          >
            عيوب هاتف{" "}
            {brand ? (
              `${brand} ${product}`
            ) : (
              <Link
                className={classes.productLink}
                color="inherit"
                href="/reviews/[brand]/[product]"
                as={`/reviews/${review.brand}/${review.product}`}
              >
                {`${review.brand} ${review.product}`}
              </Link>
            )}
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {review.cons}
          </Typography>
        </React.Fragment>
      </ListItemText>
    </ListItem>
  );
}

Review.propTypes = {
  brand: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  review: PropTypes.object.isRequired
};

export default function ProductReviews(props) {
  const { title, brand, product, reviews } = props;

  return (
    <Paper elevation={24}>
      <List
        subheader={
          <ListSubheader>
            {title ? title : `مراجعات هاتف ${brand} ${product}`}
          </ListSubheader>
        }
      >
        {reviews.map(review => (
          <React.Fragment key={review._id}>
            <Review brand={brand} product={product} review={review} />
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

ProductReviews.propTypes = {
  title: PropTypes.string,
  brand: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  reviews: PropTypes.array
};
