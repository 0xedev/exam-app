import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import tw from "../../tailwind";
import {
  categories,
  getGreeting,
  getAllQuestionsFromStorage,
  Category,
  Question,
} from "../../lib/util";

export default function HomeScreen() {
  const greet = getGreeting();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userCategories, setUserCategories] = useState<string[]>([]); // Category IDs as strings
  const [showTip, setShowTip] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const REQUIRED_CATEGORIES = 1;

  useEffect(() => {
    setShowTip(userCategories.length === 0);
  }, [userCategories]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const questions = await getAllQuestionsFromStorage();
      // Match lowercase category IDs from userCategories to uppercase question categories
      const selectedQuestions = questions.filter((question) =>
        userCategories.some(
          (category) =>
            question.category.toLowerCase() === category.toLowerCase()
        )
      );
      if (selectedQuestions.length > 0) {
        router.push({
          pathname: "/(stack)/test",
          params: {
            questions: JSON.stringify(selectedQuestions),
            categories: JSON.stringify(userCategories),
          },
        });
      } else {
        alert("No questions available for the selected categories.");
      }
    } catch (error) {
      console.error("Error in fetchQuestions:", error);
      alert("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setUserCategories((prevCategories) => {
      if (prevCategories.includes(categoryId)) {
        return prevCategories.filter((id) => id !== categoryId);
      }
      if (prevCategories.length >= REQUIRED_CATEGORIES) {
        alert(`You can only select up to ${REQUIRED_CATEGORIES} categories.`);
        return prevCategories;
      }
      return [...prevCategories, categoryId];
    });
  };

  const handleStartTest = () => {
    if (userCategories.length === 0) {
      alert("Please select at least one category to start the test.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmStart = () => {
    setShowConfirm(false);
    fetchQuestions();
  };

  const cancelStart = () => {
    setShowConfirm(false);
  };

  const CategoryProgress = () => (
    <View style={tw`mb-4 px-2`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <Text style={tw`text-gray-600`}>Categories Selected</Text>
        <Text style={tw`text-orange-500 font-bold`}>
          {userCategories.length}/{REQUIRED_CATEGORIES}
        </Text>
      </View>
      <View style={tw`h-2 bg-gray-200 rounded-full overflow-hidden`}>
        <View
          style={[
            tw`h-full bg-orange-500`,
            {
              width: `${(userCategories.length / REQUIRED_CATEGORIES) * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={tw`flex-row flex-wrap gap-4`}>
      {categories.map((item: Category) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [
            tw`w-[47%] p-4 rounded-xl`,
            userCategories.includes(item.id)
              ? pressed
                ? tw`bg-orange-600`
                : tw`bg-orange-500`
              : pressed
              ? tw`bg-gray-300`
              : tw`bg-white border border-gray-200`,
          ]}
          onPress={() => handleCategorySelect(item.id)}
        >
          <Ionicons
            name={greet.day ? "partly-sunny-sharp" : "moon"}
            size={24}
            color="orange"
          />
          <Text
            style={[
              tw`mt-2 text-center font-medium`,
              userCategories.includes(item.id)
                ? tw`text-white`
                : tw`text-gray-800`,
            ]}
          >
            {item.topic}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-orange-50`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-4 py-6`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`flex-row items-center justify-between mb-6`}>
          <View>
            <Text style={tw`font-bold text-3xl text-gray-800 mb-1`}>
              {greet.greeting}
              <Ionicons
                name={greet.day ? "partly-sunny-sharp" : "moon"}
                size={28}
                color={greet.day ? "orange" : "gray"}
                style={tw`ml-2`}
              />
            </Text>
            <Text style={tw`text-lg text-gray-600`}>Ready for your quiz?</Text>
          </View>
        </View>

        <CategoryProgress />

        {showTip && (
          <View style={tw`bg-orange-100 p-4 rounded-xl mb-4`}>
            <Text style={tw`text-orange-800 text-center`}>
              Select a category to begin your test
            </Text>
          </View>
        )}

        {userCategories.length === REQUIRED_CATEGORIES && !showConfirm && (
          <Pressable
            style={({ pressed }) => [
              tw`w-full h-[60px] flex items-center justify-center rounded-xl mb-4`,
              pressed ? tw`bg-orange-600` : tw`bg-orange-500`,
              loading && tw`opacity-75`,
            ]}
            disabled={loading}
            onPress={handleStartTest}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-xl font-bold text-white`}>START TEST</Text>
            )}
          </Pressable>
        )}

        {showConfirm && (
          <View style={tw`bg-orange-100 p-4 rounded-xl mb-4`}>
            <Text style={tw`text-orange-800 text-center mb-4`}>
              You've selected {userCategories.length} categories. Ready to
              begin?
            </Text>
            <View style={tw`flex-row justify-around`}>
              <Pressable
                style={({ pressed }) => [
                  tw`p-3 rounded-xl w-1/3`,
                  pressed ? tw`bg-gray-400` : tw`bg-gray-300`,
                ]}
                onPress={cancelStart}
              >
                <Text style={tw`text-center font-bold text-gray-800`}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  tw`p-3 rounded-xl w-1/3`,
                  pressed ? tw`bg-orange-600` : tw`bg-orange-500`,
                ]}
                onPress={confirmStart}
              >
                <Text style={tw`text-center font-bold text-white`}>Start</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
          Available Categories
        </Text>

        {renderCategories()}
      </ScrollView>
    </SafeAreaView>
  );
}
