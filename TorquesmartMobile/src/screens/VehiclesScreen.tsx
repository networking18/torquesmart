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

const VehiclesScreen = () => {
  const [vehicles] = useState([
    { id: 1, plate: 'ABC-123', brand: 'Volvo', model: 'FH16', year: '2022', status: 'Activo' },
    { id: 2, plate: 'DEF-456', brand: 'Mercedes', model: 'Actros', year: '2021', status: 'Mantenimiento' },
    { id: 3, plate: 'GHI-789', brand: 'Scania', model: 'R730', year: '2023', status: 'Activo' },
    { id: 4, plate: 'JKL-012', brand: 'MAN', model: 'TGX', year: '2020', status: 'Inactivo' },
  ]);

  const [searchText, setSearchText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    plate: '',
    brand: '',
    model: '',
    year: '',
  });

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.plate.toLowerCase().includes(searchText.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchText.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return '#00ff88';
      case 'Mantenimiento': return '#ff9800';
      case 'Inactivo': return '#f44336';
      default: return '#888';
    }
  };

  const handleAddVehicle = () => {
    if (!newVehicle.plate || !newVehicle.brand || !newVehicle.model || !newVehicle.year) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    Alert.alert('Éxito', 'Vehículo agregado correctamente');
    setNewVehicle({ plate: '', brand: '', model: '', year: '' });
    setShowAddForm(false);
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
            <Text style={styles.title}>Vehículos</Text>
            <Text style={styles.subtitle}>
              Gestiona tu flota vehicular
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por placa, marca o modelo..."
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Add Vehicle Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.addButtonText}>+ Agregar Vehículo</Text>
          </TouchableOpacity>

          {/* Add Vehicle Form */}
          {showAddForm && (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Nuevo Vehículo</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Placa"
                placeholderTextColor="#888"
                value={newVehicle.plate}
                onChangeText={(text) => setNewVehicle(prev => ({ ...prev, plate: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Marca"
                placeholderTextColor="#888"
                value={newVehicle.brand}
                onChangeText={(text) => setNewVehicle(prev => ({ ...prev, brand: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Modelo"
                placeholderTextColor="#888"
                value={newVehicle.model}
                onChangeText={(text) => setNewVehicle(prev => ({ ...prev, model: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Año"
                placeholderTextColor="#888"
                value={newVehicle.year}
                onChangeText={(text) => setNewVehicle(prev => ({ ...prev, year: text }))}
                keyboardType="numeric"
              />
              
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleAddVehicle}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Vehicles List */}
          <View style={styles.vehiclesContainer}>
            {filteredVehicles.map((vehicle) => (
              <TouchableOpacity key={vehicle.id} style={styles.vehicleCard}>
                <View style={styles.vehicleHeader}>
                  <View>
                    <Text style={styles.vehiclePlate}>{vehicle.plate}</Text>
                    <Text style={styles.vehicleModel}>
                      {vehicle.brand} {vehicle.model}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}>
                    <Text style={styles.statusText}>{vehicle.status}</Text>
                  </View>
                </View>
                
                <View style={styles.vehicleDetails}>
                  <Text style={styles.detailText}>Año: {vehicle.year}</Text>
                  <Text style={styles.detailText}>Estado: {vehicle.status}</Text>
                </View>
                
                <View style={styles.vehicleActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                    <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#00ff88',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addForm: {
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
  vehiclesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  vehicleCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  vehiclePlate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  vehicleModel: {
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
  vehicleDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  vehicleActions: {
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
  deleteButton: {
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  actionText: {
    fontSize: 12,
    color: '#00ff88',
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#f44336',
  },
});

export default VehiclesScreen;
