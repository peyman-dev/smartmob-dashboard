import { createTranslator } from "next-intl";
import { useLocalization } from "../stores/localization.store";
import fa from "@/core/messages/fa.json";
import en from "@/core/messages/en.json";

const locale = useLocalization.getState().locale;

const messages = {fa,en}

const translator = createTranslator({
  locale,
  messages: messages[locale]
});

export const routes = [
  {
    id: crypto.randomUUID(),
    label: translator("pages.home"),
    path: "/",
  },
  {
    id: crypto.randomUUID(),
    label:translator("pages.orders"),
    path: "/orders",
  },
  {
    id: crypto.randomUUID(),
    label: translator("pages.users"),
    path: "/users",
  },
  {
    id: crypto.randomUUID(),
    label: translator("pages.transfers"),
    path: "/transfers",
  },
  {
    id: crypto.randomUUID(),
    label: translator("pages.accounts"),
    path: "/accounts",
  },
  {
    id: crypto.randomUUID(),
    label: translator("pages.settings"),
    path: "/settings",
  },
];
