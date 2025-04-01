import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import { useAuth } from "../../lib/AuthProvider";
import { getUserAttempts, returnFirstSixWords } from "../../lib/util";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import Attempts from "../../components/Attempts";
import tw from "../../tailwind"; // Import Tailwind for React Native
import { useRouter } from "expo-router"; // Import useRouter from expo-router

export default function ProfileScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [total_score, setTotalScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<{ attempts: string; total_score: number }[]>([]);

  const { session } = useAuth();
  const router = useRouter(); // Declare the router object

  // Function to handle sign-out
  const handleSignOut = async () => {
    setLoading(true);
    console.log("Attempting to sign out...");
    try {
      const { error } = await supabase.auth.signOut();
      setLoading(false);
      console.log("Signed out successfully");
      if (error) {
        console.log("Error signing out:", error);
        throw error;
      }

      // Navigate to the Home screen after sign out
      router.push("/register"); // Navigates to the root (Home) screen, adjust path if necessary
    } catch (error) {
      console.log("Sign out error:", error);
    }
  };

  

  console.log("Session User ID:", session?.user.id);

  useEffect(() => {
    async function getAttempts() {
      if (!session?.user.id) {
        console.log("No user ID available. Skipping data fetch.");
        setDataLoading(false);  // Stop loading if no session
        return;
      }
  
      console.log("Fetching attempts for user ID:", session?.user.id);
      const result = await getUserAttempts(session?.user.id);
  
      console.log("Fetched user attempts:", result);
  
      // Now set attempts as an array of objects
      setAttempts(result?.map((attempt) => ({
        attempts: attempt.attempts,  // "8/8"
        total_score: attempt.total_score,  // score
      })) || []);
      setTotalScore(result?.reduce((total, current) => total + current.total_score, 0) || 0);
      setDataLoading(false);
    }
  
    getAttempts();
  }, [session]);
  
  console.log("User ID to query:", session?.user.id);

  // Access the first and last name from the session
  const firstName = session?.user.user_metadata.first_name;
  const lastName = session?.user.user_metadata.last_name;

  // Return the Profile Screen JSX
  return (
    <SafeAreaView style={tw`flex-1 bg-orange-100 p-4`}>
      <View style={tw`flex items-center justify-center mb-6`}>
        <View style={tw`rounded-full w-[120px] h-[120px] flex items-center justify-center bg-[#fdba74] my-4`}>
          <SvgUri
            width='80'
            height='80'
            uri={`https://api.dicebear.com/7.x/notionists/svg?backgroundColor=fdba74&seed=${
              session?.user.email || "user"
            }`}
          />
        </View>
        <Text style={tw`text-gray-600 mb-[1px]`}>
          <FontAwesome name='star' size={20} color='red' />
          <Text>{total_score}</Text> {/* Display total score */}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          {firstName} {lastName} {/* Display the full name */}
        </Text>
        <Text style={tw`text-gray-600 mb-2`}>
          @{returnFirstSixWords(session?.user.email) || "user"} {/* Display username */}
        </Text>
        <Pressable onPress={() => handleSignOut()} disabled={loading}>
          <Text style={tw`text-red-500`}>
            {loading ? "Logging out..." : "Log out"} {/* Log out button */}
          </Text>
        </Pressable>
      </View>

      <Text style={tw`font-bold text-xl text-gray-700 mb-3 px-4`}>
        Recent Attempts
      </Text>
      {dataLoading ? (
  <ActivityIndicator size='large' color='#ea580c' /> // Show loading spinner until data is fetched
) : (
  <FlatList
    data={attempts} // This is an array of objects now
    contentContainerStyle={tw`p-4`}
    renderItem={({ item }) => <Attempts item={item} />} // Each item is an object with 'attempts' and 'total_score'
    keyExtractor={(item, index) => index.toString()}
    showsVerticalScrollIndicator={false}
  />
)}

    </SafeAreaView>
  );
}

