import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import ProductSpecs from "../../../../../../../components/ProductSpecs";

export default function ComparedReviews(props) {
  const {
    brand,
    product,
    comparedBrand,
    comparedProduct,
    specs,
    comparedSpecs
  } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProductSpecs
          brand={brand}
          product={product}
          specs={specs}
          comparedBrand={comparedBrand}
          comparedProduct={comparedProduct}
          comparedSpecs={comparedSpecs}
        />
      </Grid>
    </Grid>
  );
}

ComparedReviews.getInitialProps = async ({ query }) => {
  const { brand, product, comparedBrand, comparedProduct } = query;
  const res = await fetch(
    `http://localhost:3000/api/pages/review/${encodeURIComponent(
      brand
    )}/${encodeURIComponent(product)}/compare/${encodeURIComponent(
      comparedBrand
    )}/${encodeURIComponent(comparedProduct)}`
  );
  const result = await res.json();
  return {
    brand,
    product,
    comparedBrand,
    comparedProduct,
    specs: result.specs,
    comparedSpecs: result.comparedSpecs
  };
};

ComparedReviews.propTypes = {
  brand: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  comparedBrand: PropTypes.string.isRequired,
  comparedProduct: PropTypes.string.isRequired,
  specs: PropTypes.object,
  comparedSpecs: PropTypes.object
};
