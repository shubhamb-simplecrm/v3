import { makeStyles } from "@material-ui/core";

const drawerWidth = 220;
export default makeStyles((theme) => ({
  searchBar: {
    padding: 5,
    color: "#fff",
    "& input": {
      color: "#fff",
      // fontSize: 14,
    },
    "& label": {
      fontSize: 16,
    },
  },
}));
