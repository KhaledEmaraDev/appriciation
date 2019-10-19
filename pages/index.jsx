import React from "react";
import PropTypes from "prop-types";
import CallToAction from "../components/CallToAction";
import Grid from "@material-ui/core/Grid";
import ProductReviews from "../components/ProductReviews";

import { useStateValue } from "../store";
import { setDialog } from "../actions";

export default function Index(props) {
  const { reviews } = props;
  const [{ user }, dispatch] = useStateValue();

  function handleReviewClick() {
    dispatch(setDialog("review"));
  }

  function handleSignUpClick() {
    dispatch(setDialog("sign-up"));
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CallToAction
          headerTitle="أول منصة لمراجعات المستخدمين بالشرق الأوسط"
          subheaderTitle="اَراء مستخدمي الهواتف في مكان واحد"
          subtitle="هدفنا مساعدتك تختار"
          primaryActionText="راجع الاَن"
          handlePrimaryAction={handleReviewClick}
          showSecondaryAction={!user}
          secondaryActionText="سجل الاَن"
          handleSecondaryAction={handleSignUpClick}
        />
      </Grid>
      <Grid item xs={12}>
        <ProductReviews title="أخر المراجعات" reviews={reviews} />
      </Grid>
    </Grid>
  );
}

Index.getInitialProps = async () => {
  const res = await fetch(`http://localhost:3000/api/reviews/most_recent`);
  const json = await res.json();
  return {
    reviews: json.reviews
  };
};

Index.propTypes = {
  reviews: PropTypes.array
};
