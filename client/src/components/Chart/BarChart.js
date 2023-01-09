import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

const labels = [];
const LineChart = props => {
  console.log(props.data)
  const data = {
    labels: props?.data?.labels || [],
    datasets: [
      {
        label: "Buyurtmalari",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: props?.data?.datasets[0]?.data || [],
      },
    ],
  };

  return (
    <div>
      <Line height="80%" data={data} />
    </div>
  );
};

export default LineChart;
