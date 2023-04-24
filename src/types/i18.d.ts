import type messages from "@/messages/de.json";

type Messages = typeof messages;

declare interface IntlMessages extends Messages {}
