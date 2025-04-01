// LeaderboardScreen.tsx
import { useEffect, useState } from "react";
import { SafeAreaView, FlatList, ActivityIndicator, Text, View } from "react-native";
import { getLeaderBoard } from "../../lib/util"; // Function to fetch leaderboard
import tw from "../../tailwind"; // Tailwind for styling
import Board from "../../components/Board"; // Your Board component
import { useAuth } from "../../lib/AuthProvider"; 

interface LeaderboardEntry {
  user_id: string;
  first_name: string;  // Added first name
  last_name: string;   // Added last name
  total_score: number;
  attempts: string;
}


export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      const leaders = await getLeaderBoard();  // Fetch leaderboard from API or database
      setLeaderboard(leaders);  // Update state with fetched leaderboard
      setLoading(false);  // Set loading to false once data is fetched
    };
    fetchLeaders();
  }, []);

	const { session } = useAuth();


	const firstName = session?.user.user_metadata.first_name;
  const lastName = session?.user.user_metadata.last_name;

	

  return (
    <SafeAreaView style={tw`flex-1 bg-orange-100 p-4`}>
      <Text style={tw`text-2xl font-bold text-gray-500 text-center mb-6`}>
        Leaderboard
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ea580c" />
      ) : leaderboard.length > 0 ? (
       <FlatList
  data={leaderboard}
  renderItem={({ item, index }) => <Board item={item} index={index} />}
  keyExtractor={(item, index) => item.user_id + '-' + index} // Combine user_id with index
  showsVerticalScrollIndicator={false}
/>
      ) : (
        <View style={tw`mt-4`}>
          <Text style={tw`text-center text-gray-500`}>No scores available</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
