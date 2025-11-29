"use client";
import DynamicDrawer from "@/components/common/drawer";
import { updateUserInfos } from "@/core/actions";
import { User } from "@/core/types/types";
import { Button, Input, InputNumber, InputNumberProps, Select } from "antd";
import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

const EditUserInfos = ({
  isDrawerOpen,
  toggleDrawer,
  user,
  onSuccess,
}: {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  user: User;
  onSuccess: () => void;
}) => {
  const [values, setValues] = useState<User>(user);
  console.log(user);
  const [isEditingData, startTransition] = useTransition();
  const t = useTranslations("users");
  const commonT = useTranslations("common");

  const isCurrencyTOMAN = values.accountInfo.currency == "TOMAN";

  const formatter: InputNumberProps<number>["formatter"] = (value) => {
    const [start, end] = `${value}`.split(".") || [];
    const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `$ ${end ? `${v}.${end}` : `${v}`}`;
  };

  const handleEdit = () => {
    startTransition(async () => {
      const { coin, currency, money } = values.accountInfo;
      console.log({
      });
      const res = await updateUserInfos({
        coinOther: coin.other,
        coinFollow: coin.follow,
        currency,
        moneyTOMAN: money.TOMAN,
        moneyUSD: money.USD,
        user: values._id,
        email: values.contacts.email.email,
      });
      console.log(res);
      if (res.status) {
        toggleDrawer();
        onSuccess();
        toast.success(t("user_status_changed"), {
          position: "top-right",
        });
      } else {
        toast.error("خطایی هنگام ویرایش اطلاعات کاربر رخ داده است");
      }
    });
  };
  return (
    <DynamicDrawer
      footer={
        <div className="flex items-center gap-2 py-3 justify-end">
          <Button color="red" variant="filled">
            {commonT("cancel")}
          </Button>
          <Button
            loading={isEditingData}
            onClick={handleEdit}
            variant="solid"
            color="blue"
          >
            {commonT("saveChanges")}
          </Button>
        </div>
      }
      className="*:space-y-4"
      title={t("editInformation")}
      open={isDrawerOpen}
      onClose={toggleDrawer}
    >
      <div className="space-y-2">
        <label>{commonT("email")}</label>
        <Input
          dir="ltr"
          placeholder={commonT("email_placeholder")}
          value={values.contacts.email?.email ?? ""}
          onChange={(e) => {
            const newEmail = e.target.value;

            setValues((prev) => ({
              ...prev,
              contacts: {
                ...prev.contacts,
                email: {
                  ...(prev.contacts.email ?? {}),
                  email: newEmail,
                },
              },
            }));
          }}
        />
      </div>
      <div className="*:block">
        <label htmlFor="user-currency">ارز حساب</label>
        <Select
          className="mt-2! h-12! border-neutral-200! w-full **:font-estedad!"
          id="user-currency"
          defaultValue={isCurrencyTOMAN ? "TOMAN" : "USD"}
          onChange={(value) => {
            setValues((rest) => ({
              ...rest,
              accountInfo: {
                ...rest.accountInfo,
                currency: value as User["accountInfo"]["currency"],
              },
            }));
          }}
          options={[
            {
              value: "TOMAN",
              label: commonT("currency.TOMAN"),
              className: "font-estedad!",
              disabled: isCurrencyTOMAN,
            },
            {
              value: "USD",
              label: commonT("currency.USD"),
              className: "font-estedad!",
              disabled: !isCurrencyTOMAN,
            },
          ]}
        />
      </div>
      <div>
        <label htmlFor="">{t("balance")}</label>
        <div className="mt-2! grid grid-cols-2 gap-4!">
          <div>
            <InputNumber
              formatter={formatter}
              value={values.accountInfo.money.TOMAN}
              suffix={commonT("currency.TOMAN")}
              className="h-10 mt-2.5! rounded-lg border border-neutral-200 w-full!"
              onChange={(value) => {
                setValues((rest) => ({
                  ...rest,
                  accountInfo: {
                    ...rest.accountInfo,
                    money: {
                      ...rest.accountInfo.money,
                      TOMAN: value as number,
                    },
                  },
                }));
              }}
            />
            <p className="text-xs mt-1 5 text-sky-500">
              {values.accountInfo.money.TOMAN.toLocaleString()}
              {commonT("currency.TOMAN")}
            </p>
          </div>
          <div className="w-full!">
            {/* <input
              type="text"
              placeholder="دلار"
              /> */}
            <InputNumber
              formatter={formatter}
              value={Math.floor(values.accountInfo.money.USD)}
              className="h-10 mt-2.5! rounded-lg border border-neutral-200 w-full!"
              suffix={commonT("currency.USD")}
              onChange={(value) => {
                setValues((rest) => ({
                  ...rest,
                  accountInfo: {
                    ...rest.accountInfo,
                    money: {
                      ...rest.accountInfo.money,
                      USD: value as number,
                    },
                  },
                }));
              }}
            />
            <p className="text-xs mt-1 5 text-sky-500 font-estedad!">
              {values.accountInfo.money.USD.toLocaleString()}{" "}
              {commonT("currency.USD")}
            </p>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="">{t("coins")}</label>
        <div className="mt-2! grid grid-cols-2 gap-4!">
          <div>
            <InputNumber
              formatter={formatter}
              value={values.accountInfo.coin.follow}
              onChange={(value: number | null) => {
                setValues((rest) => ({
                  ...rest,
                  accountInfo: {
                    ...rest.accountInfo,
                    coin: {
                      ...rest.accountInfo.coin,
                      follow: value || 0,
                    },
                  },
                }));
              }}
              suffix={
                <div className="flex items-center gap-1">
                  <Coins className="size-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500">
                    {commonT("priceModel.follow")}
                  </span>
                </div>
              }
              className="h-10 mt-2.5! rounded-lg border border-neutral-200 w-full!"
            />
          </div>
          <div className="w-full!">
            <InputNumber
              formatter={formatter}
              value={Math.floor(values.accountInfo.coin.other)}
              className="h-10 mt-2.5! rounded-lg border border-neutral-200 w-full!"
              suffix={
                <div className="flex items-center gap-1">
                  <Coins className="size-4 text-neutral-500" />
                  <span className="text-xs text-neutral-500">
                    {commonT("priceModel.default")}
                  </span>
                </div>
              }
              onChange={(value: number | null) => {
                setValues((rest) => ({
                  ...rest,
                  accountInfo: {
                    ...rest.accountInfo,
                    coin: {
                      ...rest.accountInfo.coin,
                      other: value || 0,
                    },
                  },
                }));
              }}
            />
          </div>
        </div>
      </div>
    </DynamicDrawer>
  );
};

export default EditUserInfos;
