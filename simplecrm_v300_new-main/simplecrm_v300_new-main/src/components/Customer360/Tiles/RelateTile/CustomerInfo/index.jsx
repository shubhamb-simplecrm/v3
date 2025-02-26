import React, {useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  useTheme,
  List,
  ListItemText,
  Typography,
  Grid
} from '@material-ui/core'
import useStyles, { getMuiTheme } from './styles'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { pathOr } from 'ramda';
import { getDetailView} from "../../../../../store/actions/detail.actions"
export default function CustomerInfo({data,id}) {
  const classes = useStyles()
  const currentTheme = useTheme()
  const { module } = useParams()
  const dispatch = useDispatch()
  const { detailViewTabData } = useSelector(
    (state) => state.detail,
  );
  const { selectedModule } = useSelector((state) => state.modules);
  const getDetailViewData = useCallback(() => {
    module && dispatch(getDetailView(selectedModule,id))
}, [dispatch, selectedModule,id,module]);

useEffect(
  () => {
    getDetailViewData();
  }, [getDetailViewData]
);
const is_group_array = pathOr(
  [],
  ["data", "templateMeta", "data","0","attributes"],
  detailViewTabData[module],
);
  let dataArray= ["customer_cif_number_c","customer_name_c","language_preference","gender_c","profession","date_of_birth_c","customer_category_c","customer_nic_c","customer_mobile_number_c","pp_number_c","driving_license_id","phone_alternate","phone_office","arm_rm","marital_status","profession_qualification"]
  let finalArray=[]
  var obj = {}
  obj["01"] = finalArray.label;
  obj["02"] = finalArray.value;
  is_group_array.forEach((item,index)=>{
    item.forEach((item2,index1)=>{
      dataArray.forEach((item3,index3)=>{
        if(item2.name===item3)
        {
          finalArray.push({ 'label':item2.label, "value":item2.value} )
        }
      })
    })
  });
  
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <List dense className={classes.root}>
          {finalArray.map((item,index)=>{ 
            return(
                  <ListItemText
                    id={`checkbox-list-secondary-label-${index.index1}`}
                    primary={
                      <React.Fragment>
                      <Typography component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary">
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item md={6}>
                              {item.label || ''}
                            </Grid>
                            <Grid item md={6}>
                              <React.Fragment>
                                : {item.value}
                              </React.Fragment>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Typography>
                      </React.Fragment>
                    }
                />
                
                )})}
      </List>
    </MuiThemeProvider>
  )
}
