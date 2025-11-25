export const locateImagePath = (fileName: string) =>
  `/assets/static/images/${fileName}`;
export const localeDate = (
  timestamp: number,
  locale: "fa" | "en" = "fa"
) => {
  const date = new Date(timestamp * 1000);

  const locales = {
    fa: "fa-IR",
    en: "en-US",
  };

  return new Intl.DateTimeFormat(locales[locale], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  
  }).format(date);
};

export const statuses = [
  {
    index: 0,
    value: "PENDING",
    label: "در دست انجام",
  },
  {
    index: 1,
    value: "COMPLETED",
    label: "تکمیل شده",
  },
  {
    index: 2,
    value: "INPROGRESS",
    label: "درحال انجام",
  },
  {
    index: 3,
    value: "CANCELED",
    label: "انصراف داده شده",
  },
  {
    index: 4,
    value: "PARTIAL",
    label: "جزئی",
  },
];

export const findActiveStatus = (statusIndex: number) =>
  statuses.find((stat) => stat.index == statusIndex);
