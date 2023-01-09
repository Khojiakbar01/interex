import { useState } from "react";
import { toast } from "react-toastify";

const useHttp = (reqFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);

  const send = async (reqData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reqFn(reqData);
      setData(res.data.content);
      setPagination(res.data.pagination);
      if (res.message) {
        toast.success(res.message);
      }
    } catch (err) {
      const error = await err.response.data;
      toast.error(error.message);
    }
    setLoading(false);
  };

  return { send, loading, data, pagination, error };
};

export default useHttp;
