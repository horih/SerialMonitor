import React from 'react';
import Chart from "react-apexcharts";
import { Data } from './App';
import { ApexOptions } from 'apexcharts';

interface PlotterProps {
  names : string[],
  data : Data[],
  group : number;
}

function Graph(props: PlotterProps) {
  const options : ApexOptions = {
    chart: {
      id: "realtime",
      type: "line",
      animations: {
        enabled: false,
        easing: "linear",
        dynamicAnimation: {
          speed: 0
        }
      },
      toolbar: {
        show: true
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 1,
      curve: "smooth"
    },
    title: {
      text: "Dynamic Updating Chart",
      align: "left"
    },
    markers: {
      size: 0
    },
    yaxis: {
      max: 5
    },
    legend: {
      show: false
    }
  };
  const series : ApexAxisChartSeries = props.data 
  ? [ 
    ...props.data.map((item, index) => ({
      name: props.names[index],
      data: item.data
    }))
  ]
  : [];


  return (
    <div>
      <Chart
        id={props.group}
        options={options}
        series={series}
        type="line"
        height={'100%'}
      />
    </div>
  );
};

export default Graph;