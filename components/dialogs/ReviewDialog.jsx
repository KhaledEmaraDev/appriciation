import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import Rating from "@material-ui/lab/Rating";
import SearchBar from "../SearchBar";
import Skeleton from "@material-ui/lab/Skeleton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";

import { useStateValue } from "../../store";
import { fillForm, setDialog, showSnackbar } from "../../actions";

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
  title: {
    width: "100%",
    display: "inline-block",
    fontSize: 14,
    fontWeight: 500
  },
  submit: {
    margin: theme.spacing(2, 0)
  },
  brandContainer: {
    marginTop: theme.spacing(2)
  },
  center: {
    textAlign: "center"
  }
}));

export default function ReviewDialog(props) {
  const classes = useStyles();
  const { brand, product } = props;

  const [loading, setLoading] = useState(false);
  const [
    {
      user,
      forms: { review }
    },
    dispatch
  ] = useStateValue();

  useEffect(() => {
    if (!product) return;
    dispatch(fillForm("review", "brand", brand));
    dispatch(fillForm("review", "product", product));
  }, [brand, product]);

  useEffect(() => {
    if (!review.product || review.ratings_buckets) return;
    setLoading(true);
    fetch(
      `http://localhost:3000/api/pages/dialogs/review?brand=${review.brand}&product=${review.product}`
    )
      .then(res => res.json())
      .then(json => {
        dispatch(
          fillForm(
            "review",
            "min_date",
            json.specs ? json.specs.publish_date : null
          )
        );
        dispatch(fillForm("review", "ratings_buckets", json.ratings_buckets));
        setLoading(false);
      });
  }, [review.brand, review.product]);

  function handleProductSelected(suggestion) {
    dispatch(fillForm("review", "brand", suggestion.brand));
    dispatch(fillForm("review", "product", suggestion.product));
  }

  function handleDateBuyChanged(date) {
    dispatch(fillForm("review", "date_buy", date));
  }

  function handleTextChage(name) {
    return function(event) {
      dispatch(fillForm("review", name, event.target.value));
    };
  }

  function handleRatingChanged(bucket) {
    return function(event, newValue) {
      dispatch(
        fillForm("review", "ratings", { ...review.ratings, [bucket]: newValue })
      );
    };
  }

  function handleBrandRatingChanged(event, newValue) {
    dispatch(fillForm("review", "brand_rating", newValue));
  }

  function invalidateForm() {
    dispatch(fillForm("review", "dirty", true));
  }

  function handleSubmit() {
    const {
      brand,
      product,
      date_buy,
      pros,
      cons,
      ratings,
      brand_rating,
      brand_pros,
      brand_cons,
      ratings_buckets,
      min_date
    } = review;

    if (!product)
      return dispatch(showSnackbar("warning", "عليك باختيار المنتج"));

    if (date_buy <= (min_date ? min_date : new Date("2008-01"))) {
      invalidateForm();
      return dispatch(
        showSnackbar("warning", "عليك باختيار تاريخ شراء الهاتف")
      );
    }

    if (!pros || !cons || !brand_pros || !brand_cons) {
      invalidateForm();
      return dispatch(showSnackbar("warning", "عليك بملئ الخانات الاَتية"));
    }

    if (
      !brand_rating ||
      Object.keys(ratings).length != ratings_buckets.length
    ) {
      return dispatch(showSnackbar("warning", "عليك بتقيم المنتج"));
    }

    if (!user) return dispatch(setDialog("sign-up-prompt"));

    fetch("/api/review", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({
        brand,
        product,
        date_buy,
        pros,
        cons,
        ratings,
        brand_rating,
        brand_pros,
        brand_cons
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("حدث خطأ في الاتصال");
        return res.json();
      })
      .then(json => {
        dispatch(setDialog(null));
        json && dispatch(showSnackbar("success", json.message));
      })
      .catch(err => {
        dispatch(setDialog(null));
        dispatch(showSnackbar("error", err.message));
      });
  }

  const dateError = review.dirty && review.date_buy <= new Date("2008-01");
  const prosError = review.dirty && !review.pros;
  const consError = review.dirty && !review.cons;
  const brand_prosError = review.dirty && !review.brand_pros;
  const brand_consError = review.dirty && !review.brand_cons;

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RateReviewOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          راجع الاَن
        </Typography>
        <Grid className={classes.form} container spacing={2}>
          <Grid item xs={12}>
            {review.product ? (
              <Typography
                className={classes.title}
                variant="overline"
                align="center"
              >{`${review.brand} ${review.product}`}</Typography>
            ) : (
              <SearchBar
                id="review-product-search"
                placeholder="ابحث عن منتج"
                handleSuggestionSelected={handleProductSelected}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              id="review-date-picker"
              fullWidth
              views={["year", "month"]}
              label="منذ متى و أنت تملك الهاتف؟"
              okLabel="موافق"
              cancelLabel="الغاء"
              error={dateError}
              minDate={review.min_date ? review.min_date : new Date("2008-01")}
              minDateMessage="برجاء اختر تاريخ شراء الهاتف"
              disableFuture
              value={review.date_buy}
              onChange={handleDateBuyChanged}
              allowKeyboardControl={false}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              multiline
              error={prosError}
              label="ماذا يعجبك بشأن الهاتف؟"
              value={review.pros}
              onChange={handleTextChage("pros")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              multiline
              error={consError}
              label="ما الذي تكرهه بشأن هذا الهاتف؟"
              value={review.cons}
              onChange={handleTextChage("cons")}
            />
          </Grid>
          {loading &&
            [0, 1, 2, 3, 4, 5].map(value => (
              <React.Fragment key={value}>
                <Grid item xs={6}>
                  <Skeleton height={12} />
                </Grid>
                <Grid item xs={6}>
                  <Skeleton height={12} />
                </Grid>
              </React.Fragment>
            ))}
          {review.ratings_buckets &&
            review.ratings_buckets.map(bucket => (
              <React.Fragment key={bucket}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" align="center">
                    {bucket}:
                  </Typography>
                </Grid>
                <Grid className={classes.center} item xs={6}>
                  <Rating
                    value={review.ratings[bucket]}
                    name={`rating${bucket}`}
                    onChange={handleRatingChanged(bucket)}
                  />
                </Grid>
              </React.Fragment>
            ))}
          {review.brand && (
            <React.Fragment>
              <Grid className={classes.brandContainer} item xs={12}>
                <Typography
                  variant="subtitle2"
                  align="center"
                >{`كيف تقيم ${review.brand}؟`}</Typography>
              </Grid>
              <Grid className={classes.center} item xs={12}>
                <Rating
                  value={review.brand_rating}
                  name="brand_rating"
                  onChange={handleBrandRatingChanged}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  error={brand_prosError}
                  label={`ماذا يعجبك بشأن ${review.brand}؟`}
                  value={review.brand_pros}
                  onChange={handleTextChage("brand_pros")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  error={brand_consError}
                  label={`ما الذي تكرهه بشأن ${review.brand}؟`}
                  value={review.brand_cons}
                  onChange={handleTextChage("brand_cons")}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          انشر الاَن
        </Button>
      </div>
    </Container>
  );
}

ReviewDialog.propTypes = {
  brand: PropTypes.string,
  product: PropTypes.string
};
