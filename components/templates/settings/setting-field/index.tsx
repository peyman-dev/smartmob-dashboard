"use client";

import type { Setting } from "@/core/types/types";
import type React from "react";
import { type JSX, useState } from "react";
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
  const [formData, setFormData] = useState(initialData);
  const [changedField, setChangedField] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
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

  const handleSubmit = async () => {
    let parsedData = formData;

    if (typeof setting.data === "number") {
      const num = Number(formData);
      parsedData = formData === "" || isNaN(num) ? setting.data : num;
    } else if (typeof setting.data === "boolean") {
      parsedData = formData === "true" || formData === true;
    } else if (typeof setting.data === "string") {
      parsedData = String(formData).trim();
    }

    const payload = {
      name: setting.name,
      data: parsedData,
    };

    try {
      const res = await updateSetting(payload);

      if (res.status) {
        toast.success(t("update_success"));
        onSuccess?.();
      } else {
        toast.error(t("update_failed"));
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    }

    setChangedField(null);
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

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderField = (
    key: string,
    value: any,
    depth = 0,
    path: string
  ): JSX.Element | null => {
    const isFieldChanged = changedField === path;
    const initialValue = getDeepValue(initialData, path);
    const hasChanged = JSON.stringify(value) !== JSON.stringify(initialValue);
    const showButton = isFieldChanged && hasChanged;

    if (typeof value === "boolean") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between py-2"
        >
          <Switch
            checked={value}
            onChange={(c) => handleChange(path, c)}
            style={{ backgroundColor: value ? "#2563eb" : "#d1d5db" }}
          />
          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => handleSubmit()}
                className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <Check size={16} />
                {t("confirm")}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    if (typeof value === "string" || typeof value === "number") {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(path, e.target.value)}
            dir="rtl"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Enter value..."
          />
          <AnimatePresence>
            {showButton && (
              <motion.button
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                onClick={() => handleSubmit()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Check size={16} />
                {t("confirm")}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-1"
        >
          {Object.entries(value).map(([subKey, subValue]) => {
            const itemId = path ? `${path}.${subKey}` : subKey;
            const isExpanded = expandedItems.has(itemId);
            return (
              <motion.div
                key={subKey}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => toggleExpanded(itemId)}
                  className="w-full flex items-center justify-between px-4 py-3 hover: transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {subKey.replace(/_/g, " ")}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={18} className="text-gray-500" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-gray-200 "
                    >
                      <div className="px-4 py-3">
                        {renderField(subKey, subValue, depth + 1, itemId)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-1"
        >
          {value.map((item, index) => {
            const itemId = path ? `${path}.${index}` : `${index}`;
            const isExpanded = expandedItems.has(itemId);
            return (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => toggleExpanded(itemId)}
                  className="w-full flex items-center justify-between px-4 py-3 hover: transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {key.replace(/_/g, " ")} #{index + 1}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={18} className="text-gray-500" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-gray-200 "
                    >
                      <div className="px-4 py-3 space-y-3">
                        {typeof item === "object" ? (
                          <>
                            {Object.entries(item).map(([subKey, subValue]) => (
                              <div key={subKey} className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide capitalize">
                                  {subKey.replace(/_/g, " ")}
                                </label>
                                {renderField(
                                  subKey,
                                  subValue,
                                  depth + 1,
                                  itemId
                                    ? `${itemId}.${subKey}`
                                    : `${index}.${subKey}`
                                )}
                              </div>
                            ))}
                          </>
                        ) : (
                          renderField(
                            `${key}-${index}`,
                            item,
                            depth + 1,
                            itemId
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      );
    }

    return null;
  };

  if (setting.editable) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">{setting.desc}</h3>
        </div>
        <div className="p-6">{renderField(setting.name, formData, 0, "")}</div>
      </motion.div>
    );
  }
};

export default SettingField;
