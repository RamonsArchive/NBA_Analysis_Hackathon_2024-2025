"use client";
import React from "react";
import Form from "next/form";
import { useActionState, useState } from "react";
import { parseServerActionResponse } from "@/lib/utils";
import { inputSchema } from "@/lib/validation";
import { z } from "zod";
import { ActionState } from "@/lib/GlobalTypes";
import { toast } from "sonner";
import { recommendPlayers } from "@/lib/actions";
import ViewResults from "./ViewResults";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

const ReviewForm = () => {
  const router = useRouter();
  const [budgetInputValue, setBudgetInputValue] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [positionInput, setPositionInput] = useState("");
  const [results, setResults] = useState<any>(null);
  const [viewResults, setViewResults] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleResetFields = () => {
    setBudgetInputValue("");
    setHeightInput("");
    setAgeInput("");
    setPositionInput("");
    setErrors({});
    setResults(null);
    setFormKey((prev) => prev + 1);
    router.refresh();
  };

  const handleFormSubmit = async (
    prevState: ActionState,
    formData: FormData
  ) => {
    // Handle form submission logic here
    console.log("resubmitting...");
    const getBudget = formData.get("budget") as string;
    const getHeight = formData.get("height") as string;
    const getAge = formData.get("age") as string;
    const getPosition = positionInput;
    console.log("get psosition", getPosition);
    try {
      const budget = parseInt(getBudget);
      const height = parseInt(getHeight);
      const age = parseInt(getAge);
      const position = getPosition.toLowerCase();

      const data = {
        budget: budget,
        height: height,
        age: age,
        position: position,
      };

      await inputSchema.parseAsync(data);

      const result = await recommendPlayers(data);
      console.log("result", result);

      if (result.status === "SUCCESS") {
        setResults(result.data);
        toast.success("Success", {
          description: "Form submitted successfully",
        });
        return parseServerActionResponse({
          status: "SUCCESS",
          data: result.data,
        });
      } else {
        toast.error("Error", {
          description: "Failed to fetch data",
        });
        return parseServerActionResponse({
          status: "ERROR",
          error: result.error,
        });
      }
    } catch (errors) {
      console.error("Error submitting form:", errors);
      if (errors instanceof z.ZodError) {
        const fieldErrors = errors.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast.error("Error", {
          description: "Please check your inputs",
        });
        return { ...prevState, error: "Validation Failed", status: "ERROR" };
      } else {
        console.error("Error submitting form:", errors);
        toast.error("Error", {
          description: "Unexpected error. Please try again later",
        });
        return parseServerActionResponse({
          status: "ERROR",
          error: "Unexpected error",
        });
      }
    }
  };
  const [_state, formAction, isPending] = useActionState(handleFormSubmit, {
    status: "INITIAL",
    error: "",
  });
  return (
    <div className="flex flex-col gap-6 text-3xl text-black pt-6 border-2 border-gray-200 p-6 rounded-2xl shadow-xl min-w-[300px] max-w-[400px] w-full bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          🔍 Find Your Legend
        </h2>
        <p className="text-gray-600 text-lg">
          Submit a request to discover NBA players
        </p>
      </div>

      <Form key={formKey} action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col w-full h-auto gap-2">
          <p className="text-black text-base font-semibold">
            💰 Max budget in US dollars
          </p>
          <input
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl h-12 px-4 text-black text-base min-h-[48px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            placeholder="Enter your budget"
            value={budgetInputValue}
            onChange={(e) => setBudgetInputValue(e.target.value)}
            disabled={isPending}
            name="budget"
          ></input>
          {errors.budget && (
            <p className="text-red-500 text-sm">
              Please enter a number between 1 to 1 billion
            </p>
          )}
        </div>

        <div className="flex flex-col w-full h-auto gap-2">
          <p className="text-black text-base font-semibold">
            📏 Min height in inches
          </p>
          <input
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl h-12 px-4 text-black text-base min-h-[48px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            placeholder="Enter min height in inches"
            value={heightInput}
            onChange={(e) => setHeightInput(e.target.value)}
            disabled={isPending}
            name="height"
          ></input>
          {errors.height && (
            <p className="text-red-500 text-sm">
              Please enter a height between 0 to 100 inches
            </p>
          )}
        </div>

        <div className="flex flex-col w-full h-auto gap-2">
          <p className="text-black text-base font-semibold">🎂 Max age</p>
          <input
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl h-12 px-4 text-black text-base min-h-[48px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            placeholder="Enter max age as a raw number"
            value={ageInput}
            onChange={(e) => setAgeInput(e.target.value)}
            disabled={isPending}
            name="age"
          ></input>
          {errors.age && (
            <p className="text-red-500 text-sm">
              Please enter an age between 18 to 80
            </p>
          )}
        </div>

        <div className="flex flex-col w-full h-auto gap-2">
          <p className="text-black text-base font-semibold">🏀 Position</p>
          <input
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl h-12 px-4 text-black text-base min-h-[48px] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            placeholder="e.g., Forward, Center-Forward"
            value={positionInput}
            onChange={(e) => setPositionInput(e.target.value)}
            disabled={isPending}
            name="position"
          ></input>
          {errors.position && (
            <p className="text-red-500 text-sm text-wrap">
              Please enter a valid position. "Center", "Forward", "Guard",
              "Center-Forward", "Forward-Center", "Forward-Guard",
              "Guard-Forward"
            </p>
          )}
        </div>

        {results && (
          <>
            <button
              className="w-full text-center px-6 py-4 text-lg font-bold text-white transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl shadow-lg hover:shadow-xl border-2 border-green-400"
              onClick={() => setViewResults((prev) => !prev)}
            >
              🎯 View your Results!
            </button>
            <ViewResults
              results={results}
              viewResults={viewResults}
              setViewResults={setViewResults}
            />
          </>
        )}

        <button
          className="w-full px-6 py-4 text-lg font-bold text-white transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl border-2 border-blue-400"
          type="submit"
        >
          🚀 Submit
        </button>

        <button
          className="w-full px-6 py-4 text-lg font-bold text-white transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl border-2 border-purple-400"
          onClick={handleResetFields}
          type="button"
        >
          🔄 Reset Fields
        </button>
      </Form>
    </div>
  );
};

export default ReviewForm;
