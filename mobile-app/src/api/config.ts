import { Platform } from 'react-native';

const getBaseUrl = () => {
    // If we're using Expo, we can usually hit localhost for iOS Simulator 
    // or 10.0.2.2 for Android Emulator. 
    // You can override this by putting your actual IPv4 address here if testing on physical device.
    if (__DEV__) {
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:5201/api';
        }
        return 'http://localhost:5201/api';
    }
    // Production URL fallback
    return 'https://api.vrarchitecture.io/api';
}

export const config = {
    api: {
        baseURL: getBaseUrl(),
        timeout: 30000,
    },
};
