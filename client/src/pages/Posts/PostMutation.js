import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/Layout/Layout";
import { BasicTable } from "../../components/Table/BasicTable";
import http from "../../utils/axios-instance";
const PostMutation = () => {
  const [value, setValue] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const getAllRegions = async () => {
    try {
      const res = await http({
        url: `/regions?page=${page}&size=${size}`,
      });
      setValue(res.data.data.content);
      setPagination(res.data.data.pagination);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    getAllRegions();
  }, [page]);
  const regionCols = [
    {
      id: "name",
      Header: "Viloyat",
      accessor: (region) => {
        return <Link to={`/posts/${region.id}/orders`}>{region.name}</Link>;
      },
    },
  ];

  return (
    <Layout pageName="Yangi pochta yaratish">
      {/* {value?.length > 0 ? (
        <BasicTable
          columns={regionCols}
          data={value}
          pagination={pagination}
          url="posts/new"
        />
      ) : (
        <p>Ma'lumotlar yo'q</p>
      )} */}

    </Layout>
  );
};
export default PostMutation;
