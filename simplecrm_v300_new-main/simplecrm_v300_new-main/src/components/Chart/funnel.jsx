import React from 'react';
import useStyles from "./styles";
import { FunnelChart } from 'react-funnel-pipeline'
import 'react-funnel-pipeline/dist/index.css'
import { LBL_NO_DATA } from '../../constant';


function Funnel({ dataJson, currencyCode }) {
    const classes = useStyles();
    let chartJson = JSON.parse(dataJson);

    return (
        <div className={classes.chartBox} style={{ paddingLeft: 30, paddingRight: 30 }}>
            <FunnelChart
                data={chartJson.data}
                pallette={[
                    '#3366CC', '#109618', '#FF9900', '#DC3912', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'
                ]}
                getRowStyle={() => { return { margin: '0px' } }}
                getRowNameStyle={(row) => { return { fontSize: '12px' } }}
                getRowValueStyle={(row) => { return { fontSize: '10px' } }}
                getToolTip={(row) => { return row.value.toLocaleString(undefined, { style: 'currency', currency: currencyCode, maximumFractionDigits: 2 }) }}
                showRunningTotal={true}
                showValues={false}
            >{LBL_NO_DATA}</FunnelChart>
        </div>

    )

}

export default Funnel;