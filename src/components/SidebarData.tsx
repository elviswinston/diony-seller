import { SidebarItem } from "../types/SidebarItem";
import { BsBagCheck, BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";

export const SidebarData: SidebarItem[] = [
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
      },
      {
        title: "Sản Phẩm Vi Phạm",
        path: "/product/list/all",
        icon: "",
      },
    ],
  },
];
