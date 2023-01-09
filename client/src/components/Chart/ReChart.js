import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ReChart = (props) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={props?.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />
        <Bar dataKey="barchasi" fill="blue" />
        <Bar dataKey="sotilgani" fill="green" />
        <Bar dataKey="qaytgani" fill="red" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReChart;
