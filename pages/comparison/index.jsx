import React from "react";
import fetch from "../../fetch";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import ProductSpecs from "../../components/ProductSpecs";

const getDataURL = (brand, product, comparedBrand, comparedProduct, isClient) =>
  `${
    isClient ? process.env.HOST_CLIENT : process.env.HOST_SERVER
  }/api/pages/comparison?brand=${encodeURIComponent(
    brand
  )}&product=${encodeURIComponent(product)}&comparedBrand=${encodeURIComponent(
    comparedBrand
  )}&comparedProduct=${encodeURIComponent(comparedProduct)}`;

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

ComparedReviews.getInitialProps = async ({ req, query }) => {
  const { brand, product, comparedBrand, comparedProduct } = query;
  const res = await fetch(
    getDataURL(brand, product, comparedBrand, comparedProduct, !req)
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
