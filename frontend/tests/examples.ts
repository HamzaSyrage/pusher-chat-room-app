/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from "@tanstack/react-query";
import Pusher, { Channel } from "pusher-js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
	currentOnlineUsersAtom,
	isMeeting,
	meetingAtom,
	userDataAtom,
} from "../store/atoms";
import { nearestConferenceAtom } from "../store/NearesetConference";
import moment from "moment";
import "moment/locale/it"; // without this line it didn't work

export interface pusherMassage {
	community: string;
	Sender: {
		first_name: string;
		id: string;
		last_name: string;
		photo: string;
	};
	collection: string;
	community_id: string;
	content_type: number;
	conversation_id: number;
	created_at: string;
	id: number;
	is_owner: number;
	message: string;
	message_date: string;
	message_time: string;
	page_number: number;
	replied_to: {
		attachment_id: null;
		content_type: string;
		conversation_id: number;
		created_at: string;
		id: number;
		message: string;
		message_date: string;
		message_time: string;
		page_number: number;
		reply_to: null;
		sent_at: string;
		updated_at: string;
		user: {
			first_name: string;
			id: string;
			last_name: string;
			photo: string;
			sso_id: number;
		};
	} | null;
	reply_to: string;
	sent_at: string;
	updated_at: string;
	attachment: {
		attachmentable_id: number;
		attachmentable_type: string;
		created_at: string;
		file: string;
		id: number;
		name: string;
		size: number;
		type: string;
		updated_at: string;
		url: string;
	};
}

export const usePusherChannels = () => {
	const { id } = useParams();

	const queryClient = useQueryClient();
	const [userData] = useRecoilState(userDataAtom);
	const [newMassage, setNewMassage] = useState<pusherMassage>();
	const [newMeeting, setNewMeeting] = useState();
	const [communityOnline, setCommunityOnline] = useRecoilState(
		currentOnlineUsersAtom
	);
	const [, setShowMeetBox] = useRecoilState(isMeeting);
	const [, setNearestConference] = useRecoilState(nearestConferenceAtom);
	const [, setMeeting] = useRecoilState(meetingAtom);

	const [pastChatId, setPastChatId] = useState(id);
	let presenceChannel: Channel | undefined;
	let chatChannel: Channel | undefined;

	/* Creating a new pusher instance. */
	const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY as string, {
		cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER as string,
		forceTLS: true,
		authEndpoint: process.env.REACT_APP_PUSHER_HOST,
		auth: {
			headers: {
				Authorization: `Bearer ${userData?.plainTextToken}`,
				Accept: "application/json",
			},
		},
	});

	/* Creating a new pusher instance, subscribing to a channels and binding events. */
	const subscribePusher = () => {
		if (userData?.accessToken) {
			/* Subscribing to a channel. */
			chatChannel = pusher.subscribe(
				`private-user-${userData.accessToken.id_vendor}-${id}`
			);
			chatChannel.bind("UserMessageSent", function (data: any) {
				if (data) {
					setNewMassage(data.message);
				}
			});

			chatChannel.bind("AdminConferenceCreated", async function (data: any) {
				if (data) {
					setShowMeetBox(true);
					setNearestConference({
						label_start_date: moment(
							new Date(data.conference.start_date).setHours(
								new Date(data.conference.start_date).getHours() - 1
							)
						).format("LLLL"),
						on_air: false,
						is_enrolled: false,
						...data.conference,
					});
					await queryClient.invalidateQueries();
				}
			});

			chatChannel.bind("AdminConferenceDeleted", async function (data: any) {
				if (data.conference) {
					setShowMeetBox(true);
					setNearestConference({
						label_start_date: moment(
							new Date(data.conference.start_date).setHours(
								new Date(data.conference.start_date).getHours() - 1
							)
						).format("LLLL"),
						on_air: false,
						is_enrolled: false,
						...data.conference,
					});
					setMeeting(null);
				} else {
					setShowMeetBox(false);
					setNearestConference(undefined);
					setNewMeeting(undefined);
					setMeeting(null);
				}

				await queryClient.invalidateQueries();
			});

			chatChannel.bind("AdminMeetingStarted", function (data: any) {
				if (data) {
					setNewMeeting(data.meeting);
					setNearestConference((prev) => ({
						...(prev as any),
						on_air: true,
						is_enrolled: true,
					}));
				}
			});

			presenceChannel = pusher.subscribe(
				`presence-vendor-channel-${userData.accessToken.id_vendor}-${id}`
			);

			presenceChannel.bind(
				"pusher:subscription_succeeded",
				(members: { count: number }) => {
					setCommunityOnline(members.count);
				}
			);

			presenceChannel.bind("pusher:member_added", (data: any) => {
				setCommunityOnline((prev) => prev + 1);
			});

			presenceChannel.bind("pusher:member_removed", (data: any) => {
				setCommunityOnline((prev) => prev - 1);
			});

			// ! why commented ??!
			// ? https://pusher.com/blog/counting-live-users-at-scale-with-subscription-count-events/#how-do-you-implement-subscription-count
			// presence.bind("pusher_internal:subscription_count", (data: any) => {
			//   console.log("presence:subscription_count", data);
			//   // setcommunityOnline(presence.members.count)
			// });

			// presence.bind("pusher:member_added", (data: any) => {
			//   console.log("userEntered", data);
			//   // setcommunityOnline(presence.members.count)
			// });

			// presence.bind("pusher:member_removed", (data: any) => {
			//   console.log("userExited", data);
			//   console.log(data);

			//   // setcommunityOnline(presence.members.count)
			// });
			/* Asking the user for permission to send notifications. */
			// Notification.requestPermission()
		}
	};

	const clearNewMeeting = () => {
		setNewMeeting(undefined);
	};

	useEffect(() => {
		if (id !== pastChatId) {
			presenceChannel?.unbind_all();
			presenceChannel?.unsubscribe();
			presenceChannel?.disconnect();
			chatChannel?.unbind_all();
			chatChannel?.unsubscribe();
			chatChannel?.disconnect();
			setPastChatId(id);
			setCommunityOnline(0);
		}

		return () => {
			presenceChannel?.unbind_all();
			presenceChannel?.unsubscribe();
			presenceChannel?.disconnect();
			chatChannel?.unbind_all();
			chatChannel?.unsubscribe();
			chatChannel?.disconnect();
			setCommunityOnline(0);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return {
		newMassage,
		subscribePusher,
		newMeeting,
		clearNewMeeting,
		communityOnline,
	};
};
