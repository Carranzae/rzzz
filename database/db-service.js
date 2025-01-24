export class DatabaseService {
    constructor() {
        this.users = [];
        this.medicalHistory = [];
        this.devices = [];
        this.alerts = [];
        this.healthReadings = [];
        this.emergencyContacts = [];
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        // Initialize mock users
        this.users = [
            {
                id: 1,
                fullName: 'Usuario Demo',
                email: 'demo@example.com',
                phone: '+1234567890',
                birthDate: '1990-01-01',
                bloodType: 'O+',
                createdAt: new Date().toISOString()
            }
        ];

        // Initialize mock devices
        this.devices = [
            {
                id: 1,
                userId: 1,
                type: 'watch',
                name: 'SmartWatch Pro',
                connected: true,
                batteryLevel: 85,
                lastSync: new Date().toISOString()
            },
            {
                id: 2,
                userId: 1,
                type: 'band',
                name: 'Fitness Band',
                connected: false,
                batteryLevel: 45,
                lastSync: new Date().toISOString()
            }
        ];

        // Initialize mock health readings
        this.healthReadings = Array.from({ length: 24 }, (_, i) => ({
            id: i + 1,
            userId: 1,
            heart_rate: 60 + Math.floor(Math.random() * 30),
            steps: 1000 + Math.floor(Math.random() * 10000),
            activity_level: 'Normal',
            battery_level: 85 - Math.floor(i / 3),
            timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString()
        }));

        // Initialize mock alerts
        this.alerts = [
            {
                id: 1,
                userId: 1,
                type: 'heart_rate',
                message: 'Ritmo cardíaco elevado detectado',
                priority: 'high',
                is_read: false,
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                userId: 1,
                type: 'battery',
                message: 'Batería baja en dispositivo',
                priority: 'medium',
                is_read: false,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            }
        ];

        // Initialize mock emergency contacts
        this.emergencyContacts = [
            {
                id: 1,
                userId: 1,
                name: 'Contacto de Emergencia 1',
                phone: '+1234567890',
                relationship: 'Familiar'
            }
        ];

        this.initialized = true;
    }

    // User Management
    async createUser(userData) {
        const user = {
            id: this.users.length + 1,
            ...userData,
            createdAt: new Date().toISOString()
        };
        this.users.push(user);
        return user;
    }

    async getUserProfile(userId) {
        return this.users.find(u => u.id === userId);
    }

    async updateUserProfile(userId, userData) {
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...userData };
            return this.users[index];
        }
        return null;
    }

    // Health Readings Management
    async saveHealthReading(reading) {
        const newReading = {
            id: this.healthReadings.length + 1,
            ...reading,
            timestamp: new Date().toISOString()
        };
        this.healthReadings.unshift(newReading);
        await this.checkHealthAlerts(newReading);
        return newReading;
    }

    async getHealthReadings(userId, days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.healthReadings
            .filter(r => r.userId === userId && new Date(r.timestamp) >= startDate)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Alerts Management
    async createAlert(alert) {
        const newAlert = {
            id: this.alerts.length + 1,
            ...alert,
            is_read: false,
            timestamp: new Date().toISOString()
        };
        this.alerts.unshift(newAlert);
        return newAlert;
    }

    async getAllAlerts(userId) {
        return this.alerts
            .filter(a => a.userId === userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    async getUnreadAlerts(userId) {
        return this.alerts
            .filter(a => a.userId === userId && !a.is_read)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    async getAlertsByPriority(userId, priority) {
        return this.alerts
            .filter(a => a.userId === userId && a.priority === priority)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    async markAlertAsRead(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.is_read = true;
            return true;
        }
        return false;
    }

    // Device Management
    async getUserDevices(userId) {
        return this.devices.filter(d => d.userId === userId);
    }

    async updateDeviceStatus(deviceId, status) {
        const device = this.devices.find(d => d.id === deviceId);
        if (device) {
            Object.assign(device, status, { lastSync: new Date().toISOString() });
            return device;
        }
        return null;
    }

    // Emergency Contacts Management
    async getEmergencyContacts(userId) {
        return this.emergencyContacts.filter(c => c.userId === userId);
    }

    async addEmergencyContact(contact) {
        const newContact = {
            id: this.emergencyContacts.length + 1,
            ...contact
        };
        this.emergencyContacts.push(newContact);
        return newContact;
    }

    // Health Alerts Check
    async checkHealthAlerts(reading) {
        const alerts = [];
        
        // Check heart rate
        if (reading.heart_rate > 100) {
            alerts.push(await this.createAlert({
                userId: reading.userId,
                type: 'heart_rate',
                message: 'Ritmo cardíaco elevado detectado',
                priority: 'high'
            }));
        }

        // Check battery level
        if (reading.battery_level < 20) {
            alerts.push(await this.createAlert({
                userId: reading.userId,
                type: 'battery',
                message: 'Batería baja en dispositivo',
                priority: 'medium'
            }));
        }

        return alerts;
    }

    // Statistics and Analytics
    async getUserStats(userId) {
        const today = new Date();
        const readings = await this.getHealthReadings(userId, 1);
        
        return {
            totalSteps: readings.reduce((sum, r) => sum + r.steps, 0),
            calories: Math.floor(readings.reduce((sum, r) => sum + r.steps * 0.04, 0)),
            activeMinutes: readings.filter(r => r.activity_level !== 'Inactive').length * 15,
            distance: readings.reduce((sum, r) => sum + r.steps * 0.0007, 0)
        };
    }

    // Medical History Export
    async exportMedicalHistory(userId, startDate, endDate) {
        const readings = this.healthReadings.filter(r => {
            const date = new Date(r.timestamp);
            return r.userId === userId && 
                   date >= startDate && 
                   date <= endDate;
        });

        const alerts = this.alerts.filter(a => {
            const date = new Date(a.timestamp);
            return a.userId === userId && 
                   date >= startDate && 
                   date <= endDate;
        });

        return {
            readings,
            alerts,
            exportDate: new Date().toISOString()
        };
    }
}

export const dbService = new DatabaseService();