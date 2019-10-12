import React from "react";
import CallToAction from "../components/CallToAction";

import { useStateValue } from "../store";
import { setDialog } from "../actions";

export default function Index() {
  const [{ user }, dispatch] = useStateValue();

  function handleSignUpClick() {
    dispatch(setDialog("sign-up"));
  }

  return (
    <CallToAction
      headerTitle="أول منصة لمراجعات المستخدمين بالشرق الأوسط"
      subheaderTitle="اَراء مستخدمي الهواتف في مكان واحد"
      subtitle="هدفنا مساعدتك تختار"
      primaryActionText="راجع الاَن"
      handlePrimaryAction={e => e.preventDefault()}
      showSecondaryAction={!user}
      secondaryActionText="سجل الاَن"
      handleSecondaryAction={handleSignUpClick}
    />
  );
}
