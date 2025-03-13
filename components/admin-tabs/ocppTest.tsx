import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import OCPPClient from "../../utils/ocppWebSocket";

const OCPPTest = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    OCPPClient.connect(); // Connect WebSocket when the page loads

    // Listen for all OCPP messages
    OCPPClient.on("heartbeat", (data) => {
      console.log("📡 Heartbeat Received:", data);
      addLog(`🔵 Heartbeat: ${JSON.stringify(data)}`);
    });

    OCPPClient.on("bootNotification", (data) => {
      console.log("Boot Notification Received:", data);
      addLog(`BootNotification: ${JSON.stringify(data)}`);
    });

    OCPPClient.on("meterValues", (data) => {
      console.log("MeterValues Received:", data);
      addLog(`⚡ MeterValues: ${JSON.stringify(data)}`);
    });

    OCPPClient.on("statusNotification", (data) => {
      console.log("📡 Status Notification Received:", data);
      addLog(`📡 Status: ${JSON.stringify(data)}`);
    });

    OCPPClient.on("startTransaction", (data) => {
      console.log("StartTransaction Received:", data);
      addLog(`StartTransaction: ${JSON.stringify(data)}`);
    });

    OCPPClient.on("stopTransaction", (data) => {
      console.log("StopTransaction Received:", data);
      addLog(`StopTransaction: ${JSON.stringify(data)}`);
    });

    // Catch any other unknown messages
    OCPPClient.on("other", (data) => {
      console.log("📝 Unknown Message:", data);
      addLog(`📝 Other: ${JSON.stringify(data)}`);
    });

    // Cleanup WebSocket when leaving the screen
    return () => {
      OCPPClient.close();
    };
  }, []);

  // Function to add log entries
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prevLogs) => {
      const newLogs = [`${timestamp} - ${message}`, ...prevLogs];
      return newLogs.slice(0, 100); // max 100 logs
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OCPP Logs</Text>
      <ScrollView style={styles.logContainer}>
        {logs.length === 0 ? (
          <Text style={styles.logText}>Waiting for messages...</Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1e1e1e", // Dark mode style
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  logContainer: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    padding: 10,
    borderRadius: 10,
  },
  logText: {
    color: "#dcdcdc",
    fontSize: 14,
    marginBottom: 5,
  },
});

export default OCPPTest;
