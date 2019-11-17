import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import ProductOverview from "../../components/ProductOverview";
import ProductRating from "../../components/ProductRating";
import ProductReviews from "../../components/ProductReviews";
import ProductSpecs from "../../components/ProductSpecs";

import cachedFetch, { overrideCache } from "../../lib/cached-json-fetch";

const getDataURL = (brand, product, isClient) =>
  `${
    isClient ? process.env.HOST_CLIENT : process.env.HOST_SERVER
  }/api/pages/reviews?brand=${encodeURIComponent(
    brand
  )}&product=${encodeURIComponent(product)}`;

export default function Reviews(props) {
  const { brand, product, specs, rating, ratings, reviews } = props;

  useEffect(() => {
    if (props.isServerRendered)
      overrideCache(getDataURL(true), { specs, rating, ratings, reviews });
  }, [props.isServerRendered, specs, rating, ratings, reviews]);

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
  const result = await cachedFetch(getDataURL(brand, product, !req));
  const isServerRendered = !req;

  return {
    isServerRendered,
    brand,
    product,
    specs: result.specs,
    rating: result.rating,
    ratings: result.ratings,
    reviews: result.reviews
  };
};

Reviews.propTypes = {
  isServerRendered: PropTypes.bool.isRequired,
  brand: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  specs: PropTypes.object,
  rating: PropTypes.number,
  ratings: PropTypes.array,
  reviews: PropTypes.array
};
