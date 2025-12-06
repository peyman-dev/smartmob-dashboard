"use client";

import { useState, useEffect } from "react";
import { Modal, Drawer, Button, Typography, Space, Divider } from "antd";
import {
  DownloadOutlined,
  AppleOutlined,
  WindowsOutlined,
  ShareAltOutlined,
  PlusCircleOutlined,
  MobileOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useIsMobile } from "@/core/hooks/use-is-mobile";
import { useTranslations } from "next-intl";

const { Title, Text, Paragraph } = Typography;

export default function PWAInstallModal() {
  const t = useTranslations("pwa");

  const [isOpen, setIsOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Detect Windows
    const windows = /Windows/.test(navigator.userAgent);
    setIsWindows(windows);

    // Detect standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Listen for install event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!standalone) {
        setIsOpen(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (iOS && !standalone) {
      setIsOpen(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setIsOpen(false);
    }

    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const Content = () => (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "48px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <MobileOutlined />
        </div>
        <Title level={3} style={{ marginBottom: "8px" }}>
          {t("title")}
        </Title>
        <Text type="secondary">{t("subtitle")}</Text>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* Benefits */}
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Space>
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "16px" }} />
          <Text>{t("benefits.fastAccess")}</Text>
        </Space>
        <Space>
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "16px" }} />
          <Text>{t("benefits.offline")}</Text>
        </Space>
        <Space>
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "16px" }} />
          <Text>{t("benefits.nativeExperience")}</Text>
        </Space>
        <Space>
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "16px" }} />
          <Text>{t("benefits.noStore")}</Text>
        </Space>
      </Space>

      {/* Android & Windows Install button */}
      {deferredPrompt && (
        <Button
          type="primary"
          size="large"
          block
          icon={isWindows ? <WindowsOutlined /> : <DownloadOutlined />}
          onClick={handleInstallClick}
          style={{
            height: "48px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            fontWeight: 600,
          }}
        >
          {isWindows ? t("installOnWindows") : t("installNow")}
        </Button>
      )}

      {/* iOS Manual Instructions */}
      {isIOS && (
        <div
          style={{
            background: "#f0f5ff",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #adc6ff",
          }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Space>
              <AppleOutlined style={{ fontSize: "20px", color: "#1677ff" }} />
              <Text strong style={{ color: "#1677ff" }}>
                {t("ios.title")}
              </Text>
            </Space>

            <Paragraph style={{ margin: 0 }}>
              {t("ios.step1")} <ShareAltOutlined style={{ color: "#1677ff" }} />
            </Paragraph>

            <Paragraph style={{ margin: 0 }}>
              {t("ios.step2")}{" "}
              <PlusCircleOutlined style={{ color: "#1677ff" }} />
            </Paragraph>

            <Paragraph style={{ margin: 0 }}>{t("ios.step3")}</Paragraph>
          </Space>
        </div>
      )}

      {/* Windows Instructions */}
      {isWindows && deferredPrompt && (
        <div
          style={{
            background: "#f6ffed",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #b7eb8f",
          }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Space>
              <WindowsOutlined style={{ fontSize: "20px", color: "#52c41a" }} />
              <Text strong style={{ color: "#52c41a" }}>
                {t("windows.title")}
              </Text>
            </Space>
            <Paragraph style={{ margin: 0 }}>{t("windows.message")}</Paragraph>
          </Space>
        </div>
      )}

      {/* Fallback */}
      {!deferredPrompt && !isIOS && (
        <div
          style={{
            textAlign: "center",
            padding: "16px",
            background: "#fafafa",
            borderRadius: "8px",
          }}
        >
          <Text type="secondary">{t("notSupported")}</Text>
        </div>
      )}

      {/* Close button */}
      <Button size="large" block onClick={handleClose}>
        {t("maybeLater")}
      </Button>
    </Space>
  );

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onClose={handleClose}
        placement="bottom"
        height="auto"
        className="**:font-estedad!"
      >
        <Content />
      </Drawer>
    );
  }

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={480}
      className="pwa-install-modal **:font-estedad!"
      styles={{ body: { padding: "32px 24px 24px" } }}
    >
      <Content />
    </Modal>
  );
}
