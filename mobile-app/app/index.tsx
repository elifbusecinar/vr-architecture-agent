import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { ActionSheet } from '../src/components/ActionSheet';
import { ScreenTransition } from '../src/components/ScreenTransition';

const COLORS = {
  cream: '#F0EDE8',
  creamDark: '#E8E4DE',
  black: '#1A1917',
  blackSoft: '#2C2A27',
  gray: '#8A8783',
  grayLight: '#C8C5C0',
  green: '#4A7C59',
  white: '#FAFAF8',
  border: '#D8D4CE',
  blue: '#3A6FA0',
  amber: '#C4783A',
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function LandingPage() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const guestActions = [
    { id: 'stories', label: 'Architecture Stories', sub: 'Explore our studio portfolio', iconBg: 'rgba(74,124,89,0.1)', iconColor: COLORS.green, icon: (c: string) => <Svg width={18} height={18} viewBox="0 0 18 18" fill="none"><Path d="M4 14l5-5 5 5M4 4l5 5 5-5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></Svg> },
    { id: 'pricing', label: 'Plans & Pricing', sub: 'From Solo Architect to Enterprise', iconBg: 'rgba(196,120,58,0.1)', iconColor: COLORS.amber, icon: (c: string) => <Svg width={18} height={18} viewBox="0 0 18 18" fill="none"><Rect x="3" y="5" width="12" height="8" rx="2" stroke={c} strokeWidth="1.5" /><Circle cx="9" cy="9" r="1.5" stroke={c} /></Svg> },
    { id: 'auth', label: 'Sign In / Join', sub: 'Access your studio workspace', iconBg: 'rgba(58,111,160,0.1)', iconColor: COLORS.blue, icon: (c: string) => <Svg width={18} height={18} viewBox="0 0 18 18" fill="none"><Circle cx="9" cy="6" r="3" stroke={c} strokeWidth="1.5" /><Path d="M4 14c0-2 2-3 5-3s5 1 5 3" stroke={c} strokeWidth="1.5" /></Svg> },
  ];

  const handleAction = (id: string) => {
    setMenuVisible(false);
    if (id === 'stories') router.push('/stories' as any);
    if (id === 'pricing') router.push('/pricing' as any);
    if (id === 'auth') router.push('/login' as any);
  };

  return (
    <ScreenTransition type="fade">
      <SafeAreaView style={styles.container}>
        {/* Nav */}
        <View style={styles.nav}>
          <View style={styles.navLogo}>
            <View style={styles.navLogoIcon}>
              <Svg viewBox="0 0 14 14" width={14} height={14}>
                <Path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" />
              </Svg>
            </View>
            <Text style={styles.navLogoText}>VR Architecture</Text>
          </View>
          <TouchableOpacity style={styles.navMenuBtn} onPress={() => setMenuVisible(true)}>
            <View style={styles.navMenuLine} />
            <View style={styles.navMenuLine} />
            <View style={[styles.navMenuLine, { width: 10 }]} />
          </TouchableOpacity>
        </View>

        <ActionSheet
          visible={menuVisible}
          title="Welcome to VR Architecture"
          subtitle="Jensen & Co · Architecture Platform 2.0"
          actions={guestActions}
          onAction={handleAction}
          onClose={() => setMenuVisible(false)}
        />


        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Badge */}
          <View style={styles.badgeWrap}>
            <View style={styles.badge}>
              <View style={styles.badgeDot}>
                <Svg viewBox="0 0 10 10" width={9} height={9}>
                  <Circle cx="5" cy="5" r="3" fill="white" />
                </Svg>
              </View>
              <Text style={styles.badgeText}>
                Now with real-time collaboration · <Text style={styles.badgeAccent}>Meta Quest 3</Text>
              </Text>
            </View>
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowText}>Meta Quest 3 — Ready</Text>
            </View>
            <Text style={styles.heroTitle}>
              Architecture{'\n'}
              in <Text style={styles.heroTitleItalic}>Virtual</Text>{'\n'}
              Reality
            </Text>
            <Text style={styles.heroSub}>
              Step inside your designs. Experience scale, light, and materiality in full 1:1 scale before ground is broken.
            </Text>
          </View>

          {/* CTA */}
          <View style={styles.cta}>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/create-account' as any)}>
              <Text style={styles.btnPrimaryText}>Start for free</Text>
              <Svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <Path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/login')}>
              <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <Circle cx="7" cy="7" r="6" stroke="#1A1917" strokeWidth="1.2" />
                <Path d="M5.5 4.5L10 7L5.5 9.5V4.5Z" fill="#1A1917" />
              </Svg>
              <Text style={styles.btnSecondaryText}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSecondary, { marginTop: 4, borderColor: COLORS.green, backgroundColor: 'rgba(74,124,89,0.05)' }]}
              onPress={() => router.push('/prototype')}
            >
              <Text style={[styles.btnSecondaryText, { color: COLORS.green }]}>View High-Fidelity Concept</Text>
            </TouchableOpacity>
          </View>

          {/* Trust */}
          <View style={styles.trustRow}>
            <View style={styles.trustAvatars}>
              <View style={[styles.trustAvatar, { backgroundColor: '#7B6FA0', marginLeft: 0 }]}>
                <Text style={styles.trustAvatarText}>AK</Text>
              </View>
              <View style={[styles.trustAvatar, { backgroundColor: '#4A7C59' }]}>
                <Text style={styles.trustAvatarText}>ME</Text>
              </View>
              <View style={[styles.trustAvatar, { backgroundColor: '#C4783A' }]}>
                <Text style={styles.trustAvatarText}>EK</Text>
              </View>
              <View style={[styles.trustAvatar, { backgroundColor: '#5B8FA8' }]}>
                <Text style={styles.trustAvatarText}>RY</Text>
              </View>
            </View>
            <Text style={styles.trustText}>
              <Text style={styles.trustTextBold}>500+</Text> architecture firms
            </Text>
            <View style={styles.trustDivider} />
            <View style={styles.trustStars}>
              <Text style={styles.starText}>★</Text>
              <Text style={styles.starText}>★</Text>
              <Text style={styles.starText}>★</Text>
              <Text style={styles.starText}>★</Text>
              <Text style={styles.starText}>★</Text>
            </View>
            <Text style={styles.trustRating}>4.9</Text>
          </View>

          {/* App preview */}
          <View style={styles.appPreview}>
            <View style={styles.previewBar}>
              <View style={styles.previewDots}>
                <View style={[styles.previewDot, { backgroundColor: '#FF5F57' }]} />
                <View style={[styles.previewDot, { backgroundColor: '#FFBD2E' }]} />
                <View style={[styles.previewDot, { backgroundColor: '#28CA41' }]} />
              </View>
              <View style={styles.previewUrlWrap}>
                <Text style={styles.previewUrl}>app.vrarchitecture.io/dashboard</Text>
              </View>
              <View style={{ width: 36 }} />
            </View>
            <View style={styles.previewStats}>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatVal}>8</Text>
                <Text style={styles.previewStatLabel}>Projects</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatVal}>3</Text>
                <Text style={styles.previewStatLabel}>VR Sessions</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatVal}>47</Text>
                <Text style={styles.previewStatLabel}>Models</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatVal}>3</Text>
                <Text style={styles.previewStatLabel}>Reviews</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  /* Nav */
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 52,
    zIndex: 2,
  },
  navLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navLogoIcon: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.black,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLogoText: {
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    color: COLORS.black,
    letterSpacing: -0.1,
  },
  navMenuBtn: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navMenuLine: {
    width: 14,
    height: 1.5,
    backgroundColor: COLORS.black,
    borderRadius: 2,
  },
  /* Badge */
  badgeWrap: {
    alignItems: 'center',
    marginTop: 16,
    zIndex: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 100,
    paddingVertical: 5,
    paddingRight: 12,
    paddingLeft: 7,
    gap: 7,
  },
  badgeDot: {
    width: 18,
    height: 18,
    backgroundColor: '#6B4FBB',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.blackSoft,
    fontFamily: 'DMSans_400Regular',
  },
  badgeAccent: {
    fontFamily: 'DMSans_700Bold',
  },
  /* Hero */
  hero: {
    paddingTop: 12,
    paddingHorizontal: 24,
    zIndex: 2,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(74,124,89,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74,124,89,0.2)',
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    backgroundColor: COLORS.green,
    borderRadius: 3,
  },
  eyebrowText: {
    fontSize: 11,
    fontFamily: 'DMSans_700Bold',
    color: COLORS.green,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: Math.min(46, SCREEN_WIDTH * 0.12),
    lineHeight: Math.min(46, SCREEN_WIDTH * 0.12) * 1.1,
    color: COLORS.black,
    letterSpacing: -0.5,
  },
  heroTitleItalic: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: COLORS.blackSoft,
  },
  heroSub: {
    marginTop: 14,
    fontSize: 13.5,
    lineHeight: 22,
    color: COLORS.gray,
    maxWidth: 280,
    fontFamily: 'DMSans_400Regular',
  },
  /* CTA */
  cta: {
    paddingTop: 20,
    paddingHorizontal: 24,
    gap: 10,
    zIndex: 2,
  },
  btnPrimary: {
    backgroundColor: COLORS.black,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnPrimaryText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    letterSpacing: -0.1,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  btnSecondaryText: {
    color: COLORS.black,
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    letterSpacing: -0.1,
  },
  /* Trust */
  trustRow: {
    paddingTop: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 2,
    flexWrap: 'wrap',
  },
  trustAvatars: {
    flexDirection: 'row',
  },
  trustAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -7,
  },
  trustAvatarText: {
    fontSize: 9,
    fontFamily: 'DMSans_700Bold',
    color: 'white',
  },
  trustText: {
    fontSize: 11,
    color: COLORS.gray,
    fontFamily: 'DMSans_400Regular',
  },
  trustTextBold: {
    color: COLORS.blackSoft,
    fontFamily: 'DMSans_700Bold',
  },
  trustDivider: {
    width: 1,
    height: 14,
    backgroundColor: COLORS.border,
  },
  trustStars: {
    flexDirection: 'row',
    gap: 2,
  },
  starText: {
    fontSize: 10,
    color: '#E8A838',
  },
  trustRating: {
    fontSize: 11,
    fontFamily: 'DMSans_500Medium',
    color: COLORS.blackSoft,
  },
  /* App Preview */
  appPreview: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  previewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  previewDots: {
    flexDirection: 'row',
    gap: 4,
    width: 36,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewUrlWrap: {
    backgroundColor: '#F5F4F1',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  previewUrl: {
    fontSize: 10,
    color: COLORS.gray,
    fontFamily: 'DMSans_400Regular',
  },
  previewStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
  },
  previewStat: {
    backgroundColor: '#F8F7F4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    width: '23%',
  },
  previewStatVal: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
    color: COLORS.black,
    lineHeight: 18,
  },
  previewStatLabel: {
    fontSize: 9,
    color: COLORS.gray,
    marginTop: 2,
    fontFamily: 'DMSans_400Regular',
  },
  previewStatSub: {
    fontSize: 8,
    marginTop: 2,
    fontFamily: 'DMSans_500Medium',
  },
  statGreen: {
    color: COLORS.green,
  },
  statRed: {
    color: '#D95555',
  },
});
