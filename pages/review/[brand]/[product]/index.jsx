import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import ProductOverview from "../../../../components/ProductOverview";
import ProductRating from "../../../../components/ProductRating";
import ProductReviews from "../../../../components/ProductReviews";
import ProductSpecs from "../../../../components/ProductSpecs";

export default function Reviews(props) {
  const {
    brand,
    product,
    ratings_buckets,
    rating,
    ratings,
    specs,
    reviews
  } = props;

  const namedRatings = ratings_buckets.map((bucket, index) => ({
    category: bucket,
    value: ratings[index]
  }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProductOverview
          brand={brand}
          product={product}
          rating={rating}
          imageExists={specs !== null}
        />
      </Grid>
      <Grid item xs={12}>
        <ProductRating brand={brand} product={product} ratings={namedRatings} />
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

Reviews.getInitialProps = async ({ query }) => {
  const { brand, product } = query;
  const res = await fetch(
    `http://localhost:3000/api/pages/review/${encodeURIComponent(
      brand
    )}/${encodeURIComponent(product)}`
  );
  const result = await res.json();
  return {
    brand,
    product,
    ratings_buckets: result.ratings_buckets,
    rating: result.rating,
    ratings: result.ratings,
    specs: result.specs,
    reviews: result.reviews
  };
};

Reviews.propTypes = {
  brand: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  ratings_buckets: PropTypes.object,
  rating: PropTypes.number,
  ratings: PropTypes.array,
  specs: PropTypes.object,
  reviews: PropTypes.array
};
