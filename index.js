import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './widget-task-handler';
import 'expo-router/entry';

import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  registerWidgetTaskHandler(widgetTaskHandler);
}
