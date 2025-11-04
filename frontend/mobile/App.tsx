import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/**
 * Digital Mirror Mobile App (React Native Stub)
 * 
 * This is a minimal stub for the mobile app.
 * Full implementation will include:
 * - Navigation (React Navigation)
 * - Authentication screens
 * - Dashboard with financial data
 * - Account management
 * - Simulation creation
 * - Push notifications for goals
 */

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>✨</Text>
        <Text style={styles.title}>Digital Mirror</Text>
      </View>
      
      <Text style={styles.subtitle}>Mobile App (MVP Stub)</Text>
      <Text style={styles.description}>
        Financial decision simulation platform{'\n'}
        Coming soon to iOS and Android
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Launch Web App</Text>
      </TouchableOpacity>

      <View style={styles.features}>
        <Text style={styles.featureTitle}>Planned Features:</Text>
        <Text style={styles.feature}>📊 Real-time financial dashboards</Text>
        <Text style={styles.feature}>💰 Account & transaction tracking</Text>
        <Text style={styles.feature}>🎯 AI-powered simulations</Text>
        <Text style={styles.feature}>🏆 Gamified goals & achievements</Text>
        <Text style={styles.feature}>🔔 Smart notifications</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    fontSize: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#60a5fa',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  features: {
    alignItems: 'flex-start',
    width: '100%',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  feature: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 8,
  },
});

