import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

// Types for questions and answers
export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: string;
}

// Category structure
export interface Category {
  id: string;
  topic: string;
  url: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "principles and practices of large-scale programming", // lowercase id
    topic: "Principles and Practices of Large-Scale Programming",
    url: "https://raw.githubusercontent.com/dha-stix/trivia-app/main/questions/css.json",
    icon: "css3-alt",
  },
  {
    id: "information security management", // lowercase id
    topic: "Information Security Management",
    url: "https://raw.githubusercontent.com/dha-stix/trivia-app/main/questions/security.json",
    icon: "shield-alt",
  },
  {
    id: "mobile computing", // lowercase id
    topic: "Mobile Computing",
    url: "https://raw.githubusercontent.com/dha-stix/trivia-app/main/questions/mobile.json",
    icon: "mobile-alt",
  },
  {
    id: "internet of things (iot)", // lowercase id
    topic: "Internet of Things (IoT)",
    url: "https://raw.githubusercontent.com/dha-stix/trivia-app/main/questions/iot.json",
    icon: "globe",
  },
  {
    id: "real-time and control systems", // lowercase id
    topic: "Real-time and Control Systems",
    url: "https://raw.githubusercontent.com/dha-stix/trivia-app/main/questions/real-time.json",
    icon: "clock",
  },
  {
    id: "responsible computing", // lowercase id
    topic: "Responsible Computing",
    url: "https://raw.githubusercontent.com/dha-stix/trivia-app/main/questions/ethics.json",
    icon: "hand-holding-heart",
  },
  {
    id: "software architecture", // lowercase id
    topic: "Software Architecture",
    url: "https://raw.githubusercontent.com/dha-stix/trivia-app/main/questions/architecture.json",
    icon: "layer-group",
  },
];

export const returnFirstSixWords = (str: string | undefined): string => {
  if (!str) return "User";
  return str.slice(0, 6);
};

const getCurrentDate = (): string => {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();

  return `${day}-${month}-${year}`;
};

export const getGreeting = (): { greeting: string; day: boolean } => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return { greeting: "Good morning ", day: true };
  } else if (currentHour >= 12 && currentHour < 17) {
    return { greeting: "Good afternoon ", day: true };
  } else if (currentHour >= 17 && currentHour < 21) {
    return { greeting: "Good evening ", day: true };
  } else {
    return { greeting: "Good night ", day: false };
  }
};

// Multi-choice questions
const mockQuestions: Question[] = [
  // Principles and Practices of Large-Scale Programming
  {
    id: 1,
    category: "Principles and Practices of Large-Scale Programming",
    question:
      "What are the key characteristics of large-scale software development?",
    options: [
      "Small team collaboration",
      "Scalability and maintainability",
      "Short development cycles",
      "Minimal documentation",
    ],
    answer: "Scalability and maintainability",
  },
  {
    id: 2,
    category: "Principles and Practices of Large-Scale Programming",
    question:
      "What is the role of version control systems in large-scale programming?",
    options: [
      "Tracking code changes",
      "Improving execution speed",
      "Reducing memory usage",
      "Optimizing CPU performance",
    ],
    answer: "Tracking code changes",
  },
  {
    id: 3,
    category: "Principles and Practices of Large-Scale Programming",
    question: "What is a common challenge in large-scale software development?",
    options: [
      "Managing large codebases",
      "Building small applications",
      "Easy team coordination",
      "No requirement for testing",
    ],
    answer: "Managing large codebases",
  },
  {
    id: 4,
    category: "Principles and Practices of Large-Scale Programming",
    question:
      "Which of the following is essential for managing large-scale projects?",
    options: [
      "Strong project management and documentation",
      "Single developer managing all code",
      "Minimal testing",
      "One-stage development",
    ],
    answer: "Strong project management and documentation",
  },

  // Mobile Computing
  {
    id: 5,
    category: "Mobile Computing",
    question:
      "What are the fundamental components of a mobile computing system?",
    options: [
      "User interface, hardware, and software",
      "Database only",
      "Battery and storage only",
      "Cloud servers",
    ],
    answer: "User interface, hardware, and software",
  },
  {
    id: 6,
    category: "Mobile Computing",
    question: "How does 5G improve mobile computing experiences?",
    options: [
      "Increases latency",
      "Reduces bandwidth",
      "Improves speed and reliability",
      "Slows down data transfer",
    ],
    answer: "Improves speed and reliability",
  },
  {
    id: 7,
    category: "Mobile Computing",
    question:
      "Which of the following is a key advantage of mobile cloud computing?",
    options: [
      "Access to resources from anywhere",
      "Limited access to resources",
      "Faster mobile hardware",
      "No need for internet connection",
    ],
    answer: "Access to resources from anywhere",
  },
  {
    id: 8,
    category: "Mobile Computing",
    question:
      "Which technology is essential for the communication between mobile devices in IoT?",
    options: ["Wi-Fi", "Bluetooth", "5G", "All of the above"],
    answer: "All of the above",
  },

  // Information Security Management
  {
    id: 9,
    category: "Information Security Management",
    question: "What are the core principles of information security?",
    options: [
      "Confidentiality, Integrity, Availability",
      "Speed, Performance, Reliability",
      "Optimization, Accuracy, Efficiency",
      "Memory Management, Storage, Processing",
    ],
    answer: "Confidentiality, Integrity, Availability",
  },
  {
    id: 10,
    category: "Information Security Management",
    question:
      "What is the main goal of risk management in information security?",
    options: [
      "Mitigate potential security threats",
      "Increase complexity of systems",
      "Develop new software tools",
      "Reduce hardware cost",
    ],
    answer: "Mitigate potential security threats",
  },
  {
    id: 11,
    category: "Information Security Management",
    question: "What is encryption used for in information security?",
    options: [
      "Securing data during transmission",
      "Speeding up network connections",
      "Improving storage capacity",
      "Reducing costs in hardware",
    ],
    answer: "Securing data during transmission",
  },
  {
    id: 12,
    category: "Information Security Management",
    question:
      "Which of the following is an example of a security vulnerability?",
    options: [
      "Software bugs that allow unauthorized access",
      "Frequent software updates",
      "Strong password policies",
      "Automated security audits",
    ],
    answer: "Software bugs that allow unauthorized access",
  },

  // Internet of Things (IoT)
  {
    id: 13,
    category: "Internet of Things (IoT)",
    question: "What is the Internet of Things (IoT)?",
    options: [
      "A global network of connected devices",
      "A programming language",
      "A database management system",
      "A mobile application framework",
    ],
    answer: "A global network of connected devices",
  },
  {
    id: 14,
    category: "Internet of Things (IoT)",
    question: "What is a common communication protocol used in IoT?",
    options: ["MQTT", "HTTP", "FTP", "SMTP"],
    answer: "MQTT",
  },
  {
    id: 15,
    category: "Internet of Things (IoT)",
    question:
      "What is the primary challenge of implementing IoT in industries?",
    options: [
      "Interoperability of devices",
      "Too much storage space",
      "Too little data generation",
      "Easy user access",
    ],
    answer: "Interoperability of devices",
  },
  {
    id: 16,
    category: "Internet of Things (IoT)",
    question: "Which of the following is an example of an IoT application?",
    options: [
      "Smart thermostats",
      "Self-driving cars",
      "Wearable fitness trackers",
      "All of the above",
    ],
    answer: "All of the above",
  },

  // Real-time and Control Systems
  {
    id: 17,
    category: "Real-time and Control Systems",
    question: "What defines a real-time system?",
    options: [
      "A system that responds to inputs within a guaranteed time",
      "A system that operates only in batch mode",
      "A system with no time constraints",
      "A system that focuses only on storage management",
    ],
    answer: "A system that responds to inputs within a guaranteed time",
  },
  {
    id: 18,
    category: "Real-time and Control Systems",
    question: "What is an example of a real-time operating system?",
    options: ["RTOS", "Windows 10", "macOS", "Linux"],
    answer: "RTOS",
  },
  {
    id: 19,
    category: "Real-time and Control Systems",
    question: "Which of the following is crucial in real-time systems?",
    options: [
      "Timeliness and predictability",
      "Maximum performance",
      "Unlimited resources",
      "No need for hardware interactions",
    ],
    answer: "Timeliness and predictability",
  },
  {
    id: 20,
    category: "Real-time and Control Systems",
    question: "What is an example of a control system in engineering?",
    options: [
      "Temperature regulation system",
      "GPS system",
      "Voice recognition system",
      "All of the above",
    ],
    answer: "Temperature regulation system",
  },

  // Responsible Computing
  {
    id: 21,
    category: "Responsible Computing",
    question: "What is responsible computing, and why is it important?",
    options: [
      "Ensuring ethical use of technology",
      "Maximizing profits",
      "Ignoring user privacy",
      "Reducing cybersecurity measures",
    ],
    answer: "Ensuring ethical use of technology",
  },
  {
    id: 22,
    category: "Responsible Computing",
    question: "What is a key component of responsible computing?",
    options: [
      "User privacy and data protection",
      "Minimizing software usage",
      "Reducing energy consumption",
      "Ignoring social consequences",
    ],
    answer: "User privacy and data protection",
  },
  {
    id: 23,
    category: "Responsible Computing",
    question: "Why is accessibility important in responsible computing?",
    options: [
      "To ensure inclusivity for all users",
      "To reduce system performance",
      "To limit technology access",
      "To make devices more expensive",
    ],
    answer: "To ensure inclusivity for all users",
  },
  {
    id: 24,
    category: "Responsible Computing",
    question:
      "Which of the following is an example of responsible computing practice?",
    options: [
      "Ensuring transparency in algorithms",
      "Focusing only on business goals",
      "Ignoring ethical implications of technology",
      "None of the above",
    ],
    answer: "Ensuring transparency in algorithms",
  },

  // Software Architecture
  {
    id: 25,
    category: "Software Architecture",
    question: "What are the key principles of software architecture?",
    options: [
      "Scalability, Modularity, Performance",
      "Only frontend development",
      "Ignoring security principles",
      "Reducing maintainability",
    ],
    answer: "Scalability, Modularity, Performance",
  },
  {
    id: 26,
    category: "Software Architecture",
    question: "What is the role of modularity in software architecture?",
    options: [
      "Breaking the system into manageable components",
      "Making the system slow",
      "Reducing maintainability",
      "Eliminating scalability",
    ],
    answer: "Breaking the system into manageable components",
  },
  {
    id: 27,
    category: "Software Architecture",
    question: "What is the importance of scalability in software architecture?",
    options: [
      "Ability to handle increased load over time",
      "Less testing required",
      "Faster hardware requirements",
      "Ignoring security",
    ],
    answer: "Ability to handle increased load over time",
  },
  {
    id: 28,
    category: "Software Architecture",
    question:
      "What is a key aspect of performance optimization in software architecture?",
    options: [
      "Efficient use of system resources",
      "Ignoring code quality",
      "Reducing security protocols",
      "Focusing only on frontend design",
    ],
    answer: "Efficient use of system resources",
  },
];

// Function to fetch questions
export const getAllQuestionsFromStorage = async (): Promise<Question[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API delay
  return mockQuestions; // Returning mock data
};

interface LeaderboardEntry {
  user_id: string;
  total_score: number;
  attempts: number;
  users: {
    user_id: string;
    first_name: string;
    last_name: string;
  } | null;
}

export const getLeaderBoard = async () => {
  const { data, error } = await supabase
    .from("ScoreSheet") // ScoreSheet table
    .select(
      "user_id, total_score, attempts, users:users!inner(user_id, first_name, last_name)"
    ) // Manual join with inner join
    .order("total_score", { ascending: false });

  if (error) {
    console.log("Error fetching leaderboard:", error);
    return [];
  }

  return (data as unknown as LeaderboardEntry[]).map((entry) => ({
    user_id: entry.user_id,
    total_score: entry.total_score,
    attempts: entry.attempts,
    first_name: entry.users?.first_name || "Unknown", // Handle missing names
    last_name: entry.users?.last_name || "",
  }));
};

export const saveScore = async ({
  userScore,
  userID,
}: {
  userScore: number;
  userID: string | undefined;
}) => {
  if (!userID) return;
  try {
    const { data, error } = await supabase
      .from("scores")
      .select()
      .eq("user_id", userID);
    if (error) throw error;

    if (error || !data.length) {
      const { data, error } = await supabase
        .from("scores")
        .insert({
          attempts: [{ score: userScore, date: getCurrentDate() }],
          total_score: userScore,
          user_id: userID,
        })
        .single();
      if (error) throw error;
    } else {
      const { data: updateData, error } = await supabase
        .from("scores")
        .update({
          attempts: [
            ...data[0].attempts,
            { score: userScore, date: getCurrentDate() },
          ],
          total_score: data[0].total_score + userScore,
        })
        .eq("user_id", userID);
      if (error) throw error;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getUserAttempts = async (userId: string) => {
  try {
    console.log("Fetching user attempts for user ID:", userId); // Log the user ID
    const { data, error } = await supabase
      .from("ScoreSheet")
      .select("attempts, total_score")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user attempts:", error);
      throw error;
    }

    console.log("Fetched user attempts data:", data); // Log fetched data
    return data || [];
  } catch (error) {
    console.error("Error fetching user attempts:", error);
    return [];
  }
};
