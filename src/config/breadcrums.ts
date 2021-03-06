interface Breadcrum {
  path: string;
  name: string;
}

const breadcrums: Breadcrum[] = [
  {
    path: "/seller/category",
    name: "Ngành hàng sản phẩm",
  },
  {
    path: "/seller/product/new",
    name: "Thêm 1 sản phẩm mới",
  },
  {
    path: "/seller/setting/address",
    name: "Địa chi",
  },
];

export default breadcrums;
