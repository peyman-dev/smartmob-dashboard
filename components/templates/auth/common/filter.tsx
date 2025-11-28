"use client";

import DynamicDrawer from "@/components/common/drawer";
import useToggle from "@/core/hooks/use-toggle";
import { Button, Form, Input, Select } from "antd";
import { FilterIcon, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

export type FilterField =
  | {
      label: string;
      key: string;
      type: "input";
      placeholder?: string;
      defaultValue?: any;
    }
  | {
      label: string;
      key: string;
      type: "select";
      placeholder?: string;
      options: { label: string; value: any }[];
      mode?: "multiple" | "tags";
      defaultValue?: any;
    }
  | {
      label: string;
      key: string;
      type: "boolean";
      defaultValue?: boolean;
    };

interface FilterProps {
  fields: FilterField[];
  onSubmit?: (values: Record<string, any>) => void;
  defaultOpen?: boolean;
}

const Filter: React.FC<FilterProps> = ({ fields, onSubmit, defaultOpen = false }) => {
  const [isOpen, toggle] = useToggle(defaultOpen);
  const params = useSearchParams()
  const [form] = Form.useForm();
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const t = useTranslations("common")


  // Load defaults
  useEffect(() => {
    const defaults: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        defaults[f.key] = f.defaultValue;
      }
    });
    form.setFieldsValue(defaults);
    setFilterValues(defaults);
  }, [fields, form]);

  const handleApply = () => {
    const values = form.getFieldsValue();

    const cleaned = Object?.fromEntries(
      Object?.entries(values).filter(([_, v]) => {
        if (v === undefined || v === null || v === "") return false;
        if (Array?.isArray(v) && v.length === 0) return false;
        return true;
      })
    );

    setFilterValues(cleaned);
    onSubmit?.(cleaned);
    toggle();
  };

  const handleReset = () => {
    form.resetFields();

    const defaults: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue;
    });

    form.setFieldsValue(defaults);
    setFilterValues(defaults);
    onSubmit?.(defaults);
    window.location.replace(window.location.pathname)
  };

  const renderField = (field: FilterField) => {
    const commonProps = {
      key: field.key,
      name: field.key,
      label: field.label,
      initialValue: field.defaultValue,
    };

    switch (field.type) {
      case "input":
        return (
          <Form.Item {...commonProps}>
            <Input placeholder={field.placeholder ?? field.label} allowClear />
          </Form.Item>
        );

      case "select":
        return (
          <Form.Item {...commonProps}>
            <Select
              placeholder={field.placeholder ?? field.label}
              options={field.options}
              mode={field.mode}
              allowClear
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        );

      case "boolean":
        return (
          <Form.Item {...commonProps}>
            <Select placeholder={field.label} allowClear>
              <Select.Option value={true}>{t("yes")}</Select.Option>
              <Select.Option value={false}>{t("no")}</Select.Option>
            </Select>
          </Form.Item>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Button
        icon={<FilterIcon className="size-4" />}
        onClick={() => toggle()}
        type="default"
        className="flex items-center gap-2"
      >
        {t("filter")}
        {Object?.keys(filterValues).length > 0 && (
          <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {Object?.keys(filterValues).length}
          </span>
        )}
      </Button>

      <DynamicDrawer open={isOpen} onClose={toggle} title={t("filter")} width={400}>
        <Form form={form} layout="vertical" className="mt-4">
          {fields.map(renderField)}

          <div className="flex gap-3 mt-6 sticky bottom-0 bg-white pt-4">
            <Button type="primary" onClick={handleApply} className="flex-1">
              {t("applyFilter")}
            </Button>
            <Button onClick={handleReset} icon={<RotateCw className="size-4" />} className="flex-1">
            {t("clear")}
            </Button>
          </div>
        </Form>
      </DynamicDrawer>
    </>
  );
};

export default Filter;
