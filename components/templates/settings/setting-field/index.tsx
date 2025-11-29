"use client";

import type { Setting } from "@/core/types/types";
import type React from "react";
import { type JSX, useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Checkbox, Switch } from "antd";
import { updateSetting } from "@/core/actions";

interface SettingFieldProps {
  setting: Setting;
}

const SettingField: React.FC<SettingFieldProps> = ({ setting }) => {
  const initialData = setting.data as any;
  const [formData, setFormData] = useState(initialData);
  const [changedField, setChangedField] = useState<string | null>(null);
  const t = useTranslations("common");

  const setDeepValue = (obj: any, path: string, value: any) => {
    if (!path) return value;
    const keys = path.split(".");
    const last = keys.pop() as string;
    let pointer = obj;
    for (const k of keys) {
      if (!pointer[k]) pointer[k] = {};
      pointer = pointer[k];
    }
    pointer[last] = value;
    return obj;
  };

  const handleChange = (path: string, value: any) => {
    setFormData((prev: any) => {
      const clone = JSON.parse(JSON.stringify(prev));
      return setDeepValue(clone, path, value);
    });
    // Mark this field as changed
    setChangedField(path);
  };

  const getChangedData = (current: any, initial: any, prefix = "") => {
    const changes: Record<string, any> = {};
    if (typeof current !== "object" || current === null) {
      if (JSON.stringify(current) !== JSON.stringify(initial))
        changes[prefix] = current;
      return changes;
    }
    for (const key in current) {
      const currentVal = current[key];
      const initialVal = initial[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (
        typeof currentVal === "object" &&
        currentVal !== null &&
        !Array.isArray(currentVal)
      ) {
        Object.assign(changes, getChangedData(currentVal, initialVal, fullKey));
      } else if (JSON.stringify(currentVal) !== JSON.stringify(initialVal)) {
        changes[fullKey] = currentVal;
      }
    }
    return changes;
  };

  const handleSubmit = async (fieldPath: string) => {
    const changed = getChangedData(formData, initialData, setting.name);
    console.log("=== Setting Submit ===");
    console.log("name:", setting.name);
    console.log("changed field:", fieldPath);
    console.log("======================");
    const entries = Object.entries(changed);

    if (entries.length > 0) {
      const [key, value] = entries[0];  
    const res = await updateSetting(key.split('.')[1],value)
    console.log(res)
      console.log(key, value);
    } else {
      console.log("No changes detected");
    }
    setChangedField(null);
    // TODO: Add your API call here to save the changes
  };

  const getDeepValue = (obj: any, path: string) => {
    if (!path) return obj;
    const keys = path.split(".");
    let pointer = obj;
    for (const k of keys) {
      if (pointer === undefined || pointer === null) return undefined;
      pointer = pointer[k];
    }
    return pointer;
  };

  const renderField = (
    key: string,
    value: any,
    depth = 0,
    path: string
  ): JSX.Element | null => {
    const marginLeft = depth > 0 ? "ml-6" : "";
    const isFieldChanged = changedField === path;
    const initialValue = getDeepValue(initialData, path);
    const hasChanged = JSON.stringify(value) !== JSON.stringify(initialValue);
    const showButton = isFieldChanged && hasChanged;

    if (typeof value === "boolean") {
      return (
        <div className="mt-3">
          <Switch
            checked={value}
            onChange={(c) => handleChange(path, c)}
          />
          {showButton && (
            <Button
            className="mx-4"
              onClick={() => handleSubmit(path)}
            >
              {t("confirm")}
            </Button>
          )}
        </div>
      );
    }

    if (typeof value === "string" || typeof value === "number") {
      return (
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(path, e.target.value)}
            dir="rtl"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
          {showButton && (
            <Button
              onClick={() => handleSubmit(path)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t("confirm")}
            </Button>
          )}
        </div>
      );
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <div className={`space-y-4 ${marginLeft}`}>
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {subKey.replace(/_/g, " ")}
              </label>
              {renderField(
                subKey,
                subValue,
                depth + 1,
                path ? `${path}.${subKey}` : subKey
              )}
            </div>
          ))}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className={`space-y-4 ${marginLeft}`}>
          {value.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              {typeof item === "object" ? (
                <div className="space-y-4">
                  {Object.entries(item).map(([subKey, subValue]) => (
                    <div key={subKey}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {subKey.replace(/_/g, " ")}
                      </label>
                      {renderField(
                        subKey,
                        subValue,
                        depth + 1,
                        path
                          ? `${path}.${index}.${subKey}`
                          : `${index}.${subKey}`
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                renderField(
                  `${key}-${index}`,
                  item,
                  depth + 1,
                  path ? `${path}.${index}` : `${index}`
                )
              )}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="block text-base font-semibold text-gray-800">
          {setting.desc}
        </label>
        <div className="space-y-4">
          {renderField(setting.name, formData, 0, "")}
        </div>
      </div>
    </div>
  );
};

export default SettingField;
