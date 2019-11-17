import React, { useMemo } from "react";
import PropTypes from "prop-types";
import CallToAction from "../components/CallToAction";
import Carousel from "../components/Carousel";
import Grid from "@material-ui/core/Grid";
import ProductReviews from "../components/ProductReviews";

import { useStateValue } from "../store";
import { setDialog } from "../actions";

const getDataURL = isClient =>
  `${
    isClient ? process.env.HOST_CLIENT : process.env.HOST_SERVER
  }/api/review/most_recent`;

const upcomingSlides = [
  {
    brand: "Xiaomi",
    product: "Mi 9T"
  },
  {
    brand: "Huawei",
    product: "HONOR 20 lite"
  }
];

const popularSlides = [
  {
    brand: "Xiaomi",
    product: "Redmi Note 7"
  },
  {
    brand: "Xiaomi",
    product: "POCO F1"
  },
  {
    brand: "Samsung",
    product: "Galaxy A50"
  },
  {
    brand: "Huawei",
    product: "P30 lite"
  },
  {
    brand: "Oppo",
    product: "Realme 3 Pro"
  },
  {
    brand: "Huawei",
    product: "Honor 8X"
  }
];

function MainCallToAction() {
  const [{ user }, dispatch] = useStateValue();

  return useMemo(() => {
    function handleReviewClick() {
      dispatch(setDialog("review"));
    }

    function handleSignUpClick() {
      dispatch(setDialog("sign-up"));
    }

    return (
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
    );
  }, [dispatch, user]);
}

export default function Index(props) {
  const { reviews } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <MainCallToAction />
      </Grid>
      <Grid id="most-recent-reviews" item xs={12}>
        <ProductReviews title="أخر المراجعات" reviews={reviews} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Carousel title="أحدث الهواتف" slides={upcomingSlides} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Carousel title="أشهر الهواتف" slides={popularSlides} />
      </Grid>
    </Grid>
  );
}

Index.getInitialProps = async ({ req }) => {
  const result = await fetch(getDataURL(!req)).then(response =>
    response.json()
  );

  return {
    reviews: result.reviews
  };
};

Index.propTypes = {
  reviews: PropTypes.array
};
