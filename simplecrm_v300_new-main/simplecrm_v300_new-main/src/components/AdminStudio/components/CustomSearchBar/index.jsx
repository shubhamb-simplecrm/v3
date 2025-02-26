import React, { useEffect, useState } from "react";
import useStyles from "./styles";
import SearchBar from "material-ui-search-bar";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";

const CustomSearchBar = ({
  data,
  handleSearchedData,
  placeholder,
  applyBorder = false,
}) => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const requestSearch = (searchedVal) => {
    setSearchQuery(searchedVal);
  };
  const cancelSearch = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    if (searchQuery != "") {
      const searchList = {};
      Object.keys(data).filter((row) => {
        if (
          data[row]["label"].toLowerCase().indexOf(searchQuery.toLowerCase()) !=
          -1
        ) {
          searchList[row] = data[row];
        }
      });
      handleSearchedData(searchList);
    } else {
      handleSearchedData(data);
    }
  }, [searchQuery]);

  return (
    <SearchBar
      value={searchQuery}
      onChange={(searchVal) => requestSearch(searchVal)}
      onCancelSearch={() => cancelSearch()}
      className={clsx(classes.searchBar, {
        [classes.searchBarBorder]: applyBorder,
      })}
      searchIcon={<SearchIcon className={classes.searchIcon} />}
      placeholder={placeholder}
    />
  );
};

export default CustomSearchBar;
