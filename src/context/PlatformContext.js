import React, { useState, useEffect, useContext, createContext } from "react";
import PropTypes from "prop-types";
import { subDays } from "date-fns";

// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!../workers/dataAggregation.worker";
import { pieChartAggregation } from "../aggregators";
import { getFormattedMonthRange } from "../utils";
import * as api from "../api";

const PlatformContext = createContext();

export function usePlatformContext() {
  return useContext(PlatformContext);
}

const fetchRawData = async () => {
  try {
    const metrics = await api.fetchMetricRequestsData();
    const reviews = await api.fetchReviewsData();
    const searchKeywords = await api.fetchSearchKeywordsData();
    return { metrics, reviews, searchKeywords };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { metrics: [], reviews: [], searchKeywords: [] };
  }
};

const getLocationNames = (metrics) => {
  return [...new Set(metrics.map((obj) => obj.name))];
};

const currentDate = new Date();
const sources = ["SoMe", "Search", "Programmatic"];
const metricsInit = ["BUSINESS_DIRECTION_REQUESTS"];

export function PlatformProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [worker, setWorker] = useState(null);
  const [workerResponses, setWorkerResponses] = useState(0);
  const [startDate, setStartDate] = useState(subDays(currentDate, 30));
  const [endDate, setEndDate] = useState(currentDate);
  const [month, setMonth] = useState(
    getFormattedMonthRange(startDate, endDate)
  );

  const [stores, setStores] = useState([]);
  const [locationNames, setLocationNames] = useState([]);
  const [metricsByBusiness, setMetricsByBusiness] = useState([]);
  const [reviewsByBusiness, setReviewsByBusiness] = useState([]);
  const [searchKeywordsByBusiness, setSearchKeywordsByBusiness] = useState([]);
  const [impactPerCampaign, setImpactPerCampaign] = useState([]);
  const [marketingSource, setMarketingSource] = useState(sources);
  const [lineMetrics, setLineMetrics] = useState(metricsInit);
  const [lineGraphData, setLineGraphData] = useState([]);
  const [impactLineGraphData, setImpactLineGraphData] = useState([]);
  const [mapChartData, setMapChartData] = useState([]);
  const [impactMapChartData, setImpactMapChartData] = useState([]);
  const [streamChartData, setStreamChartData] = useState([]);
  const [keywordsPieChartData, setKeywordsPieChartData] = useState([]);
  const [channelPieChartData, setChannelPieChartData] = useState([]);
  const [campaignGridData, setCampaignGridData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [channelBarChartData, setChannelBarChartData] = useState([]);
  const [dataGridData, setDataGridData] = useState([]);
  const [keywordsData, setKeywordsData] = useState([]);

  useEffect(() => {
    const workerInstance = new Worker();

    workerInstance.onmessage = (event) => {
      if (!event.data) {
        console.warn("Received empty message from worker");
        return;
      }

      const { method, result, error, params } = event.data;

      if (error) {
        console.error("Worker:", method, "Error:", error, "Params:", params);
        return;
      }

      switch (method) {
        case "lineGraphAggregation":
          if (params && params.impact) {
            setImpactLineGraphData(result);
          } else {
            setLineGraphData(result);
          }
          break;

        case "mapChartAggregation":
          if (params && params.impact) {
            setImpactMapChartData(result);
          } else {
            setMapChartData(result);
          }
          break;

        case "streamChartAggregation":
          setStreamChartData(result);
          break;

        case "channelAggregation":
          setChannelPieChartData(result);
          break;

        case "campaignDataAggregation":
          setCampaignGridData(result);
          break;

        case "barChartAggregation":
          setBarChartData(result);
          break;

        case "channelBarChartAggregation":
          setChannelBarChartData(result);
          break;

        case "dataGridAggregation":
          setDataGridData(result);
          break;

        case "keywordsAggregation":
          setKeywordsData(result);
          break;

        default:
          console.warn("Received unknown method:", method);
          break;
      }
      setWorkerResponses((prev) => {
        const newValue = prev - 1;
        if (newValue === 0) {
          setLoading(false);
        }
        return newValue;
      });
    };

    workerInstance.onerror = (error) => {
      console.error("Error from worker:", error);
    };

    setWorker(workerInstance);

    return () => {
      workerInstance.terminate();
    };
  }, []);

  useEffect(() => {
    setMonth(getFormattedMonthRange(startDate, endDate));
  }, [startDate, endDate]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const data = await fetchRawData();
      if (isMounted) {
        setLoading(true);
        setMetricsByBusiness(data.metrics);
        setReviewsByBusiness(data.reviews);
        setSearchKeywordsByBusiness(data.searchKeywords);
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const regressionData = await api.fetchRegressionData(metricsByBusiness);
      if (isMounted) {
        setImpactPerCampaign(regressionData);
        const locations = getLocationNames(metricsByBusiness);
        setStores(locations);
        setLocationNames(locations);
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [metricsByBusiness]);

  const commonParams = {
    stores,
    startDate,
    endDate,
  };

  useEffect(() => {
    if (
      !metricsByBusiness.length ||
      !impactPerCampaign.length ||
      !searchKeywordsByBusiness.length ||
      !worker
    ) {
      return;
    }

    const postToWorker = (method, params) => {
      if (!params.data || params.data.length === 0) {
        console.warn(`Method ${method} has been skipped due to empty data.`);
        return;
      }

      if (!method || typeof method !== "string") {
        console.error("Invalid method name:", method);
        return;
      }
      setLoading(true);
      setWorkerResponses((prev) => prev + 1);
      worker.postMessage({ method, params });
    };

    postToWorker("lineGraphAggregation", {
      ...commonParams,
      impact: false,
      lineMetrics,
      data: metricsByBusiness,
    });

    postToWorker("lineGraphAggregation", {
      ...commonParams,
      impact: true,
      lineMetrics,
      marketingSource,
      data: impactPerCampaign,
    });

    postToWorker("mapChartAggregation", {
      ...commonParams,
      impact: false,
      lineMetrics,
      metricIds: lineMetrics,
      data: metricsByBusiness,
    });

    postToWorker("mapChartAggregation", {
      ...commonParams,
      impact: true,
      lineMetrics,
      marketingSource,
      metricIds: lineMetrics,
      data: impactPerCampaign,
    });

    postToWorker("streamChartAggregation", {
      ...commonParams,
      marketingSource,
      data: metricsByBusiness,
    });

    postToWorker("channelAggregation", {
      ...commonParams,
      marketingSource,
      data: metricsByBusiness,
    });

    postToWorker("campaignDataAggregation", {
      ...commonParams,
      marketingSource,
      data: impactPerCampaign,
    });

    postToWorker("barChartAggregation", {
      ...commonParams,
      marketingSource,
      data: impactPerCampaign,
    });

    postToWorker("channelBarChartAggregation", {
      ...commonParams,
      marketingSource,
      data: impactPerCampaign,
    });

    postToWorker("dataGridAggregation", {
      ...commonParams,
      data: metricsByBusiness,
    });

    postToWorker("keywordsAggregation", {
      stores,
      month,
      data: searchKeywordsByBusiness,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    metricsByBusiness,
    impactPerCampaign,
    searchKeywordsByBusiness,
    startDate,
    endDate,
    month,
    stores,
    marketingSource,
    lineMetrics,
    worker,
  ]);

  // We run this w/o a web worker since we are processing the search keywords data already returned by the keywordsAggregation worker
  useEffect(() => {
    if (keywordsData.length) {
      const data = pieChartAggregation(keywordsData);
      setKeywordsPieChartData(data);
    }
    return;
  }, [keywordsData]);

  const value = {
    loading,
    locationNames,
    sources,
    stores,
    setStores,
    marketingSource,
    setMarketingSource,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    lineMetrics,
    setLineMetrics,
    metricsByBusiness,
    reviewsByBusiness,
    lineGraphData,
    impactLineGraphData,
    mapChartData,
    impactMapChartData,
    dataGridData,
    keywordsData,
    keywordsPieChartData,
    channelPieChartData,
    streamChartData,
    barChartData,
    channelBarChartData,
    campaignGridData,
    impactPerCampaign,
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
}

PlatformProvider.propTypes = {
  children: PropTypes.node,
};
