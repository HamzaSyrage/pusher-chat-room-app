import { useAtomValue } from "jotai";
import { onlineAtom } from "../store/atoms";

export default function Online() {
	const online = useAtomValue(onlineAtom);
	return (
		<h1 className="bg-gray-700 text-blue-100 p-4">
			online : <span className="text-blue-200">{online}</span>
		</h1>
	);
}
