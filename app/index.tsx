import {
  Text,
  View,
  TextInput,
  ImageBackground,
  Pressable,
  Alert,
  ActivityIndicator
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link, useRouter, Redirect } from "expo-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthProvider";
import { useState } from "react";
import tw from "twrnc"; // Import twrnc for styling

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for storing error message
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const router = useRouter();
  const { session, loading: validating } = useAuth();

  // Helper function to validate email format
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    console.log("Login attempt started...");
    console.log("Email:", email);
    console.log("Password:", password);

    // Check if email is valid
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return; // Do not proceed if the email is invalid
    }

    setLoading(true);
    console.log("Attempting to sign in with Supabase...");
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    setLoading(false);

    if (error) {
      console.log("Error from Supabase:", error.message);
      setErrorMessage(error.message); // Set error message from Supabase
      return;
    }

    console.log("Login successful!");
    router.replace("/(tabs)/");
  };

  console.log("Session: ", session);
  if (session) {
    console.log("User is already logged in.");
    return <Redirect href="/(tabs)/" />;
  } else if (validating) {
    console.log("Validating user session...");
    return <ActivityIndicator size="large" color="#f97316" />;
  } else {
    console.log("Rendering login screen...");
    return (
      <View style={tw`flex-1 bg-black`}>
        <ImageBackground
          style={tw`flex-1 justify-center items-center`}
          source={{ uri: "https://source.unsplash.com/ODhkZUcous8" }}
        >
          <View style={tw`w-full px-4`}>
            <View style={tw`w-full flex items-center justify-center mb-4`}>
              <FontAwesome5
                name="phoenix-framework"
                size={70}
                color="white"
                style={tw`mb-4`}
              />
              <Text style={tw`text-3xl font-bold text-white text-center`}>
                Log in
              </Text>
            </View>

            <Text style={tw`text-lg text-white`}>Email Address</Text>
            <TextInput
              style={tw`w-full border-b border-white py-3 rounded-md mb-3 text-white`}
              value={email}
              onChangeText={setEmail}
            />
            <Text style={tw`text-lg text-white`}>Password</Text>
            <View style={tw`relative`}>
              <TextInput
                style={tw`w-full border-b border-white py-3 rounded-md mb-3 text-white`}
                secureTextEntry={!showPassword} // Toggle secureTextEntry based on state
                value={password}
                onChangeText={setPassword}
              />
              {/* Eye Icon to toggle password visibility */}
              <Pressable
                style={tw`absolute right-1 top-1/4 transform -translate-y-1/2`}
                onPress={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                <FontAwesome5
                  name={showPassword ? "eye-slash" : "eye"} // Change icon based on visibility state
                  size={15}
                  color="white"
                />
              </Pressable>
            </View>
            {/* Show error message if validation fails */}
            {errorMessage && (
              <Text style={tw`text-red-500 text-center mt-4 font-bold`}>
                {errorMessage}
              </Text>
            )}
            <Pressable
              style={tw`w-full ${loading ? "bg-orange-200" : "bg-orange-600"} rounded-xl p-4 border border-orange-200`}
              disabled={loading}
              onPress={handleLogin}
            >
              <Text style={tw`text-white text-center font-bold text-xl`}>
                {loading ? "Authenticating..." : "Sign in"}
              </Text>
            </Pressable>
            <Text style={tw`text-center mt-2 text-white`}>
              Don't have an account?{" "}
              <Link href="/register">
                <Text style={tw`text-white`}>Register</Text>
              </Link>
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
