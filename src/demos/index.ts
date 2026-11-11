import type React from 'react';
import { ButtonDemo, ImageDemo, InputDemo, TextDemo, ViewDemo } from './basics';
import { DeviceInfoDemo, KeyboardDemo, ShareLinkDemo } from './device';
import { DialogDemo, IndicatorDemo } from './feedback';
import { FlatListDemo, ScrollViewDemo, SectionListDemo } from './lists';
import { AnimatedDemo, GestureDemo, LayoutAnimationDemo } from './motion';

export type Demo = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  component: React.ComponentType;
};

export type Category = { title: string; demos: Demo[] };

export const categories: Category[] = [
  {
    title: 'Basics',
    demos: [
      { id: 'text', title: 'Text', subtitle: 'Weights, styles, nesting, truncation', icon: 'Aa', color: '#FF6B6B', component: TextDemo },
      { id: 'view', title: 'View & Layout', subtitle: 'Flexbox, borders, shadows, transforms', icon: '▦', color: '#FFA94D', component: ViewDemo },
      { id: 'image', title: 'Image', subtitle: 'resizeMode, tint, blur, ImageBackground', icon: '◩', color: '#FCC419', component: ImageDemo },
      { id: 'button', title: 'Buttons & Pressable', subtitle: 'Press states, long press, segments', icon: '●', color: '#51CF66', component: ButtonDemo },
      { id: 'input', title: 'Inputs', subtitle: 'TextInput, Switch, stepper, checkbox', icon: '⌨', color: '#20C997', component: InputDemo },
    ],
  },
  {
    title: 'Lists',
    demos: [
      { id: 'flatlist', title: 'FlatList', subtitle: 'Pull to refresh, infinite scroll', icon: '☰', color: '#339AF0', component: FlatListDemo },
      { id: 'sectionlist', title: 'SectionList', subtitle: 'Sticky section headers', icon: '§', color: '#5C7CFA', component: SectionListDemo },
      { id: 'scrollview', title: 'ScrollView', subtitle: 'Paging carousel, snapping, grid', icon: '⇆', color: '#845EF7', component: ScrollViewDemo },
    ],
  },
  {
    title: 'Feedback',
    demos: [
      { id: 'indicator', title: 'Progress', subtitle: 'ActivityIndicator, progress bar, skeleton', icon: '◌', color: '#CC5DE8', component: IndicatorDemo },
      { id: 'dialog', title: 'Alerts & Modals', subtitle: 'Alert, action sheet, Modal, toast', icon: '!', color: '#F06595', component: DialogDemo },
    ],
  },
  {
    title: 'Motion',
    demos: [
      { id: 'animated', title: 'Animated', subtitle: 'Easing, spring, loop, stagger', icon: '≈', color: '#FF8787', component: AnimatedDemo },
      { id: 'gesture', title: 'Gestures', subtitle: 'Drag, swipe to dismiss', icon: '✋', color: '#FFA94D', component: GestureDemo },
      { id: 'layout', title: 'LayoutAnimation', subtitle: 'Animate layout changes', icon: '⤢', color: '#94D82D', component: LayoutAnimationDemo },
    ],
  },
  {
    title: 'Device',
    demos: [
      { id: 'device', title: 'Device Info', subtitle: 'Platform, screen, appearance, app state', icon: 'ⓘ', color: '#22B8CF', component: DeviceInfoDemo },
      { id: 'share', title: 'Share & Linking', subtitle: 'Share sheet, open URLs and apps', icon: '↗', color: '#4C6EF5', component: ShareLinkDemo },
      { id: 'keyboard', title: 'Keyboard', subtitle: 'KeyboardAvoidingView, keyboard events', icon: '⌨', color: '#7950F2', component: KeyboardDemo },
    ],
  },
];
