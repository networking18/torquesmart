// @ts-nocheck

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  vin: string;
  engineType: string;
  fuelType: string;
  capacity: string;
  mileage: string;
  status: string;
  driver: string;
  insurance: string;
  registration: string;
  notes: string;
  images: string[];
  createdAt: string;
}

class VehicleStorage {
  private static readonly STORAGE_KEY = 'torquesmart_vehicles';

  static getVehicles(): Vehicle[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultVehicles();
    } catch (error) {
      console.error('Error loading vehicles:', error);
      return this.getDefaultVehicles();
    }
  }

  static saveVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'images'>, imageData: string[] = []): Vehicle {
    const vehicles = this.getVehicles();
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now().toString(),
      images: imageData,
      createdAt: new Date().toISOString()
    };
    
    vehicles.push(newVehicle);
    this.saveVehicles(vehicles);
    return newVehicle;
  }

  static updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex(v => v.id === id);
    
    if (index === -1) return null;
    
    vehicles[index] = { ...vehicles[index], ...updates };
    this.saveVehicles(vehicles);
    return vehicles[index];
  }

  static deleteVehicle(id: string): boolean {
    const vehicles = this.getVehicles();
    const filteredVehicles = vehicles.filter(v => v.id !== id);
    
    if (filteredVehicles.length === vehicles.length) return false;
    
    this.saveVehicles(filteredVehicles);
    return true;
  }

  static getVehicleById(id: string): Vehicle | null {
    const vehicles = this.getVehicles();
    return vehicles.find(v => v.id === id) || null;
  }

  private static saveVehicles(vehicles: Vehicle[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(vehicles));
    } catch (error) {
      console.error('Error saving vehicles:', error);
    }
  }

  private static getDefaultVehicles(): Vehicle[] {
    return [
      {
        id: '1',
        plate: 'ABC-123',
        brand: 'Volvo',
        model: 'FH16',
        year: '2022',
        color: 'Blanco',
        vin: 'VOLVOFH162022123456',
        engineType: 'Diésel',
        fuelType: 'Diésel',
        capacity: '40',
        mileage: '45000',
        status: 'active',
        driver: 'Juan Pérez',
        insurance: 'POL-2022-001',
        registration: 'REG-2022-001',
        notes: 'Vehículo en excelente estado',
        images: [],
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        plate: 'DEF-456',
        brand: 'Mercedes-Benz',
        model: 'Actros',
        year: '2021',
        color: 'Azul',
        vin: 'MBACTROS2021123456',
        engineType: 'Diésel',
        fuelType: 'Diésel',
        capacity: '35',
        mileage: '62000',
        status: 'active',
        driver: 'Carlos Rodríguez',
        insurance: 'POL-2021-002',
        registration: 'REG-2021-002',
        notes: 'Recientemente mantenido',
        images: [],
        createdAt: '2024-02-20T14:15:00Z'
      },
      {
        id: '3',
        plate: 'GHI-789',
        brand: 'Scania',
        model: 'R730',
        year: '2023',
        color: 'Rojo',
        vin: 'SCANIAR7302023789',
        engineType: 'Diésel',
        fuelType: 'Diésel',
        capacity: '45',
        mileage: '28000',
        status: 'maintenance',
        driver: 'María González',
        insurance: 'POL-2023-003',
        registration: 'REG-2023-003',
        notes: 'En mantenimiento programado',
        images: [],
        createdAt: '2024-03-10T09:45:00Z'
      }
    ];
  }

  static getVehicleStats() {
    const vehicles = this.getVehicles();
    return {
      total: vehicles.length,
      active: vehicles.filter(v => v.status === 'active').length,
      maintenance: vehicles.filter(v => v.status === 'maintenance').length,
      inactive: vehicles.filter(v => v.status === 'inactive').length
    };
  }
}

export default VehicleStorage;
