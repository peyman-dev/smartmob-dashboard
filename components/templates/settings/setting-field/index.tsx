"use client";

import type { Setting } from "@/core/types/types";
import type React from "react";
import { JSX, useState } from "react";
import { useTranslations } from "next-intl";
import { Switch } from "antd";
import { updateSetting } from "@/core/actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface SettingFieldProps {
  setting: Setting;
  onSuccess: () => void;
}

const SettingField: React.FC<SettingFieldProps> = ({ setting, onSuccess }) => {
  const initialData = setting.data as any;
  const [formData, setFormData] = useState<any>(initialData);
  const [changedField, setChangedField] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const t = useTranslations("common");

  const convertToOriginalType = (current: any, original: any): any => {
    if (original === null || original === undefined) return current;

    if (typeof original === "number") {
      if (current === "" || current === null || current === undefined)
        return original;
      const num = Number(current);
      return isNaN(num) ? original : num;
    }

    if (typeof original === "boolean") {
      if (current === "true" || current === true) return true;
      if (current === "false" || current === false) return false;
      return original;
    }

    if (typeof original === "string") {
      return String(current ?? "").trim();
    }

    if (Array.isArray(original)) {
      return current.map((item: any, idx: number) =>
        convertToOriginalType(item, original[idx] ?? item)
      );
    }

    if (typeof original === "object") {
      const result: any = {};
      for (const key in original) {
        result[key] = convertToOriginalType(
          current[key] ?? original[key],
          original[key]
        );
      }
      return result;
    }

    return current;
  };

  const setDeepValue = (obj: any, path: string, value: any) => {
    if (!path) return value;
    const keys = path.split(".");
    const last = keys.pop()!;
    let pointer = obj;
    for (const k of keys) {
      if (!pointer[k] || typeof pointer[k] !== "object") pointer[k] = {};
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
    setChangedField(path);
  };

  const getDeepValue = (obj: any, path: string) => {
    if (!path) return obj;
    return path.split(".").reduce((acc, k) => acc?.[k], obj);
  };

  const hasChanges = (): boolean => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  };

  const handleSubmit = async () => {
    const convertedData = convertToOriginalType(formData, initialData);

    const payload = {
      name: setting.name,
      data: convertedData,
    };

    try {
      const res = await updateSetting(payload);

      if (res.status) {
        toast.success(t("update_success"));
        onSuccess?.();
      } else {
        toast.error(res.message || t("update_failed"));
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setChangedField(null);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const renderField = (
    key: string,
    value: any,
    depth = 0,
    path: string = ""
  ): JSX.Element | null => {
    const fullPath = path ? `${path}.${key}` : key;
    const initialValue = getDeepValue(initialData, fullPath);
    const currentValue = getDeepValue(formData, fullPath);
    const hasChangedField =
      JSON.stringify(currentValue) !== JSON.stringify(initialValue);
    const showSaveButton = changedField === fullPath && hasChangedField;

    if (typeof value === "boolean") {
      return (
        <div className="flex items-center justify-between py-3">
          <Switch
            checked={value}
            onChange={(checked) => handleChange(fullPath, checked)}
            className="bg-gray-300"
            style={{ backgroundColor: value ? "#2563eb" : undefined }}
          />
          <AnimatePresence>
            {showSaveButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleSubmit}
                className="mr-3 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
              >
                <Check size={15} />
                {t("confirm")}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (typeof value === "number" || typeof value === "string") {
      const isNumber = typeof initialValue === "number";

      return (
        <div className="space-y-3 py-2">
          <input
            type={isNumber ? "number" : "text"}
            value={value ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              handleChange(
                fullPath,
                isNumber ? (val === "" ? "" : Number(val)) : val
              );
            }}
            dir={isNumber ? "ltr" : "rtl"}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <AnimatePresence>
            {showSaveButton && (
              <motion.button
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onClick={handleSubmit}
                className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2"
              >
                <Check size={16} />
                {t("confirm")}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const itemId = fullPath;
      const isExpanded = expandedItems.has(itemId);

      return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleExpanded(itemId)}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50"
          >
            <span className="font-medium capitalize">
              {key.replace(/_/g, " ")}
            </span>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
              <ChevronDown size={20} className="text-gray-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-gray-200 bg-gray-50/50"
              >
                <div className="p-5 space-y-6">
                  {Object.entries(value).map(([subKey, subValue]) =>
                    renderField(subKey, subValue, depth + 1, fullPath)
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-3">
          {value.map((item, index) => {
            const itemPath = `${fullPath}[${index}]`;
            const isExpanded = expandedItems.has(itemPath);

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleExpanded(itemPath)}
                  className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-700">
                    {key.replace(/_/g, " ")} #{index + 1}
                  </span>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown size={20} className="text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="border-t border-gray-200 bg-gray-50/30"
                    >
                      <div className="p-5 space-y-5">
                        {typeof item === "object" && item !== null
                          ? Object.entries(item).map(([k, v]) =>
                              renderField(
                                k,
                                v,
                                depth + 1,
                                `${fullPath}.${index}`
                              )
                            )
                          : renderField(
                              `${key}-${index}`,
                              item,
                              depth + 1,
                              `${fullPath}.${index}`
                            )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-lg font-bold text-white">{setting.desc}</h3>
      </div>

      <div className="p-6">
        {renderField(setting.name, formData)}

        {hasChanges() && changedField === null && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl flex items-center justify-center gap-2"
            >
              <Check size={18} />
              ذخیره همه تغییرات
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SettingField;
