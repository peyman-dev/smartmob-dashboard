"use client";
import React, { useState } from "react";
import { Table as AntdTable } from "antd";
import type { TableColumnType } from "antd";
import SortOrders from "@/components/templates/orders/search-orders";

interface IDataRowProps {
  _id: string;
  product: string;
  price: number;
  status: string;
  productImg: string
}

const Table = () => {
  const [data, setData] = useState<IDataRowProps[]>([
    {
      _id: "1",
      product: "لپ‌تاپ دل XPS",
      price: 45000000,
      status: "تکمیل شده",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "2",
      product: "ماوس لاجیتک",
      price: 1200000,
      status: "در انتظار",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "1",
      product: "لپ‌تاپ دل XPS",
      price: 45000000,
      status: "تکمیل شده",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "2",
      product: "ماوس لاجیتک",
      price: 1200000,
      status: "در انتظار",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "1",
      product: "لپ‌تاپ دل XPS",
      price: 45000000,
      status: "تکمیل شده",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "2",
      product: "ماوس لاجیتک",
      price: 1200000,
      status: "در انتظار",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "1",
      product: "لپ‌تاپ دل XPS",
      price: 45000000,
      status: "تکمیل شده",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "2",
      product: "ماوس لاجیتک",
      price: 1200000,
      status: "در انتظار",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "1",
      product: "لپ‌تاپ دل XPS",
      price: 45000000,
      status: "تکمیل شده",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "2",
      product: "ماوس لاجیتک",
      price: 1200000,
      status: "در انتظار",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "1",
      product: "لپ‌تاپ دل XPS",
      price: 45000000,
      status: "تکمیل شده",
      productImg: "https://picsum.photos/400/200"
    },
    {
      _id: "2",
      product: "ماوس لاجیتک",
      price: 1200000,
      status: "در انتظار",
      productImg: "https://picsum.photos/400/200"
    },
  ]);
  const columns: TableColumnType<IDataRowProps>[] = [
    {
      title: "شناسه",
      dataIndex: "_id", // درست اشاره کرد به فیلد
      key: "_id", // بهتره key هم بذاری
      className: "font-estedad!",
    },
    {
      title: "محصول",
      dataIndex: "product",
      key: "product",
      className: "font-estedad!",
      render(value, record, index) {
          return <div className="flex items-center gap-2">
            <img src={record.productImg} className="w-20 h-10 rounded-lg" alt="" />
            {record.product}
          </div>
      },
    },
    {
      title: "قیمت محصول",
      dataIndex: "price",
      key: "price",
      className: "font-estedad!",
      render: (price: number) => `${price.toLocaleString()} تومان`, // اختیاری: فرمت قیمت
    },
    {
      title: "وضعیت سفارش",
      dataIndex: "status",
      key: "status",
      className: "font-estedad!",
      render: (status: string) => (
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            status === "تکمیل شده"
              ? "bg-green-100 text-green-800"
              : status === "در انتظار"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "مدیریت",
      key: "actions", // چون dataIndex نداره، key بذار
      className: "font-estedad!",
      render: (_, record) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:underline">ویرایش</button>
          <button className="text-red-600 hover:underline">حذف</button>
        </div>
      ),
    },
  ];

  // داده نمونه برای تست (حذفش کن وقتی دیتا از سرور میاد)
  //   const data: IDataRowProps[] =

  return (
    <div>
      <div className="flex items-center justify-between px-4 border h-20 rounded-t-2xl border-b-0 border-zinc-100">
        <div></div>
        <SortOrders />
      </div>
      <AntdTable
        columns={columns}
        dataSource={data}
        rowKey="_id" // خیلی مهمه! بدون این خطا می‌گیری
        pagination={{ pageSize: 10 }}
        className="shadow-sm **:[.ant-pagination-prev]:rotate-180! **:[.ant-pagination-next]:rotate-180!"
      />
    </div>
  );
};

export default Table;
