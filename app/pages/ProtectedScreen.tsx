import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ProtectedScreen = ({ navigation }: { navigation: any }) => {
  const [data, setData] = useState<string>('');

  const fetchProtectedData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://192.168.1.132:3000/api/protected', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (response.ok) {
        setData(result.message);
      } else {
        setData('Access Denied');
      }
    } catch (error) {
      console.error('Error fetching protected data:', error);
      setData('An error occurred');
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Protected Screen</Text>
      <Text style={styles.data}>{data}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  data: { fontSize: 16, marginBottom: 20 },
});

export default ProtectedScreen;
