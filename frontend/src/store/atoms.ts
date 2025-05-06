import { atom } from "jotai";
import type { MessageType } from "../util/types";

export const messagesAtom = atom<MessageType[]>([]);
export const usernameAtom = atom<string | "unknown">("unknown");
export const showUsernameModalAtom = atom((get) => !get(usernameAtom));
