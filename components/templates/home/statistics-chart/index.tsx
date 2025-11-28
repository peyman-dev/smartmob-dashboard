"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslations } from "next-intl";
import { Bar } from "react-chartjs-2";

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
  const t = useTranslations()

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
    t("home.statistics.statisticsLabels.newAccountsToday")
  ];
  

  const values = [
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

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "#4e8aff",
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        rtl: true,
        textDirection: "rtl",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        fontFamily: "--font-estedad",
        titleFont: {
          size: 13,
          fontFamily: "--font-estedad",
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          title: (context: any) => context[0].label,
          label: (context: any) => `${t("common.amount")}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
          align: "end" as const,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
          lineWidth: 1,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          padding: 8,
        },
      },
    },
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-6 **:font-estedad!">
      <h3 className="text-lg font-bold text-gray-800 mb-6 start">
        {t("home.statistics.title")}
      </h3>
      <div
        className="**:font-estedad!"
        style={{ height: "450px", position: "relative" }}
      >
        <Bar data={data} options={options} className="**:font-estedad!" />
      </div>
    </div>
  );
};

export default StatisticsChart;
