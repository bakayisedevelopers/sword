/**
 * Design tokens translated directly from FlutterFlow theme:
 * flutter-website/lib/flutter_flow/flutter_flow_theme.dart
 */

export const colors = {
  primary: '#FFFFFF',
  secondary: '#192431',
  tertiary: '#C97303',
  alternate: '#C97303',
  primaryText: '#192431',
  secondaryText: '#FFFFFF',
  primaryBackground: '#D4D4D4',
  secondaryBackground: '#FFFFFF',
  accent1: 'transparent',
  accent2: 'rgba(2, 202, 121, 0.357)', // 0x5B02CA79
  accent3: 'rgba(238, 139, 96, 0.302)', // 0x4DEE8B60
  accent4: 'rgba(38, 45, 52, 0.698)', // 0xB2262D34
  success: '#249689',
  warning: '#F9CF58',
  error: '#FF5963',
  info: '#FFFFFF',
};

export const typography = {
  fontFamily: 'Inter, sans-serif',
  styles: {
    displayLarge: {
      fontFamily: 'Inter',
      fontSize: '64px',
      fontWeight: '400',
      lineHeight: '1.2',
      defaultColor: colors.primaryText,
    },
    displayMedium: {
      fontFamily: 'Inter',
      fontSize: '44px',
      fontWeight: '400',
      lineHeight: '1.2',
      defaultColor: colors.primaryText,
    },
    displaySmall: {
      fontFamily: 'Inter',
      fontSize: '36px',
      fontWeight: '600',
      lineHeight: '1.25',
      defaultColor: colors.primaryText,
    },
    headlineLarge: {
      fontFamily: 'Inter',
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '1.25',
      defaultColor: colors.primaryText,
    },
    headlineMedium: {
      fontFamily: 'Inter',
      fontSize: '24px',
      fontWeight: '400',
      lineHeight: '1.3',
      defaultColor: colors.primaryText,
    },
    headlineSmall: {
      fontFamily: 'Inter',
      fontSize: '24px',
      fontWeight: '500',
      lineHeight: '1.3',
      defaultColor: colors.primaryText,
    },
    titleLarge: {
      fontFamily: 'Inter',
      fontSize: '22px',
      fontWeight: '500',
      lineHeight: '1.35',
      defaultColor: colors.primaryText,
    },
    titleMedium: {
      fontFamily: 'Inter',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '1.4',
      defaultColor: colors.info,
    },
    titleSmall: {
      fontFamily: 'Inter',
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '1.4',
      defaultColor: colors.info,
    },
    labelLarge: {
      fontFamily: 'Inter',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.4',
      defaultColor: colors.secondaryText,
    },
    labelMedium: {
      fontFamily: 'Inter',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.4',
      defaultColor: colors.secondaryText,
    },
    labelSmall: {
      fontFamily: 'Inter',
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.4',
      defaultColor: colors.secondaryText,
    },
    bodyLarge: {
      fontFamily: 'Inter',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
      defaultColor: colors.primaryText,
    },
    bodyMedium: {
      fontFamily: 'Inter',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
      defaultColor: colors.primaryText,
    },
    bodySmall: {
      fontFamily: 'Inter',
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.5',
      defaultColor: colors.primaryText,
    },
  },
};

export const designTokens = {
  colors,
  typography,
};

export default designTokens;
