import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const ReportsScreen = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reportOptions = [
    {
      id: 'oil-change',
      title: 'Reporte de Cambios de Aceite',
      description: 'Análisis detallado del mantenimiento de aceite',
      icon: '🔧',
      color: '#00ff88',
      stats: {
        total: '15',
        thisMonth: '3',
        avgCost: '$180',
      }
    },
    {
      id: 'daily-mileage',
      title: 'Reporte de Kilometraje Diario',
      description: 'Análisis de kilometraje diario de vehículos',
      icon: '📊',
      color: '#00cc6a',
      stats: {
        total: '45',
        thisMonth: '12',
        avgKm: '250',
      }
    },
    {
      id: 'general',
      title: 'Reportes Generales',
      description: 'Reportes consolidados y análisis avanzados',
      icon: '📈',
      color: '#00aa55',
      stats: {
        total: '8',
        thisMonth: '2',
        efficiency: '92%',
      }
    },
  ];

  const recentReports = [
    { id: 1, name: 'Mantenimiento Enero 2024', date: '2024-01-31', type: 'Mensual' },
    { id: 2, name: 'Análisis de Flota Q4 2023', date: '2024-01-15', type: 'Trimestral' },
    { id: 3, name: 'Reporte de Costos Anual', date: '2024-01-01', type: 'Anual' },
  ];

  const handleReportClick = (reportId: string) => {
    setSelectedReport(reportId);
    Alert.alert('Reporte', `Abriendo reporte: ${reportId}`);
  };

  const handleGenerateReport = (type: string) => {
    Alert.alert('Generar Reporte', `Generando reporte ${type}...`);
  };

  const handleExportReport = (reportId: string) => {
    Alert.alert('Exportar', `Exportando reporte ${reportId}...`);
  };

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
            <Text style={styles.title}>Reportes</Text>
            <Text style={styles.subtitle}>
              Análisis y reportes de tu flota
            </Text>
          </View>

          {/* Report Options */}
          <View style={styles.reportsContainer}>
            {reportOptions.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={[styles.reportCard, { borderColor: report.color }]}
                onPress={() => handleReportClick(report.id)}
              >
                <View style={styles.reportHeader}>
                  <Text style={styles.reportIcon}>{report.icon}</Text>
                  <View style={styles.reportTitleContainer}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <Text style={styles.reportDescription}>{report.description}</Text>
                  </View>
                </View>
                
                <View style={styles.reportStats}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: report.color }]}>
                      {report.stats.total}
                    </Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: report.color }]}>
                      {report.stats.thisMonth}
                    </Text>
                    <Text style={styles.statLabel}>Este Mes</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: report.color }]}>
                      {report.stats.avgCost || report.stats.avgKm || report.stats.efficiency}
                    </Text>
                    <Text style={styles.statLabel}>
                      {report.stats.avgCost ? 'Promedio' : report.stats.avgKm ? 'Promedio KM' : 'Eficiencia'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.reportActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: report.color }]}
                    onPress={() => handleGenerateReport(report.id)}
                  >
                    <Text style={styles.actionButtonText}>Generar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.exportButton]}
                    onPress={() => handleExportReport(report.id)}
                  >
                    <Text style={styles.exportButtonText}>Exportar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Reports */}
          <View style={styles.recentContainer}>
            <Text style={styles.sectionTitle}>Reportes Recientes</Text>
            
            {recentReports.map((report) => (
              <TouchableOpacity key={report.id} style={styles.recentCard}>
                <View style={styles.recentContent}>
                  <View>
                    <Text style={styles.recentName}>{report.name}</Text>
                    <Text style={styles.recentDate}>{report.date}</Text>
                  </View>
                  <View style={[styles.typeBadge, { backgroundColor: '#00ff88' }]}>
                    <Text style={styles.typeText}>{report.type}</Text>
                  </View>
                </View>
                
                <View style={styles.recentActions}>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>Ver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Text style={styles.downloadButtonText}>Descargar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Estadísticas Rápidas</Text>
            
            <View style={styles.quickStats}>
              <View style={styles.quickStatCard}>
                <Text style={styles.quickStatIcon}>📊</Text>
                <Text style={styles.quickStatValue}>23</Text>
                <Text style={styles.quickStatLabel}>Reportes Totales</Text>
              </View>
              
              <View style={styles.quickStatCard}>
                <Text style={styles.quickStatIcon}>📈</Text>
                <Text style={styles.quickStatValue}>15%</Text>
                <Text style={styles.quickStatLabel}>Mejora Eficiencia</Text>
              </View>
              
              <View style={styles.quickStatCard}>
                <Text style={styles.quickStatIcon}>💰</Text>
                <Text style={styles.quickStatValue}>$2.5K</Text>
                <Text style={styles.quickStatLabel}>Ahorro Mensual</Text>
              </View>
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
  reportsContainer: {
    padding: 20,
    gap: 15,
  },
  reportCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  reportIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  reportTitleContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  reportDescription: {
    fontSize: 12,
    color: '#888',
  },
  reportStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exportButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  exportButtonText: {
    color: '#00ff88',
    fontWeight: 'bold',
    fontSize: 14,
  },
  recentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 15,
  },
  recentCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  recentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  recentDate: {
    fontSize: 12,
    color: '#888',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#00ff88',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00ff88',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#00ff88',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  quickStatIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 3,
  },
  quickStatLabel: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
});

export default ReportsScreen;
