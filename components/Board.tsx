import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import tw from "../tailwind"; // Import Tailwind for React Native

interface LeaderboardEntry {
  user_id: string;
  first_name: string;  // Include first name
  last_name: string;   // Include last name
  total_score: number;
}


const getTrophyColor = (index: number) => {
	if (index === 0) return "#FFD700"; // Gold 🥇
	if (index === 1) return "#C0C0C0"; // Silver 🥈
	if (index === 2) return "#CD7F32"; // Bronze 🥉
	return "#d97706"; // Default color
};

export default function Board({ item, index }: { item: LeaderboardEntry; index: number }) {
  return (
    <View style={tw`flex flex-row items-center justify-between bg-white w-full rounded-xl shadow-sm mb-3 p-5`}>
      <View style={tw`flex flex-row items-center`}>
        <FontAwesome5 name="trophy" size={24} color={getTrophyColor(index)} style={tw`mr-3`} />
        <Text style={tw`font-bold text-gray-500 text-lg`}>{index + 1}.</Text>
      </View>

      {/* Display Full Name */}
      <Text style={tw`font-bold text-gray-500 text-lg`}>
        {item.first_name} {item.last_name}
      </Text>

      <View style={tw`bg-orange-500 px-4 py-3 rounded-full`}>
        <Text style={tw`font-bold text-white text-lg`}>{item.total_score}</Text>
      </View>
    </View>
  );
}

