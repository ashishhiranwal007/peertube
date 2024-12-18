import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "../components/ui/typewriter-effect";
import {
  Upload,
  Edit2,
  Youtube,
  Users,
  Globe,
  Shield,
  Zap,
  FileVideo,
  CheckCircle,
  Layers,
  PenTool,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const [activeTab, setActiveTab] = useState("creators");

  const userRole = useSelector((state) => state.user.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole == "editor") {
      navigate("/editor-dashboard");
    } else if (userRole == "creator") {
      navigate("/creator-dashboard");
    }
  }, []);

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const features = {
    creators: [
      {
        icon: Upload,
        title: "Seamless Uploads",
        description:
          "Instant video uploads with smart cloud integration and compression.",
        gradient: "from-blue-500 to-purple-600",
      },
      {
        icon: Users,
        title: "Editor Collaboration",
        description:
          "Powerful matchmaking with editors tailored to your needs.",
        gradient: "from-green-500 to-teal-600",
      },
      {
        icon: Youtube,
        title: "Direct Publishing",
        description:
          "Advanced YouTube integration with smart scheduling and optimization.",
        gradient: "from-red-500 to-orange-600",
      },
    ],
    editors: [
      {
        icon: PenTool,
        title: "Advanced Editing",
        description:
          "Professional-grade editing tools with AI-powered suggestions.",
        gradient: "from-indigo-500 to-purple-600",
      },
      {
        icon: Layers,
        title: "Project Management",
        description:
          "Intuitive workflow tracking and client communication hub.",
        gradient: "from-cyan-500 to-blue-600",
      },
      {
        icon: CheckCircle,
        title: "Quality Control",
        description: "Automated quality checks and version control systems.",
        gradient: "from-emerald-500 to-green-600",
      },
    ],
  };

  const words = [
    {
      text: "Revolutionize",
    },
    {
      text: "Your",
    },
    {
      text: "Video ",
    },
    {
      text: "Production",
    },
    {
      text: "Workflow.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="bg-zinc-950 text-zinc-50 min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FileVideo className="text-zinc-300" size={32} />
            <span className="text-2xl font-bold text-zinc-100">
              CreatorSync
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Pricing
            </Button>
            <Button
              variant="default"
              className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-8 text-center">

        <TypewriterEffect words={words} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mt-5"
        >
          Streamline collaboration, editing, and publishing with our
          comprehensive video management platform.
        </motion.p>

        <div className="flex flex-col justify-center md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-8 mb-8">
          <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm" onClick={()=> navigate("login")}>
            Get Started
          </button>
          <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
            Watch Demo
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-10 bg-zinc-900 rounded-full p-2 inline-flex">
            <Button
              variant={activeTab === "creators" ? "default" : "ghost"}
              onClick={() => setActiveTab("creators")}
              className={`rounded-full mr-2 ${
                activeTab === "creators"
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              For Creators
            </Button>
            <Button
              variant={activeTab === "editors" ? "default" : "ghost"}
              onClick={() => setActiveTab("editors")}
              className={`rounded-full ${
                activeTab === "editors"
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              For Editors
            </Button>
          </div>

          <motion.div
            variants={featureVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-6"
          >
            {features[activeTab].map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 
                           transform transition-all duration-300 
                           hover:scale-105 hover:border-zinc-700 
                           group overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} 
                                 opacity-10 group-hover:opacity-20 transition-all duration-300`}
                />
                <div className="relative z-10">
                  <div className="mb-5 p-3 rounded-full bg-zinc-800 w-fit mx-auto">
                    <feature.icon
                      className="text-zinc-300 group-hover:text-white transition-colors"
                      size={40}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="bg-zinc-950 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-zinc-100">
            Platform Capabilities
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Robust Security",
                description:
                  "End-to-end encryption and secure OAuth authentication.",
              },
              {
                icon: Zap,
                title: "High Performance",
                description:
                  "Lightning-fast uploads with advanced cloud optimization.",
              },
              {
                icon: Globe,
                title: "Global Collaboration",
                description:
                  "Connect with creators and editors across the globe.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-800 rounded-2xl p-6 flex items-start space-x-4 
                           hover:bg-zinc-700 transition-colors group"
              >
                <feature.icon
                  className="text-zinc-400 group-hover:text-zinc-200 transition-colors flex-shrink-0"
                  size={40}
                />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-zinc-950 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-zinc-100">
            Transform Your Video Production
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join thousands of creators and editors who have revolutionized their
            workflow.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm" onClick={()=> navigate("login")}>
            Start Free Trial
          </button>
          <button className="w-40 h-10 rounded-xl bg-white border dark:border-white border-transparent text-black text-sm" onClick={()=> navigate("login")}>
            Learn More
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
