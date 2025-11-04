import { useEffect, useState } from "react";

export type OverlayTemplate = "classic" | "purple" | "gold";

export type LocalSettings = {
  bannerTitle: string; // عنوان بداية الشريط
  currency: "USD"; // مثبت على الدولار
  template: OverlayTemplate; // القالب المختار
};

const STORAGE_KEY = "bbp:local-settings";

const defaultSettings: LocalSettings = {
  bannerTitle: "داعمي القناة شهر 11",
  currency: "USD",
  template: "classic",
};

export function useLocalSettings() {
  const [settings, setSettings] = useState<LocalSettings>(defaultSettings);

  // تحميل من LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<LocalSettings>;
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (e) {
      console.warn("Failed to parse local settings, using defaults", e);
    }
  }, []);

  // حفظ إلى LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save local settings", e);
    }
  }, [settings]);

  const updateSettings = (patch: Partial<LocalSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  return { settings, updateSettings };
}

export function formatUSD(amount: number) {
  if (isNaN(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
