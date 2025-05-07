import { atom } from "jotai";
import type { MessageType } from "../util/types";

export const messagesAtom = atom<MessageType[]>([]);
export const usernameAtom = atom<string | null>(null);
export const showUsernameModalAtom = atom((get) => !get(usernameAtom));
export const onlineAtom = atom(0);
