"use client";
import React, { useState, useEffect } from "react";
import { fetchGameData } from "@/lib/actions";

// Define TypeScript interface for player data
interface Player {
  full_name: string;
  team: string;
  position: string;
  conference: string;
  height: number;
  weight: number;
  age: number;
  average_points: number;
  average_assists: number;
  average_rebounds: number;
  average_steals: number;
  average_blocks: number;
  awards_count: number;
}

const GuessYourLegend = () => {
  // States for the game
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">(
    "intro"
  );
  const [conference, setConference] = useState<string | null>(null); // east, west
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [playersRemaining, setPlayersRemaining] = useState<number>(0);
  const [questionsAsked, setQuestionsAsked] = useState<number>(0);
  const [guessedPlayer, setGuessedPlayer] = useState<string>("");
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [nbaData, setNbaData] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper function to convert cm to feet and inches
  const cmToInches = (cm: number): string => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const inchesRemainder = Math.round(inches % 12);
    return `${feet}'${inchesRemainder}"`;
  };

  // Helper function to clean position
  const cleanPosition = (pos: string): string => {
    pos = String(pos).toLowerCase();
    if (pos.includes("guard") && pos.includes("forward")) {
      return "G-F";
    }
    if (
      (pos.includes("forward") && pos.includes("center")) ||
      (pos.includes("center") && pos.includes("forward"))
    ) {
      return "F-C";
    }
    if (pos.includes("forward")) {
      return "F";
    }
    if (pos.includes("center")) {
      return "C";
    }
    if (pos.includes("guard")) {
      return "G";
    }
    return "Unknown";
  };

  // Add log message
  const addLog = (message: string): void => {
    setLogMessages((prev) => [...prev, message]);
  };

  // Load NBA player data
  useEffect(() => {
    const loadGameData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGameData();

        const playersArray = Object.values(data).filter(
          (player) => typeof player === "object" && player !== null
        );

        // Add conference property based on team
        const enrichedData = playersArray.map((player: any) => {
          // Define which teams are in which conference
          const eastTeams = [
            "Celtics",
            "Knicks",
            "Nets",
            "76ers",
            "Raptors",
            "Bucks",
            "Bulls",
            "Cavaliers",
            "Pistons",
            "Pacers",
            "Hawks",
            "Heat",
            "Hornets",
            "Magic",
            "Wizards",
          ];
          const westTeams = [
            "Lakers",
            "Clippers",
            "Warriors",
            "Kings",
            "Suns",
            "Mavericks",
            "Spurs",
            "Rockets",
            "Grizzlies",
            "Pelicans",
            "Thunder",
            "Trail Blazers",
            "Timberwolves",
            "Nuggets",
            "Jazz",
          ];

          let conference;
          if (eastTeams.includes(player.team)) {
            conference = "east";
          } else if (westTeams.includes(player.team)) {
            conference = "west";
          } else {
            // If team is empty or not recognized, default to a conference
            // For this example, let's put free agents in the east
            conference = "east";
          }

          // Fix position format for consistency
          let position = player.position;
          if (position === "Center-Forward") position = "F-C";
          else if (position === "Forward-Center") position = "F-C";
          else if (position === "Guard-Forward") position = "G-F";
          else if (position === "Forward") position = "F";
          else if (position === "Guard") position = "G";
          else if (position === "Center") position = "C";
          else position = "F"; // Default to Forward if unknown

          // Ensure all numeric fields are actually numbers
          return {
            ...player,
            conference,
            position,
            height: parseFloat(player.height) || 0,
            weight: parseFloat(player.weight) || 0,
            age: parseInt(player.age) || 0,
            average_points: parseFloat(player.average_points) || 0,
            average_assists: parseFloat(player.average_assists) || 0,
            average_rebounds: parseFloat(player.average_rebounds) || 0,
            average_steals: parseFloat(player.average_steals) || 0,
            average_blocks: parseFloat(player.average_blocks) || 0,
            awards_count: parseInt(player.awards_count) || 0,
          };
        });

        setNbaData(enrichedData as Player[]);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load game data:", error);
        setIsLoading(false);
      }
    };

    loadGameData();
  }, []);

  // Main game logic
  const askNextQuestion = (currentPlayers: Player[]): void => {
    if (currentPlayers.length <= 0) {
      addLog("No players match these criteria. Something went wrong.");
      setGameState("result");
      setGuessedPlayer("Error: No matching players");
      return;
    }

    setPlayersRemaining(currentPlayers.length);

    // If we're down to 5 or fewer players, ask directly
    if (currentPlayers.length <= 5) {
      const playerNames = currentPlayers.map((p) => p.full_name).join(", ");
      setCurrentQuestion(`Is your player one of these: ${playerNames}?`);
      return;
    }

    if (currentPlayers.length === 1) {
      // We've found the player
      setGameState("result");
      setGuessedPlayer(currentPlayers[0].full_name);
      addLog(`🏀 My guess is... **${currentPlayers[0].full_name}**!`);
      return;
    }

    // Find the best column for splitting the players
    let bestColumn: string | null = null;
    let bestThreshold: any = null;
    let bestBalance = Infinity;

    // Try team-based questions
    const teams = [...new Set(currentPlayers.map((p) => p.team))];
    if (teams.length > 1) {
      for (const team of teams) {
        const teamCount = currentPlayers.filter((p) => p.team === team).length;
        const nonTeamCount = currentPlayers.length - teamCount;
        const balance = Math.abs(teamCount - nonTeamCount);

        if (balance < bestBalance) {
          bestBalance = balance;
          bestColumn = "team";
          bestThreshold = team;
        }
      }
    }

    // Handle position questions
    const positionGroups = {
      pure_guard: currentPlayers.filter((p) => p.position === "G").length,
      pure_forward: currentPlayers.filter((p) => p.position === "F").length,
      pure_center: currentPlayers.filter((p) => p.position === "C").length,
      guard_forward: currentPlayers.filter((p) => p.position === "G-F").length,
      forward_center: currentPlayers.filter((p) => p.position === "F-C").length,
    };

    for (const [posType, posCount] of Object.entries(positionGroups)) {
      const nonPosCount = currentPlayers.length - posCount;
      const balance = Math.abs(posCount - nonPosCount);

      if (balance < bestBalance && posCount > 0) {
        bestBalance = balance;
        bestColumn = "position_specific";
        bestThreshold = posType;
      }
    }

    // Try awards
    const awardCount = currentPlayers.filter((p) => p.awards_count > 0).length;
    const noAwardCount = currentPlayers.length - awardCount;
    const awardBalance = Math.abs(awardCount - noAwardCount);

    if (awardBalance < bestBalance) {
      bestBalance = awardBalance;
      bestColumn = "awards";
      bestThreshold = null;
    }

    // Try numeric columns
    const numericCols = [
      "age",
      "height",
      "weight",
      "average_points",
      "average_assists",
      "average_rebounds",
      "average_steals",
      "average_blocks",
    ] as const;

    for (const col of numericCols) {
      const values = [...new Set(currentPlayers.map((p) => p[col]))]
        .filter((val) => val !== undefined && val !== null)
        .sort((a, b) => a - b);

      if (values.length > 1) {
        for (let i = 0; i < values.length - 1; i++) {
          const threshold = (values[i] + values[i + 1]) / 2;

          const leftCount = currentPlayers.filter(
            (p) => p[col] <= threshold
          ).length;
          const rightCount = currentPlayers.length - leftCount;
          const balance = Math.abs(leftCount - rightCount);

          if (balance < bestBalance) {
            bestBalance = balance;
            bestColumn = col;
            bestThreshold = threshold;
          }
        }
      }
    }

    // Construct the question based on the best dividing attribute
    if (bestColumn === "team") {
      setCurrentQuestion(`Is your player on the ${bestThreshold}?`);
    } else if (bestColumn === "position_specific") {
      if (bestThreshold === "pure_guard") {
        setCurrentQuestion(
          "Is your player strictly a Guard (G), not a Guard-Forward hybrid?"
        );
      } else if (bestThreshold === "pure_forward") {
        setCurrentQuestion(
          "Is your player strictly a Forward (F), not a hybrid position?"
        );
      } else if (bestThreshold === "pure_center") {
        setCurrentQuestion(
          "Is your player strictly a Center (C), not a Forward-Center hybrid?"
        );
      } else if (bestThreshold === "guard_forward") {
        setCurrentQuestion("Is your player a Guard-Forward (G-F) hybrid?");
      } else if (bestThreshold === "forward_center") {
        setCurrentQuestion("Is your player a Forward-Center (F-C) hybrid?");
      }
    } else if (bestColumn === "awards") {
      setCurrentQuestion("Has your player received any awards?");
    } else if (bestColumn === "age") {
      setCurrentQuestion(
        `Is your player older than ${Math.floor(bestThreshold)} years?`
      );
    } else if (bestColumn === "height") {
      setCurrentQuestion(
        `Is your player taller than ${cmToInches(bestThreshold)}?`
      );
    } else if (bestColumn === "weight") {
      setCurrentQuestion(
        `Is your player heavier than ${Math.floor(bestThreshold)} lbs?`
      );
    } else if (
      [
        "average_points",
        "average_assists",
        "average_rebounds",
        "average_steals",
        "average_blocks",
      ].includes(bestColumn || "")
    ) {
      const statName = bestColumn?.replace("average_", "");
      setCurrentQuestion(
        `Does your player average more than ${bestThreshold.toFixed(
          1
        )} ${statName}?`
      );
    } else {
      // Fallback question with a simple split
      const halfIndex = Math.floor(currentPlayers.length / 2);
      const firstHalf = currentPlayers.slice(0, halfIndex);
      const playerNames = firstHalf.map((p) => p.full_name).join(", ");
      setCurrentQuestion(`Is your player one of these: ${playerNames}?`);
    }
  };

  // Handle user's answer
  // Define a state variable to keep track of the current filtered players
  const [currentFilteredPlayers, setCurrentFilteredPlayers] = useState<
    Player[]
  >([]);

  // Update the selectConference function to initialize the filtered players
  const selectConference = (conf: string): void => {
    setConference(conf.toLowerCase());
    setGameState("playing");
    const filteredPlayers = nbaData.filter(
      (p) => p.conference === conf.toLowerCase()
    );
    setCurrentFilteredPlayers(filteredPlayers); // Store initial filtered players
    setPlayersRemaining(filteredPlayers.length);
    setQuestionsAsked(0);
    setLogMessages([]);
    addLog(
      `🔮 Think of an active NBA player from the ${conf}ern Conference...`
    );
    askNextQuestion(filteredPlayers);
  };

  // Update handleAnswer to use and update the currentFilteredPlayers
  const handleAnswer = (answer: boolean): void => {
    setQuestionsAsked((prev) => prev + 1);
    addLog(
      `Q${questionsAsked + 1}: ${currentQuestion} ${answer ? "Yes" : "No"}`
    );

    let newFilteredPlayers = [...currentFilteredPlayers]; // Start with current filtered list

    if (currentQuestion.includes("Is your player one of these:")) {
      const mentionedPlayers = currentQuestion
        .replace("Is your player one of these: ", "")
        .replace("?", "")
        .split(", ");

      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter((p) =>
          mentionedPlayers.includes(p.full_name)
        );
      } else {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => !mentionedPlayers.includes(p.full_name)
        );
      }
    } else if (currentQuestion.includes("Is your player on the")) {
      const team = currentQuestion
        .replace("Is your player on the ", "")
        .replace("?", "");

      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter((p) => p.team === team);
      } else {
        newFilteredPlayers = newFilteredPlayers.filter((p) => p.team !== team);
      }
    } else if (currentQuestion.includes("strictly a Guard")) {
      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.position === "G"
        );
      } else {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.position !== "G"
        );
      }
    } else if (currentQuestion.includes("strictly a Forward")) {
      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.position === "F"
        );
      } else {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.position !== "F"
        );
      }
    } else if (currentQuestion.includes("strictly a Center")) {
      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.position === "C"
        );
      } else {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.position !== "C"
        );
      }
    } else if (currentQuestion.includes("Guard-Forward")) {
      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.position === "G-F"
        );
      } else {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.position !== "G-F"
        );
      }
    } else if (currentQuestion.includes("Forward-Center")) {
      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.position === "F-C"
        );
      } else {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.position !== "F-C"
        );
      }
    } else if (currentQuestion.includes("received any awards")) {
      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.awards_count > 0
        );
      } else {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.awards_count === 0
        );
      }
    } else if (currentQuestion.includes("older than")) {
      const ageMatch = currentQuestion.match(/older than (\d+)/);
      const age = ageMatch ? parseInt(ageMatch[1]) : 0;

      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter((p) => p.age > age);
      } else {
        newFilteredPlayers = newFilteredPlayers.filter((p) => p.age <= age);
      }
    } else if (currentQuestion.includes("taller than")) {
      const heightMatch = currentQuestion.match(/taller than (\d+'\d+")/);
      const heightStr = heightMatch ? heightMatch[1] : "";
      const feet = parseInt(heightStr.split("'")[0]);
      const inches = parseInt(heightStr.split("'")[1].replace('"', ""));
      const heightInCm = (feet * 12 + inches) * 2.54;

      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.height > heightInCm
        );
      } else {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.height <= heightInCm
        );
      }
    } else if (currentQuestion.includes("heavier than")) {
      const weightMatch = currentQuestion.match(/heavier than (\d+)/);
      const weight = weightMatch ? parseInt(weightMatch[1]) : 0;

      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.weight > weight
        );
      } else {
        newFilteredPlayers = newFilteredPlayers.filter(
          (p) => p.weight <= weight
        );
      }
    } else if (currentQuestion.includes("average more than")) {
      const statMatch = currentQuestion.match(
        /average more than (\d+\.\d+) (\w+)/
      );
      const value = statMatch ? parseFloat(statMatch[1]) : 0;
      const stat = statMatch ? `average_${statMatch[2]}` : "";

      if (answer) {
        newFilteredPlayers = newFilteredPlayers.filter((p: any) => {
          return p[stat as string as keyof Player] > value;
        });
      } else {
        newFilteredPlayers = newFilteredPlayers.filter((p: any) => {
          return p[stat as string as keyof Player] <= value;
        });
      }
    }

    // Update the current filtered players
    setCurrentFilteredPlayers(newFilteredPlayers);
    setPlayersRemaining(newFilteredPlayers.length);

    // If we have exactly one player left, we've found them
    if (newFilteredPlayers.length === 1) {
      setGameState("result");
      setGuessedPlayer(newFilteredPlayers[0].full_name);
      addLog(`🏀 My guess is... **${newFilteredPlayers[0].full_name}**!`);
    }
    // Otherwise ask the next question
    else {
      askNextQuestion(newFilteredPlayers);
    }
  };

  // Update resetGame to reset the currentFilteredPlayers
  const resetGame = () => {
    setGameState("intro");
    setConference(null);
    setCurrentQuestion("");
    setPlayersRemaining(0);
    setQuestionsAsked(0);
    setGuessedPlayer("");
    setLogMessages([]);
    setCurrentFilteredPlayers([]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        🏀 NBA Legend Guesser
      </h2>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading player data...</p>
        </div>
      ) : (
        <>
          {/* Intro Screen */}
          {gameState === "intro" && (
            <div className="space-y-6 text-center">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100">
                <p className="text-xl text-gray-800 mb-2">
                  🔮 Think of an active NBA player and I'll try to guess who it
                  is!
                </p>
                <p className="text-gray-600">
                  Select your player's conference:
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button
                  onClick={() => selectConference("East")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-blue-400"
                >
                  🏀 Eastern Conference
                </button>
                <button
                  onClick={() => selectConference("West")}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-red-400"
                >
                  🏀 Western Conference
                </button>
              </div>
            </div>
          )}

          {/* Game Playing Screen */}
          {gameState === "playing" && (
            <div className="space-y-6">
              <div className="flex justify-between mb-4 text-sm">
                <span className="font-bold bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                  Players remaining: {playersRemaining}
                </span>
                <span className="font-bold bg-purple-100 text-purple-800 px-3 py-2 rounded-lg">
                  Questions asked: {questionsAsked}
                </span>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200 mb-6">
                <p className="text-xl font-bold text-gray-800">
                  {currentQuestion}
                </p>
              </div>

              <div className="flex justify-center gap-6">
                <button
                  onClick={() => handleAnswer(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-green-400"
                >
                  ✅ Yes
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-red-400"
                >
                  ❌ No
                </button>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-3 text-lg">
                  📝 Game Log:
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-40 overflow-y-auto text-sm">
                  {logMessages.map((msg, idx) => (
                    <p
                      key={idx}
                      className="mb-2 p-2 bg-white rounded-lg border-l-4 border-purple-400"
                      dangerouslySetInnerHTML={{
                        __html: msg.replace(
                          /\*\*(.*?)\*\*/g,
                          "<strong class='text-purple-600'>$1</strong>"
                        ),
                      }}
                    ></p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Result Screen */}
          {gameState === "result" && (
            <div className="space-y-6 text-center">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl border-2 border-green-200">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  🏀 Your player is:
                </h2>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {guessedPlayer}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-lg text-gray-700">
                  It took me{" "}
                  <span className="font-bold text-blue-600">
                    {questionsAsked}
                  </span>{" "}
                  questions to guess your player!
                </p>
              </div>

              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-purple-400"
              >
                🔄 Play Again
              </button>

              <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-3 text-lg">
                  📝 Game Log:
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-40 overflow-y-auto text-sm">
                  {logMessages.map((msg, idx) => (
                    <p
                      key={idx}
                      className="mb-2 p-2 bg-white rounded-lg border-l-4 border-green-400"
                      dangerouslySetInnerHTML={{
                        __html: msg.replace(
                          /\*\*(.*?)\*\*/g,
                          "<strong class='text-green-600'>$1</strong>"
                        ),
                      }}
                    ></p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GuessYourLegend;
