// Test file for @proapp/shared package
// This file tests that all imports from @proapp/shared work correctly

// Test styles
import { BORDER_RADIUS, fadeIn, glassmorphism } from '@proapp/shared/styles';

// Test components
import { FlipCard, AnimatedGradient, Breadcrumbs } from '@proapp/shared/components';

// Test hooks
import { useSoundFeedback, useModal, useAsync, useResponsive, useModernEffects } from '@proapp/shared/hooks';

// Test constants
import { SETTINGS_ICONS, NAVIGATION_ICONS, ACTION_ICONS } from '@proapp/shared/constants';

// Test utils
import { formatDate, validateEmail, validatePhone } from '@proapp/shared/utils';

// Test main export
import * as ProAppShared from '@proapp/shared';

console.log('✅ @proapp/shared package test');
console.log('');
console.log('Styles:');
console.log('  BORDER_RADIUS:', BORDER_RADIUS);
console.log('  fadeIn:', typeof fadeIn);
console.log('  glassmorphism:', typeof glassmorphism);
console.log('');
console.log('Components:');
console.log('  FlipCard:', typeof FlipCard);
console.log('  AnimatedGradient:', typeof AnimatedGradient);
console.log('  Breadcrumbs:', typeof Breadcrumbs);
console.log('');
console.log('Hooks:');
console.log('  useSoundFeedback:', typeof useSoundFeedback);
console.log('  useModal:', typeof useModal);
console.log('  useAsync:', typeof useAsync);
console.log('  useResponsive:', typeof useResponsive);
console.log('  useModernEffects:', typeof useModernEffects);
console.log('');
console.log('Constants:');
console.log('  SETTINGS_ICONS:', typeof SETTINGS_ICONS);
console.log('  NAVIGATION_ICONS:', typeof NAVIGATION_ICONS);
console.log('  ACTION_ICONS:', typeof ACTION_ICONS);
console.log('');
console.log('Utils:');
console.log('  formatDate:', typeof formatDate);
console.log('  validateEmail:', typeof validateEmail);
console.log('  validatePhone:', typeof validatePhone);
console.log('');
console.log('Main export:');
console.log('  ProAppShared keys:', Object.keys(ProAppShared).length);
console.log('');
console.log('✅ All imports successful!');
