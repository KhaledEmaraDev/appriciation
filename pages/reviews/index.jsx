import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import ProductOverview from "../../components/ProductOverview";
import ProductRating from "../../components/ProductRating";
import ProductReviews from "../../components/ProductReviews";
import ProductSpecs from "../../components/ProductSpecs";

import cachedFetch, { overrideCache } from "../../lib/cached-json-fetch";
const getDataURL = (brand, product) =>
  `http://localhost:3000/api/pages/reviews?brand=${encodeURIComponent(
    brand
  )}&product=${encodeURIComponent(product)}`;

export default function Reviews(props) {
  const { isServerRendered, brand, product, specs, ratings, reviews } = props;

  useEffect(() => {
    if (isServerRendered) {
      overrideCache(getDataURL(brand, product), {
        specs,
        ratings,
        reviews
      });
    }
  }, [isServerRendered, brand, product, specs, ratings, reviews]);

  const rating =
    ratings.reduce((value, object) => value + object.avg_rating, 0) /
    ratings.length;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProductOverview
          brand={brand}
          product={product}
          rating={rating}
          imageExists={specs != undefined}
        />
      </Grid>
      <Grid item xs={12}>
        <ProductRating brand={brand} product={product} ratings={ratings} />
      </Grid>
      <Grid item xs={12}>
        <ProductSpecs brand={brand} product={product} specs={specs} />
      </Grid>
      <Grid item xs={12}>
        <ProductReviews brand={brand} product={product} reviews={reviews} />
      </Grid>
    </Grid>
  );
}

Reviews.getInitialProps = async ({ req, query }) => {
  const { brand, product } = query;
  const result = await cachedFetch(getDataURL(brand, product));
  return {
    isServerRendered: !!req,
    brand,
    product,
    specs: result.specs,
    ratings: result.ratings,
    reviews: result.reviews
  };
};

Reviews.propTypes = {
  isServerRendered: PropTypes.bool,
  brand: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  ratings: PropTypes.array,
  specs: PropTypes.object,
  reviews: PropTypes.array
};
