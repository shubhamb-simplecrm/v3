import { makeStyles } from "@material-ui/core";


export default makeStyles((theme) => ({
    container: {
        display: "flex",
        margin: "0 10px",
        color: theme.palette.secondary.main
    },
    optionWrapper: {
        display: "flex",
        padding: "10px 5px",
        margin: "0 2px",
        "&:hover": {
            cursor: "pointer",
            color: theme.palette.secondary.dark
        }
    },

}));