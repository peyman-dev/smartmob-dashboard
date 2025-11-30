import axios from "axios";
import { toast } from "sonner";

export const sendRequest = axios.create({
    baseURL: "https://api.rivafollower.com/base",
    headers: {
        version: 999999,
    },
});

sendRequest.interceptors.request.use(
    (config) => {
        console.log("درخواست ارسال شد ➜", {
            url: config?.baseURL as string + config?.url,
            method: config.method?.toUpperCase(),
            data: config.data,
            params: config.params,
        });
        return config;
    },
    (error) => {
        console.error("خطا در تنظیمات درخواست ❌", error);
        return Promise.reject(error);
    }
);

sendRequest.interceptors.response.use(
    (response) => {
        console.log("پاسخ موفق ✅", {
            status: response.status,
            url: response.config.url,
            data: response.data,
        });
        return response; 
    },
    (error) => {
        const { config, response, request } = error;

        if (response) {
            if (response.status == 400) {
                return toast.error('عملیات ناموفق بود !',{
                    description: response.data.data
                })
            }
            console.error("خطای پاسخ سرور ❌", {
                url: config?.url,
                method: config?.method?.toUpperCase(),
                status: response.status,
                statusText: response.statusText,
                data: response.data,
            });
        } else if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
            console.error("تایم‌اوت درخواست ⏱", config?.url);
        } else if (!response && request) {
            console.error("مشکل شبکه یا سرور در دسترس نیست 🌐", error.message);
        } else {
            console.error("خطای ناشناخته ⚠️", error);
        }

        return Promise.reject(error);
    }
);