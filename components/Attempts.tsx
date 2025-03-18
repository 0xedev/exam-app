import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import tw from "../tailwind"; // Import Tailwind for React Native

interface Attempts {
  attempts: string; // String like '8/8'
  total_score: number;
}

export default function Attempts({ item }: { item: Attempts }) {
  const { attempts, total_score } = item; // Destructure directly from the item

  return (
    <View style={tw`flex flex-row items-center justify-between bg-white w-full rounded-xl shadow-sm shadow-white p-4 mb-3`}>
      <View style={tw`flex flex-row items-center`}>
        <FontAwesome5
          name="star"
          size={24}
          color="#d97706"
          style={tw`mr-3`}
        />
      </View>

      <Text style={tw`font-bold text-gray-500 text-lg`}>{attempts}</Text>
      <View style={tw`bg-orange-500 px-4 py-3 rounded-full`}>
        <Text style={tw`font-bold text-white text-lg`}>{total_score}</Text>
      </View>
    </View>
  );
}
