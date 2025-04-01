import {
  SafeAreaView,
  Text,
  Pressable,
  View,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import tw from "../../tailwind";

export default function CompletedScreen() {
  const { score } = useLocalSearchParams();
  const router = useRouter();

  // Log the score and router details
  console.log("Score:", score);
  console.log("Router:", router);

  return (
    <View style={tw`flex flex-1 bg-orange-400`}>
      <ImageBackground
        source={{ uri: "https://source.unsplash.com/NAP14GEjvh8" }}
        style={tw`flex-1 p-4`}
      >
        <SafeAreaView />
        <Pressable
          onPress={() => {
            console.log("Navigating to /tabs...");
            router.replace("/tabs/");
          }}
        >
          <MaterialIcons name="cancel" size={60} color="white" />
        </Pressable>

        <View style={tw`flex-1 flex items-center justify-center`}>
          <View
            style={tw`bg-orange-50 w-full py-[50px] rounded-xl p-4 flex items-center justify-center shadow-lg shadow-orange-500`}
          >
            <Text style={tw`text-3xl text-orange-600 font-bold mb-4`}>
              {Number(score) > 20
                ? "Congratulations🥳"
                : "Sorry! You Failed 🥲"}
            </Text>
            <Text style={tw`font-bold text-xl`}>You scored {score}!</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
