export const postRejectedCreateOrUpdateFn = async (ordersIdArr, navigate) => {
  try {
    const res = await http({
      url: "/postback/new/rejected",
      data: { ordersArr: ordersIdArr },
      method: "POST",
    });
    toast.success(res?.data?.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  navigate("/posts");
};

export const postCreateOrUpdateFn = async (url, id, ordersIdArr, navigate) => {
  try {
    const res = await http({
      url: url
        ? url.split("/")[3] === "regionorders"
          ? "posts/new"
          : "posts/new/customized"
        : "",
      data: url
        ? url.split("/")[3] === "regionorders"
          ? { regionId: id, ordersArr: ordersIdArr }
          : { postId: id, ordersArr: ordersIdArr }
        : "",
      method: url
        ? url.split("/")[3] === "regionorders"
          ? "POST"
          : "PUT"
        : "",
    });
    toast.success(res?.data?.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  navigate("/posts");
};
