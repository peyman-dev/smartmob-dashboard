import { useLocalization } from "../stores/localization.store";

export default function localeNum(num: number) {
  const isEN = useLocalization.getState().locale == "en";

  return Number(num).toLocaleString(isEN ? "en-US" : "fa-IR");
}
