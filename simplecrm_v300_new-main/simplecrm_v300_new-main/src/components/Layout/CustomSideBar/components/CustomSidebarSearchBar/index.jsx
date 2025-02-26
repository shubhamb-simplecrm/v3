import useStyles from "./styles";
import FormInput from "../../../../FormInput";
const searchFieldObj = {
  field_key: "search_field",
  name: "search_field",
  label: "Search...",
  type: "varchar",
  required: "false",
  massupdate: "false",
  len: 100,
  autoComplete: false,
};
export const CustomSidebarSearchBar = ({ searchQuery, setSearchQuery }) => {
  const classes = useStyles();
  return (
    <div className={classes.searchBar}>
      <FormInput
        field={searchFieldObj}
        value={searchQuery}
        variant="filled"
        onChange={(val) => setSearchQuery(val)}
      />
    </div>
  );
};
