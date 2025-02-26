import React from "react";
import { Paper } from '@material-ui/core';

export const CustomPaper = (props) => {
    return <Paper elevation={8} {...props} />;
};