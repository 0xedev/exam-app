import { Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import type { Category } from "../lib/util";
import tw from "../tailwind"; // assuming you're using tailwind-rn for React Native

interface CategoryProps {
	item: Category;
	userCategories: string[];
	setUserCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Categories({
	item,
	userCategories,
	setUserCategories,
}: CategoryProps) {
	
	const handleCategories = (topic: string) => {
		if (userCategories.includes(topic)) {
			const newSelection = userCategories.filter((item) => item !== topic);
			setUserCategories(newSelection);
		} else {
			if (userCategories.length < 4) {
				const newSelection = [...userCategories, topic];
				setUserCategories(newSelection);
			}
		}
	};

	return (
		<Pressable
			onPress={() => handleCategories(item.topic)}
			style={tw`rounded-xl w-1/2 h-[200px] flex-1 flex-col items-center justify-center p-2 ${userCategories.includes(item.topic) ? 'bg-orange-400' : 'bg-white'}`}
		>
			<FontAwesome5
				name={item.icon}
				size={50}
				color={userCategories.includes(item.topic) ? "white" : "orange"}
				style={tw`mb-2`}
			/>
			<Text
				style={tw`text-center text-lg font-semibold ${userCategories.includes(item.topic) ? 'text-black' : 'text-gray-500'}`}
			>
				{item.topic}
			</Text>
		</Pressable>
	);
}
