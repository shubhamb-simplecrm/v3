import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr } from "ramda";
import { getMuiTheme } from "./styles";
import SearchBar from "material-ui-search-bar";
import { Typography, Grid, useTheme, Paper } from "@material-ui/core";
import { getPortalAdminModuleList } from "../../../../store/actions/portalAdmin.actions";
import { Skeleton } from "../../..";
import useStyles from "./styles";
import MUIDataTable from "mui-datatables";

const ListView = ({}) => {
  const dispatch = useDispatch();
  const { section, module, id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const classes = useStyles();
  const currentTheme = useTheme();
  const { portalAdminModuleListLoading, portalAdminFieldListLoading } =
    useSelector((state) => state.portalAdmin);
  let [listData, setListData] = useState({});
  let [listHeaderData, setListHeaderData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedListData, setUpdatedListData] = useState({});

  const getModuleListData = useCallback(() => {
    redirectToView();
  }, []);

  const redirectToView = () => {
    setIsLoading(true);
    dispatch(getPortalAdminModuleList(section, module, id))
      .then((res) => {
        const rowData = pathOr({}, ["data", "templateMeta", "data"], res);
        const rowDataHeader = pathOr(
          [],
          ["data", "templateMeta", "datalabels"],
          res,
        );
        setListData(rowData);
        setListHeaderData([rowDataHeader]);
        setIsLoading(false);
        setSearchQuery("");
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getListData = () => {
    const ListCreatedArray = [];
    if (searchQuery === "") {
      Object.values(listData).map((row) => {
        ListCreatedArray.push([
          <Link
            className={classes.link}
            to={
              section === "portalAdminLinks"
                ? `/app/portalAdministrator/setConfigurator/${section}/${row.field_key}/Set Configuration`
                : section === "dropdownEditor"
                  ? `/app/portalAdministrator/editview/${section}/${row.field_key}`
                  : module
                    ? `/app/portalAdministrator/editview/${section}/${module}/${row.field_key}`
                    : `/app/portalAdministrator/${section}/${row.field_key}`
            }
          >
            {row.label}
          </Link>,
        ]);
      });
    } else {
      Object.values(updatedListData).map((row) => {
        ListCreatedArray.push([
          <Link
            className={classes.link}
            to={
              section === "portalAdminLinks"
                ? `/app/portalAdministrator/setConfigurator/${section}/${row.field_key}/Set Configuration`
                : module
                  ? `/app/portalAdministrator/editview/${section}/${module}/${row.field_key}`
                  : `/app/portalAdministrator/${section}/${row.field_key}`
            }
          >
            <Typography>{row.label}</Typography>
          </Link>,
        ]);
      });
    }
    return ListCreatedArray;
  };

  const requestSearch = (searchedVal) => {
    setSearchQuery(searchedVal);
  };

  const cancelSearch = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    redirectToView();
  }, [module]);

  useEffect(() => {
    getModuleListData();
  }, []);

  useEffect(() => {
    if (searchQuery != "") {
      const searchList = {};
      Object.keys(listData).filter((row) => {
        if (
          listData[row]["label"]
            .toLowerCase()
            .indexOf(searchQuery.toLowerCase()) != -1
        ) {
          searchList[row] = listData[row];
        }
      });
      setUpdatedListData(searchList);
    }
  }, [searchQuery]);

  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <Paper style={{ padding: "10px", height: "100vh" }}>
        {portalAdminModuleListLoading ||
        portalAdminFieldListLoading ||
        isLoading ? (
          <Skeleton />
        ) : (
          <>
            <Grid container direction="row-reverse">
              <Grid item sm={12} md={4}>
                <SearchBar
                  value={searchQuery}
                  onChange={(searchVal) => requestSearch(searchVal)}
                  onCancelSearch={() => cancelSearch()}
                  className={classes.searchBar}
                />
              </Grid>
            </Grid>
            <MUIDataTable
              // title={getModuleLabel()}
              data={getListData()}
              columns={listHeaderData}
              options={{
                selectableRows: false,
                download: false,
                print: false,
                viewColumns: false,
                filter: false,
                search: false,
                rowsPerPageOptions: false,
                sort: false,
                // pagination: false,
                // customSearchRender: (searchQuery, currentRow, columns) => {
                //   console.log('customSearch', searchQuery, currentRow, columns);
                //   return true;
                // },
                // customSearchRender: (string, options) => <SearchBar/>
              }}
            />
          </>
        )}
      </Paper>
    </MuiThemeProvider>
  );
};

export default ListView;
