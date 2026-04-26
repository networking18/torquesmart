import React from 'react';
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

const ProfileScreen = () => {
  const userProfile = {
    name: 'Usuario Demo',
    email: 'demo@torquesmart.com',
    role: 'Administrador',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-25',
  };

  const settingsOptions = [
    { id: 'notifications', title: 'Notificaciones', icon: '🔔', description: 'Configurar alertas y notificaciones' },
    { id: 'security', title: 'Seguridad', icon: '🔒', description: 'Cambiar contraseña y configuración de seguridad' },
    { id: 'sync', title: 'Sincronización', icon: '🔄', description: 'Sincronizar datos con el servidor' },
    { id: 'backup', title: 'Respaldo', icon: '💾', description: 'Crear y restaurar respaldos' },
    { id: 'help', title: 'Ayuda', icon: '❓', description: 'Centro de ayuda y soporte' },
    { id: 'about', title: 'Acerca de', icon: 'ℹ️', description: 'Información sobre Torquesmart' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Está seguro de que desea cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const handleSettingPress = (settingId: string) => {
    Alert.alert('Configuración', `Abriendo configuración: ${settingId}`);
  };

  const handleSyncData = () => {
    Alert.alert('Sincronización', 'Sincronizando datos...');
  };

  const handleBackup = () => {
    Alert.alert('Respaldo', 'Creando respaldo de datos...');
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
            <Text style={styles.title}>Perfil</Text>
            <Text style={styles.subtitle}>
              Configuración de tu cuenta
            </Text>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.name}</Text>
                <Text style={styles.profileEmail}>{userProfile.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{userProfile.role}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.profileDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Fecha de Registro:</Text>
                <Text style={styles.detailValue}>{userProfile.joinDate}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Último Acceso:</Text>
                <Text style={styles.detailValue}>{userProfile.lastLogin}</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: '#00ff88' }]}
              onPress={handleSyncData}
            >
              <Text style={styles.quickActionIcon}>🔄</Text>
              <Text style={styles.quickActionText}>Sincronizar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: '#00cc6a' }]}
              onPress={handleBackup}
            >
              <Text style={styles.quickActionIcon}>💾</Text>
              <Text style={styles.quickActionText}>Respaldo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: '#2196f3' }]}
              onPress={() => handleSettingPress('notifications')}
            >
              <Text style={styles.quickActionIcon}>🔔</Text>
              <Text style={styles.quickActionText}>Notificaciones</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Options */}
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>Configuración</Text>
            
            {settingsOptions.map((setting) => (
              <TouchableOpacity
                key={setting.id}
                style={styles.settingCard}
                onPress={() => handleSettingPress(setting.id)}
              >
                <View style={styles.settingContent}>
                  <Text style={styles.settingIcon}>{setting.icon}</Text>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingDescription}>{setting.description}</Text>
                  </View>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* App Info */}
          <View style={styles.appInfoContainer}>
            <Text style={styles.sectionTitle}>Información de la App</Text>
            
            <View style={styles.appInfoCard}>
              <View style={styles.appInfoItem}>
                <Text style={styles.appInfoLabel}>Versión:</Text>
                <Text style={styles.appInfoValue}>1.0.0</Text>
              </View>
              <View style={styles.appInfoItem}>
                <Text style={styles.appInfoLabel}>Build:</Text>
                <Text style={styles.appInfoValue}>2024.01.25</Text>
              </View>
              <View style={styles.appInfoItem}>
                <Text style={styles.appInfoLabel}>Plataforma:</Text>
                <Text style={styles.appInfoValue}>React Native</Text>
              </View>
              <View style={styles.appInfoItem}>
                <Text style={styles.appInfoLabel}>Desarrollador:</Text>
                <Text style={styles.appInfoValue}>Torquesmart Team</Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
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
  profileCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    borderRadius: 15,
    padding: 20,
    margin: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileDetails: {
    gap: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
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
  settingsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 15,
  },
  settingCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 12,
    color: '#888',
  },
  settingArrow: {
    fontSize: 20,
    color: '#00ff88',
    fontWeight: 'bold',
  },
  appInfoContainer: {
    padding: 20,
    paddingTop: 0,
  },
  appInfoCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: 15,
    padding: 15,
  },
  appInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  appInfoLabel: {
    fontSize: 14,
    color: '#888',
  },
  appInfoValue: {
    fontSize: 14,
    color: '#fff',
  },
  logoutContainer: {
    padding: 20,
    paddingTop: 0,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
