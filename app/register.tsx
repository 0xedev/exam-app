import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import tw from "../tailwind"; // Import twrnc for styling
import { supabase } from "../lib/supabase";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState<string>(""); // State for the first name
  const [lastName, setLastName] = useState<string>(""); // State for the last name
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  // Helper function to validate email
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

// Helper function to validate password
const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;
  return regex.test(password);
};


  // Function to check if the email is already in use
  const checkEmailExistence = async (email: string) => {
    const { data, error } = await supabase
      .from('users') // Check in the 'users' table (assuming you have this table, else you can skip this)
      .select('*')
      .eq('email', email)
      .single(); // Ensure only one record is returned

    if (data) {
      return true; // Email already exists
    }
    return false; // Email does not exist
  };

  const handleRegister = async () => {
    setErrorMessage(null); // Reset the error message before new validation

    // Check if all fields are filled
    if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
      setErrorMessage("Please fill in all fields (First Name, Last Name, Email, and Password).");
      setTimeout(() => setErrorMessage(null), 4000); // Clear error after 4 seconds
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      setTimeout(() => setErrorMessage(null), 4000); // Clear error after 4 seconds
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setErrorMessage(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and be at least 8 characters long"
      );
      setTimeout(() => setErrorMessage(null), 4000); // Clear error after 4 seconds
      return;
    }

    // Check if email already exists
    const emailExists = await checkEmailExistence(email);
    if (emailExists) {
      setErrorMessage("This email is already in use. Please use a different email.");
      setTimeout(() => setErrorMessage(null), 4000); // Clear error after 4 seconds
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    setLoading(false);

    // Handle errors from sign-up
    if (error) {
      setErrorMessage(error.message); // If error, set error message
      setTimeout(() => setErrorMessage(null), 4000); // Clear error after 4 seconds
      console.error("Error signing up:", error.message); // Log error message
      return;
    }

    const user = data?.user;
    console.log("User object after sign-up:", user); // Log the user object after sign-up

    // If no session, we can't update user metadata (session is null until email confirmation)
    if (!user) {
      setErrorMessage("Something went wrong during registration.");
      setTimeout(() => setErrorMessage(null), 4000); // Clear error after 4 seconds
      return;
    }

    setSuccessMessage(
      "Registration successful! Please check your email for a confirmation link."
    );
    console.log("User registered:", user); // Log the user object if registration is successful

    setTimeout(() => {
      setSuccessMessage(null); // Clear success message after 4 seconds
      router.replace("/"); // Redirect to the home page or login screen
    }, 4000);
  };

  return (
    <View style={tw`flex-1 bg-gray-900 justify-center p-4`}>
      <View style={tw`w-full`}>
        <Text style={tw`text-3xl mb-4 font-bold text-white text-center`}>
          Register
        </Text>

        <Text style={tw`text-lg text-gray-300`}>First Name</Text>
        <TextInput
          style={tw`w-full border-b border-gray-600 py-3 text-white font-bold`}
          value={firstName}
          placeholder="Enter your first name"
          placeholderTextColor="#888"
          onChangeText={setFirstName}
        />

        <Text style={tw`text-lg text-gray-300 mt-4`}>Last Name</Text>
        <TextInput
          style={tw`w-full border-b border-gray-600 py-3 text-white font-bold`}
          value={lastName}
          placeholder="Enter your last name"
          placeholderTextColor="#888"
          onChangeText={setLastName}
        />

        <Text style={tw`text-lg text-gray-300 mt-4`}>Email Address</Text>
        <TextInput
          style={tw`w-full border-b border-gray-600 py-3 text-white font-bold`}
          value={email}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          onChangeText={setEmail}
        />

        <Text style={tw`text-lg text-gray-300 mt-4`}>Password</Text>
        <TextInput
          style={tw`w-full border-b border-gray-600 py-3 text-white font-bold`}
          secureTextEntry
          value={password}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          onChangeText={setPassword}
        />

        {/* Show error message if validation fails */}
        {errorMessage && (
          <Text style={tw`text-red-400 text-center mt-4 font-bold`}>
            {errorMessage}
          </Text>
        )}

        {/* Show success message after successful registration */}
        {successMessage && (
          <Text style={tw`text-green-400 text-center mt-4 font-bold`}>
            {successMessage}
          </Text>
        )}

        <Pressable
          style={tw`w-full ${loading ? "bg-orange-400" : "bg-orange-600"} rounded-xl p-4 mt-6 border border-orange-400`}
          disabled={loading}
          onPress={handleRegister}
        >
          <Text style={tw`text-white text-center font-bold text-xl`}>
            {loading ? "Registering..." : "Sign up"}
          </Text>
        </Pressable>

        <Text style={tw`text-center mt-4 text-gray-400`}>
          Already have an account?{" "}
          <Link href="/">
            <Text style={tw`text-orange-400 font-bold`}>Log in</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
}
