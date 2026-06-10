// Type stubs for React Native and Expo modules
// These allow TypeScript compilation without having to install all dependencies

declare module 'react-native' {
  import { ComponentType, ReactNode, Component, MutableRefObject } from 'react';

  // Core components
  interface ViewProps {
    style?: any;
    children?: ReactNode;
  }
  export const View: ComponentType<ViewProps>;

  interface TextProps {
    style?: any;
    children?: ReactNode;
    numberOfLines?: number;
  }
  export const Text: ComponentType<TextProps>;

  interface TextInputProps {
    style?: any;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    secureTextEntry?: boolean;
    keyboardType?: string;
    autoCapitalize?: string;
    editable?: boolean;
    multiline?: boolean;
    maxLength?: number;
    onSubmitEditing?: () => void;
  }
  export const TextInput: ComponentType<TextInputProps>;

  interface TouchableOpacityProps {
    style?: any;
    onPress?: () => void;
    disabled?: boolean;
    children?: ReactNode;
    activeOpacity?: number;
  }
  export const TouchableOpacity: ComponentType<TouchableOpacityProps>;

  interface ScrollViewProps {
    style?: any;
    contentContainerStyle?: any;
    children?: ReactNode;
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    keyboardShouldPersistTaps?: string;
    ref?: MutableRefObject<any>;
    onContentSizeChange?: (w: number, h: number) => void;
  }
  export const ScrollView: ComponentType<ScrollViewProps>;

  interface ImageProps {
    source?: { uri: string } | number;
    style?: any;
  }
  export const Image: ComponentType<ImageProps>;

  interface ActivityIndicatorProps {
    size?: 'small' | 'large' | number;
    color?: string;
  }
  export const ActivityIndicator: ComponentType<ActivityIndicatorProps>;

  export const StyleSheet: {
    create: (styles: Record<string, any>) => Record<string, any>;
  };

  export const Platform: {
    OS: 'ios' | 'android' | 'web';
  };

  export const KeyboardAvoidingView: ComponentType<{
    behavior?: string;
    style?: any;
    children?: ReactNode;
  }>;

  export const Alert: {
    alert: (title: string, message?: string, buttons?: any[]) => void;
  };

  export const Modal: ComponentType<{
    visible: boolean;
    animationType?: string;
    transparent?: boolean;
    children?: ReactNode;
  }>;

  export const Dimensions: {
    get: (dim: 'window' | 'screen') => { width: number; height: number; scale: number; fontScale: number };
  };

  // Animated API (simplified stub)
  export const Animated: {
    createAnimatedComponent: (component: ComponentType<any>) => ComponentType<any>;
    View: ComponentType<any>;
    Text: ComponentType<any>;
    Image: ComponentType<any>;
    Value: new (value: number) => AnimatedValue;
    timing: (value: AnimatedValue, config: { toValue: number; duration: number; useNativeDriver?: boolean }) => AnimatedAnimation;
    loop: (animation: AnimatedAnimation) => AnimatedAnimation;
    sequence: (animations: AnimatedAnimation[]) => AnimatedAnimation;
    parallel: (animations: AnimatedAnimation[]) => AnimatedAnimation;
  };

  interface AnimatedValue {
    setValue: (value: number) => void;
    interpolate: (config: any) => AnimatedValue;
  }

  interface AnimatedAnimation {
    start: (callback?: () => void) => void;
    stop: () => void;
    reset: () => void;
  }
}

declare module 'expo-speech' {
  export function speak(text: string, options?: { language?: string; rate?: number; pitch?: number; onDone?: () => void; onStopped?: () => void }): Promise<void>;
  export function stop(): Promise<void>;
  export function isSpeaking(): Promise<boolean>;
}

declare module 'expo-av' {
  export const Audio: {
    requestPermissionsAsync: () => Promise<{ status: string }>;
    Recording: {
      createAsync: (options: any) => Promise<{ recording: any }>;
    };
    Sound: {
      createAsync: (source: any) => Promise<{ sound: any }>;
    };
    setAudioModeAsync: (options: any) => Promise<void>;
  };
  export const Video: any;
}

declare module 'expo-haptics' {
  export function impactAsync(style?: 'light' | 'medium' | 'heavy'): Promise<void>;
  export function notificationAsync(type?: 'success' | 'warning' | 'error'): Promise<void>;
}

declare module '@react-navigation/native' {
  import { ComponentType, ReactNode } from 'react';

  export const NavigationContainer: ComponentType<{
    children: ReactNode;
  }>;

  export function useNavigation(): any;
  export function useRoute(): any;
}

declare module '@react-navigation/native-stack' {
  import { ComponentType } from 'react';

  export function createNativeStackNavigator(): {
    Navigator: ComponentType<any>;
    Screen: ComponentType<any>;
  };
}

declare module '@react-navigation/bottom-tabs' {
  import { ComponentType } from 'react';

  export function createBottomTabNavigator(): {
    Navigator: ComponentType<any>;
    Screen: ComponentType<any>;
  };
}

declare module '@expo/vector-icons' {
  import { ComponentType } from 'react';

  export const Ionicons: ComponentType<{
    name: string;
    size: number;
    color: string;
  }>;
  export const MaterialIcons: ComponentType<any>;
  export const Feather: ComponentType<any>;
}

declare module 'expo-status-bar' {
  import { ComponentType } from 'react';

  export const StatusBar: ComponentType<{
    style?: 'light' | 'dark' | 'auto';
  }>;
}

declare module 'react-native-safe-area-context' {
  import { ComponentType, ReactNode } from 'react';

  export const SafeAreaView: ComponentType<{
    style?: any;
    children?: ReactNode;
  }>;
  export const SafeAreaProvider: ComponentType<any>;
  export function useSafeAreaInsets(): { top: number; bottom: number; left: number; right: number };
}

declare module '@react-native-async-storage/async-storage' {
  export function getItem(key: string): Promise<string | null>;
  export function setItem(key: string, value: string): Promise<void>;
  export function removeItem(key: string): Promise<void>;
}
