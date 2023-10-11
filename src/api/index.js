import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

const fetchMetricRequestsData = async () => {
  try {
    const fetchMetricRequests = httpsCallable(functions, "fetchMetricRequests");
    const { data } = await fetchMetricRequests();
    return data.result;
  } catch (error) {
    console.error("Error calling fetchMetricRequests:", error);
  }
};

const fetchReviewsData = async () => {
  try {
    const fetchReviews = httpsCallable(functions, "fetchReviews");
    const { data } = await fetchReviews();
    return data.result;
  } catch (error) {
    console.error("Error calling fetchReviews:", error);
  }
};

const fetchSearchKeywordsData = async () => {
  try {
    const fetchSearchKeywords = httpsCallable(functions, "fetchSearchKeywords");
    const { data } = await fetchSearchKeywords();
    return data.result;
  } catch (error) {
    console.error("Error calling fetchSearchKeywords:", error);
  }
};

const fetchRegressionData = async (metrics) => {
  try {
    const runRegression = httpsCallable(functions, "runRegression");
    const { data } = await runRegression(metrics);
    return data.result;
  } catch (error) {
    console.error("Error calling runRegression:", error);
  }
};

export {
  fetchMetricRequestsData,
  fetchReviewsData,
  fetchSearchKeywordsData,
  fetchRegressionData,
};
