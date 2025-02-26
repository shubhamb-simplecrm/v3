
import React from 'react';
import Chart from "react-google-charts";

const GeoChart = ({dataJson }) => {
    let chartJson = JSON.parse(dataJson);
    return (
        <>
            <Chart
                height={"280px"}
                chartType="GeoChart"
                data={
                    chartJson.data
                }
                // Note: you will need to get a mapsApiKey for your project.
                // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                mapsApiKey="AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY"
                rootProps={{ 'data-testid': '1' }}
            />
        </>
    );
}
export default GeoChart;