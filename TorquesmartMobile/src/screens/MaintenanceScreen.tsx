import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const MaintenanceScreen = () => {
  const [maintenanceRecords] = useState([
    { id: 1, vehicle: 'Volvo FH16', type: 'Cambio de Aceite', date: '2024-01-15', status: 'Completado', cost: '$150' },
    { id: 2, vehicle: 'Mercedes Actros', type: 'Inspección Diaria', date: '2024-01-14', status: 'Pendiente', cost: '$50' },
    { id: 3, vehicle: 'Scania R730', type: 'Cambio de Filtros', date: '2024-01-13', status: 'Completado', cost: '$200' },
    { id: 4, vehicle: 'MAN TGX', type: 'Revisión General', date: '2024-01-12', status: 'En Progreso', cost: '$300' },
  ]);

  const [showOilChangeForm, setShowOilChangeForm] = useState(false);
  const [showDailyMileageForm, setShowDailyMileageForm] = useState(false);
  const [oilChangeData, setOilChangeData] = useState({
    vehicle: '',
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    oilType: '',
    cost: '',
    technician: '',
    notes: '',
  });
  const [dailyMileageData, setDailyMileageData] = useState({
    vehiclePlate: '',
    vehicleBrand: '',
    vehicleModel: '',
    date: new Date().toISOString().split('T')[0],
    startMileage: '',
    endMileage: '',
    driver: '',
    notes: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return '#00ff88';
      case 'Pendiente': return '#ff9800';
      case 'En Progreso': return '#2196f3';
      default: return '#888';
    }
  };

  const handleOilChangeSubmit = () => {
    if (!oilChangeData.vehicle || !oilChangeData.mileage || !oilChangeData.oilType || !oilChangeData.cost || !oilChangeData.technician) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    Alert.alert('Éxito', 'Cambio de aceite registrado correctamente');
    setOilChangeData({
      vehicle: '',
      date: new Date().toISOString().split('T')[0],
      mileage: '',
      oilType: '',
      cost: '',
      technician: '',
      notes: '',
    });
    setShowOilChangeForm(false);
  };

  const handleDailyMileageSubmit = () => {
    if (!dailyMileageData.vehiclePlate || !dailyMileageData.vehicleBrand || !dailyMileageData.vehicleModel || 
        !dailyMileageData.startMileage || !dailyMileageData.endMileage || !dailyMileageData.driver) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    const startKm = parseInt(dailyMileageData.startMileage);
    const endKm = parseInt(dailyMileageData.endMileage);
    
    if (startKm >= endKm) {
      Alert.alert('Error', 'El kilometraje final debe ser mayor al inicial');
      return;
    }

    Alert.alert('Éxito', 'Kilometraje diario registrado correctamente');
    setDailyMileageData({
      vehiclePlate: '',
      vehicleBrand: '',
      vehicleModel: '',
      date: new Date().toISOString().split('T')[0],
      startMileage: '',
      endMileage: '',
      driver: '',
      notes: '',
    });
    setShowDailyMileageForm(false);
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
            <Text style={styles.title}>Mantenimiento</Text>
            <Text style={styles.subtitle}>
              Gestiona el mantenimiento de tu flota
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: '#00ff88' }]}
              onPress={() => setShowOilChangeForm(true)}
            >
              <Text style={styles.quickActionIcon}>🔧</Text>
              <Text style={styles.quickActionTitle}>Cambio de Aceite</Text>
              <Text style={styles.quickActionSubtitle}>Registrar cambio de aceite</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: '#00cc6a' }]}
              onPress={() => setShowDailyMileageForm(true)}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionTitle}>KM Diario</Text>
              <Text style={styles.quickActionSubtitle}>Reportar kilometraje</Text>
            </TouchableOpacity>
          </View>

          {/* Oil Change Form */}
          {showOilChangeForm && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Cambio de Aceite</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Vehículo"
                placeholderTextColor="#888"
                value={oilChangeData.vehicle}
                onChangeText={(text) => setOilChangeData(prev => ({ ...prev, vehicle: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Fecha"
                placeholderTextColor="#888"
                value={oilChangeData.date}
                onChangeText={(text) => setOilChangeData(prev => ({ ...prev, date: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Kilometraje"
                placeholderTextColor="#888"
                value={oilChangeData.mileage}
                onChangeText={(text) => setOilChangeData(prev => ({ ...prev, mileage: text }))}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Tipo de Aceite"
                placeholderTextColor="#888"
                value={oilChangeData.oilType}
                onChangeText={(text) => setOilChangeData(prev => ({ ...prev, oilType: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Costo"
                placeholderTextColor="#888"
                value={oilChangeData.cost}
                onChangeText={(text) => setOilChangeData(prev => ({ ...prev, cost: text }))}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Técnico"
                placeholderTextColor="#888"
                value={oilChangeData.technician}
                onChangeText={(text) => setOilChangeData(prev => ({ ...prev, technician: text }))}
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notas"
                placeholderTextColor="#888"
                value={oilChangeData.notes}
                onChangeText={(text) => setOilChangeData(prev => ({ ...prev, notes: text }))}
                multiline
              />
              
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setShowOilChangeForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleOilChangeSubmit}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Daily Mileage Form */}
          {showDailyMileageForm && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Kilometraje Diario</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Placa del Vehículo"
                placeholderTextColor="#888"
                value={dailyMileageData.vehiclePlate}
                onChangeText={(text) => setDailyMileageData(prev => ({ ...prev, vehiclePlate: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Marca del Vehículo"
                placeholderTextColor="#888"
                value={dailyMileageData.vehicleBrand}
                onChangeText={(text) => setDailyMileageData(prev => ({ ...prev, vehicleBrand: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Modelo del Vehículo"
                placeholderTextColor="#888"
                value={dailyMileageData.vehicleModel}
                onChangeText={(text) => setDailyMileageData(prev => ({ ...prev, vehicleModel: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Fecha"
                placeholderTextColor="#888"
                value={dailyMileageData.date}
                onChangeText={(text) => setDailyMileageData(prev => ({ ...prev, date: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Kilometraje Inicial"
                placeholderTextColor="#888"
                value={dailyMileageData.startMileage}
                onChangeText={(text) => setDailyMileageData(prev => ({ ...prev, startMileage: text }))}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Kilometraje Final"
                placeholderTextColor="#888"
                value={dailyMileageData.endMileage}
                onChangeText={(text) => setDailyMileageData(prev => ({ ...prev, endMileage: text }))}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Conductor"
                placeholderTextColor="#888"
                value={dailyMileageData.driver}
                onChangeText={(text) => setDailyMileageData(prev => ({ ...prev, driver: text }))}
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notas"
                placeholderTextColor="#888"
                value={dailyMileageData.notes}
                onChangeText={(text) => setDailyMileageData(prev => ({ ...prev, notes: text }))}
                multiline
              />
              
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setShowDailyMileageForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleDailyMileageSubmit}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Maintenance Records */}
          <View style={styles.recordsContainer}>
            <Text style={styles.sectionTitle}>Historial de Mantenimiento</Text>
            
            {maintenanceRecords.map((record) => (
              <TouchableOpacity key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View>
                    <Text style={styles.recordVehicle}>{record.vehicle}</Text>
                    <Text style={styles.recordType}>{record.type}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                    <Text style={styles.statusText}>{record.status}</Text>
                  </View>
                </View>
                
                <View style={styles.recordDetails}>
                  <Text style={styles.detailText}>Fecha: {record.date}</Text>
                  <Text style={styles.detailText}>Costo: {record.cost}</Text>
                </View>
                
                <View style={styles.recordActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>Ver Detalles</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
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
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 15,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 5,
  },
  quickActionSubtitle: {
    fontSize: 11,
    color: '#000',
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  formButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#00ff88',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  recordsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 15,
  },
  recordCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordVehicle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  recordType: {
    fontSize: 14,
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recordDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  recordActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#00ff88',
    fontWeight: 'bold',
  },
});

export default MaintenanceScreen;
