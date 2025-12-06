"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import localeNum from "@/core/utils/locale-num";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsChart = ({ statistics }: { statistics: any }) => {
  const s = statistics || {};
  const t = useTranslations();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const labels = [
    t("home.statistics.statisticsLabels.totalOrders"),
    t("home.statistics.statisticsLabels.runningOrders"),
    t("home.statistics.statisticsLabels.followCompleted"),
    t("home.statistics.statisticsLabels.followRunning"),
    t("home.statistics.statisticsLabels.likeCompleted"),
    t("home.statistics.statisticsLabels.likeRunning"),
    t("home.statistics.statisticsLabels.commentCompleted"),
    t("home.statistics.statisticsLabels.commentRunning"),
    t("home.statistics.statisticsLabels.todayOrders"),
    t("home.statistics.statisticsLabels.todayFollowOrders"),
    t("home.statistics.statisticsLabels.todayLikeOrders"),
    t("home.statistics.statisticsLabels.todayCommentOrders"),
    t("home.statistics.statisticsLabels.totalUsers"),
    t("home.statistics.statisticsLabels.newUsersToday"),
    t("home.statistics.statisticsLabels.totalAccounts"),
    t("home.statistics.statisticsLabels.newAccountsToday"),
  ];

  const rawValues = [
    s.ordersAll || 0,
    s.ordersIsRun || 0,
    s.ordersFollowCompleted || 0,
    s.ordersFollowRun || 0,
    s.ordersLikeCompleted || 0,
    s.ordersLikeRun || 0,
    s.ordersCommentCompleted || 0,
    s.ordersCommentRun || 0,
    s.ordersTodayAll || 0,
    s.ordersTodayFollow || 0,
    s.ordersTodayLike || 0,
    s.ordersTodayComment || 0,
    s.users || 0,
    s.usersTodayJoin || 0,
    s.accounts || 0,
    s.accountsTodayAdd || 0,
  ];

  const values = rawValues.map((v) => (v === 0 ? 0.3 : v));

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "#4e8aff",
        borderRadius: 8,
        barThickness: isMobile ? 24 : 32,
        maxBarThickness: 40,
        minBarLength: 4,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: isMobile ? "y" : "x",
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true,
        textDirection: "rtl",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, family: "var(--font-estedad)" },
        bodyFont: { size: 13, family: "var(--font-estedad)" },
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const rawValue = rawValues[context.dataIndex];
            return `${t("common.amount")}: ${localeNum(rawValue)}`;
          },
        },
      },
    },

    scales: isMobile
      ? {
          // ----------- موبایل → افقی → محور Y لیبل های ما هستند
          y: {
            type: "category",
            labels: labels,
            grid: { display: false },
            ticks: {
              autoSkip: false,
              font: { size: 11.5, family: "var(--font-estedad)" },
              padding: 10,
              callback: (_, index) => {
                const label = labels[index];
                return label.length > 18
                  ? label.substring(0, 16) + "..."
                  : label;
              },
            },
          },

          x: {
            beginAtZero: true,
            grid: { color: "#f3f4f6" },
            ticks: {
              font: { size: 12, family: "var(--font-estedad)" },
              callback: (value) => localeNum(Number(value)),
            },
          },
        }
      : {
          // ----------- دسکتاپ → عمودی → محور X لیبل های ما هستند
          x: {
            type: "category",
            labels: labels,
            grid: { display: true, color: "#f3f4f6" },
            ticks: {
              autoSkip: false,
              font: { size: 12, family: "var(--font-estedad)" },
              callback: (_, index) => labels[index],
            },
          },

          y: {
            beginAtZero: true,
            grid: { color: "#f3f4f6" },
            ticks: {
              font: { size: 12, family: "var(--font-estedad)" },
              callback: (value) => localeNum(Number(value)),
            },
          },
        },

    hover: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-5 md:p-6 font-estedad">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 text-right">
        {t("home.statistics.title")}
      </h3>

      <div
        className="w-full"
        style={{
          height: isMobile ? "680px" : "500px",
          position: "relative",
        }}
      >
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default StatisticsChart;
