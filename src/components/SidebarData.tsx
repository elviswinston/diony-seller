import { SidebarItem } from "../types/SidebarItem";
import {
  BsBagCheck,
  BsCaretDownFill,
  BsCaretUpFill,
  BsCartCheck,
  BsGear
} from "react-icons/bs";

export const SidebarData: SidebarItem[] = [
  {
    title: "Quản Lý Đơn Hàng",
    path: "/order",
    icon: <BsCartCheck />,
    iconOpened: <BsCaretUpFill />,
    iconClosed: <BsCaretDownFill />,
    subnav: [
      {
        title: "Tất cả",
        path: "/seller/order",
        icon: "",
      },
    ],
  },
  {
    title: "Quản Lý Sản Phẩm",
    path: "/product",
    icon: <BsBagCheck />,
    iconOpened: <BsCaretUpFill />,
    iconClosed: <BsCaretDownFill />,
    subnav: [
      {
        title: "Tất Cả Sản Phẩm",
        path: "/seller/product/list/all",
        icon: "",
      },
      {
        title: "Thêm Sản Phẩm",
        path: "/seller/category",
        icon: "",
      }
    ],
  },
  {
    title: "Thiết lập shop",
    path: "/setting",
    icon: <BsGear />,
    iconOpened: <BsCaretUpFill />,
    iconClosed: <BsCaretDownFill />,
    subnav: [
      {
        title: "Địa chỉ",
        path: "/seller/setting/address",
        icon: "",
      },
    ],
  },
];
