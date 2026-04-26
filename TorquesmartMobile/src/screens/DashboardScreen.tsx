import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const DashboardScreen = () => {
  const stats = [
    { title: 'Vehículos', value: '12', icon: '🚗', color: '#00ff88' },
    { title: 'Mantenimientos', value: '8', icon: '🔧', color: '#00cc6a' },
    { title: 'Alertas', value: '3', icon: '⚠️', color: '#ff9800' },
    { title: 'Reportes', value: '15', icon: '📊', color: '#2196f3' },
  ];

  const recentActivities = [
    { id: 1, title: 'Cambio de aceite', vehicle: 'Volvo FH16', time: '2 horas atrás' },
    { id: 2, title: 'Inspección diaria', vehicle: 'Mercedes Actros', time: '4 horas atrás' },
    { id: 3, title: 'Mantenimiento programado', vehicle: 'Scania R730', time: '1 día atrás' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#0a0a0a', '#1a1a1a', '#0f0f0f']}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
              Bienvenido a Torquesmart Mobile
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { borderColor: stat.color }]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>

          {/* Recent Activities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            {recentActivities.map((activity) => (
              <TouchableOpacity key={activity.id} style={styles.activityCard}>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityVehicle}>{activity.vehicle}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <Text style={styles.activityArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#00ff88' }]}>
                <Text style={styles.quickActionIcon}>➕</Text>
                <Text style={styles.quickActionText}>Nuevo Vehículo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#00cc6a' }]}>
                <Text style={styles.quickActionIcon}>🔧</Text>
                <Text style={styles.quickActionText}>Mantenimiento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#2196f3' }]}>
                <Text style={styles.quickActionIcon}>📊</Text>
                <Text style={styles.quickActionText}>Ver Reportes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    gap: 15,
  },
  statCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '45%',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  activityVehicle: {
    fontSize: 12,
    color: '#00ff88',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 11,
    color: '#888',
  },
  activityArrow: {
    fontSize: 20,
    color: '#00ff88',
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickAction: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  quickActionText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DashboardScreen;
