/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
const Page = (props) => {
  const { title, children, ...rest } = props;

  return <div {...rest}>{children}</div>;
};

Page.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default Page;
