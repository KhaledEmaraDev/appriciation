import "isomorphic-unfetch";
import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import ProductOverview from "../../../components/ProductOverview";
import ProductRating from "../../../components/ProductRating";
import ProductSpecs from "../../../components/ProductSpecs";

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

export default function Reviews(props) {
  const { brand, product, rating, ratings, specs } = props;

  const namedRatings = categories.phone.map((name, index) => ({
    category: name,
    value: ratings[index]
  }));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProductOverview
          brand={brand}
          product={product}
          rating={rating}
          imageExists={true}
        />
      </Grid>
      <Grid item xs={12}>
        <ProductRating brand={brand} product={product} ratings={namedRatings} />
      </Grid>
      <Grid item xs={12}>
        <ProductSpecs brand={brand} product={product} specs={specs} />
      </Grid>
    </Grid>
  );
}

Reviews.getInitialProps = async ({ query }) => {
  const { brand, product } = query;
  const res = await fetch(
    `http://localhost:3000/api/reviews/${brand}/${product}`
  );
  const json = await res.json();
  return {
    brand,
    product,
    rating: json.rating,
    ratings: json.ratings,
    specs: json.specs
  };
};

Reviews.propTypes = {
  brand: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  rating: PropTypes.number,
  ratings: PropTypes.array,
  specs: PropTypes.object
};
