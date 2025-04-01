import { Pressable, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Question } from "../../lib/util";
import { useEffect, useState } from "react";
import tw from '../../tailwind';
import { supabase } from "../../lib/supabase";

export default function TestScreen() {
  const [count, setCount] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [time, setTime] = useState<number>(15);
  const [userScore, setUserScore] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [getResultClicked, setGetResultClicked] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false); // Track if saving is in progress

  const router = useRouter();
  const params = useLocalSearchParams();

  // Initialize questions from params
  useEffect(() => {
    if (params.questions) {
      try {
        const parsedQuestions = JSON.parse(params.questions as string);
        setQuestions(parsedQuestions);
        console.log("Loaded questions:", parsedQuestions); // Debug log
      } catch (error) {
        console.error("Error parsing questions:", error);
        Alert.alert(
          "Error",
          "Failed to load questions. Please try again.",
          [
            { 
              text: "OK", 
              onPress: () => router.back() 
            }
          ]
        );
      }
    }
  }, [params.questions]);

  const toggleColor = (index: number | null) => {
    if (index === null) return;
    setSelectedBox(index);
    setUserAnswer(questions[count].options[index]);
    console.log("User selected option index:", index);
    console.log("User selected answer:", questions[count].options[index]);
  };

  const handleSave = async () => {
    console.log("Handling save...");
    if (count < questions.length - 1) {
      if (questions[count].answer === userAnswer) {
        setUserScore((userScore) => userScore + 1);
        console.log("User answer is correct, current score:", userScore + 1);
      }
      setCount((count) => count + 1);
      setSelectedBox(null);
      setTime(15);
      setUserAnswer(""); // Clear user answer for next question
      console.log("Moving to next question, current question index:", count + 1);
    } else {
      setGetResultClicked(true);
      console.log("Final question reached. Saving result...");

      // Get the current authenticated user using getUser()
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        Alert.alert("Error", "Failed to fetch user information.");
        return;
      }

      const userId = userData?.user?.id ?? 'anonymous'; // Fallback to 'anonymous' if no user is logged in
      console.log("User ID:", userId);

      // Now you can use the userId to store the score
      try {
        const { data, error } = await supabase
          .from('ScoreSheet')  // Replace with your actual table name
          .insert([{
            user_id: userId,  // Use authenticated user's ID
            total_score: userScore,  // Store the user's score
            attempts: `${count + 1}/${questions.length}`,  // Optionally, store the number of attempts made
            created_at: new Date().toISOString(),  // Store the current timestamp
          }]);

        if (error) {
          throw error;
        }

        console.log('Score saved to Supabase:', data);

        // Navigate to the result page with the score
        router.push({
          pathname: '/(stack)/completed',
          params: { score: userScore },
        });

      } catch (error) {
        console.error('Error saving score to Supabase:', error);
        Alert.alert('Error', 'Failed to save your score. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
        console.log("Timer tick, current time:", time); // Log the current time
      }, 1000);

      return () => clearInterval(timerId);
    } else if (time === 0) {
      handleSave();
      console.log("Time is up, automatically saving score...");
    }
  }, [time]);

  const handleSkip = () => {
    console.log("Skipping current question...");
    if (count < questions.length - 1) {
      setCount((count) => count + 1);
      setSelectedBox(null);
      setTime(15);
      setUserAnswer(""); // Clear user answer when skipping
      console.log("Skipped to next question, current question index:", count + 1);
    }
  };

  // Show loading state if questions aren't loaded yet
  if (questions.length === 0) {
    console.log("Questions not loaded yet...");
    return (
      <View style={tw`flex-1 bg-orange-100 p-4 justify-center items-center`}>
        <Text style={tw`text-xl text-orange-500`}>Loading questions...</Text>
      </View>
    );
  }

  console.log("Rendering question screen, current question:", questions[count]);

  return (
    <View style={tw`flex-1 bg-orange-100 p-4`}>
      <SafeAreaView>
        <View style={tw`w-full flex items-center flex-row justify-between mb-6`}>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="cancel" size={44} color="#f97316" />
          </Pressable>
          <View style={tw`flex items-center`}>
            <Text style={tw`font-bold text-orange-500 text-lg`}>
              {questions[count]?.category}
            </Text>
            <Text style={tw`text-gray-500 text-lg`}>{count + 1}/{questions.length}</Text>
          </View>

          <View style={tw`flex items-center`}>
            <AntDesign
              name="clockcircle"
              size={24}
              color="#f97316"
              style={tw`mb-[1px]`}
            />
            <Text style={tw`font-bold text-xl`}>
              {time < 10 ? `0${time}` : time}
            </Text>
          </View>
        </View>

        <View style={tw`w-full bg-orange-500 py-4 h-[200px] rounded-2xl flex items-center justify-center px-2 mb-8`}>
          <Text style={tw`text-2xl text-center font-bold text-white`}>
            {questions[count]?.question}
          </Text>
        </View>

        <Text style={tw`text-lg mb-3 text-orange-600 font-bold`}>
          Select your answer
        </Text>
        
        <View style={tw`flex items-center mb-4`}>
          {questions[count]?.options.map((item, index) => (
            <Pressable
              style={[
                tw`w-full py-6 px-4 rounded-2xl mb-3`,
                selectedBox === index
                  ? tw`bg-orange-200 border-[1px] border-orange-500`
                  : tw`bg-white`
              ]}
              key={index}
              onPress={() => toggleColor(index)}
            >
              <Text style={tw`text-xl text-center`}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {getResultClicked ? (
          <View style={tw`flex flex-row items-center justify-center`}>
            <Pressable
              disabled={getResultClicked}
              style={tw`bg-gray-300 shadow-sm p-4 rounded-xl w-2/3`}
            >
              <Text style={tw`font-bold text-xl text-center`}>
                Generating your score...
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={tw`flex flex-row items-center justify-between`}>
            <Pressable
              onPress={handleSkip}
              style={tw`bg-orange-300 p-4 rounded-xl w-1/3`}
            >
              <Text style={tw`font-bold text-xl text-center`}>SKIP</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={tw`bg-green-300 p-4 rounded-xl w-1/3`}
            >
              <Text style={tw`font-bold text-xl text-center`}>
                {count === questions.length - 1 ? "Get Result" : "SAVE"}
              </Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
