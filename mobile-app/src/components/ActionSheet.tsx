import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, Modal, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface ActionItem {
    id: string;
    label: string;
    sub?: string;
    type?: 'default' | 'danger';
    icon: (color: string) => React.ReactNode;
    iconBg: string;
    iconColor: string;
}

interface ActionSheetProps {
    visible: boolean;
    title: string;
    subtitle: string;
    actions: ActionItem[];
    onAction: (id: string) => void;
    onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ActionSheet: React.FC<ActionSheetProps> = ({ visible, title, subtitle, actions, onAction, onClose }) => {
    const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
        } else {
            hideSheet();
        }
    }, [visible]);

    const hideSheet = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 300, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start(() => onClose());
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={hideSheet}>
                    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.handle} />
                    <View style={styles.header}>
                        <View style={styles.projRow}>
                            <View style={styles.projIcon}><Svg viewBox="0 0 18 18" width={18} height={18} fill="white"><Path d="M2 16V7l7-5 7 5v9H2Z" stroke="white" strokeWidth="1.2" /><Rect x="6" y="11" width="3" height="5" fill="white" opacity="0.7" /></Svg></View>
                            <View>
                                <Text style={styles.projName}>{title}</Text>
                                <Text style={styles.projMeta}>{subtitle}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        {actions.map(action => (
                            <TouchableOpacity key={action.id} style={styles.actionItem} onPress={() => onAction(action.id)}>
                                <View style={[styles.iconBox, { backgroundColor: action.iconBg }]}>
                                    {action.icon(action.iconColor)}
                                </View>
                                <View style={styles.textWrap}>
                                    <Text style={[styles.actionLabel, action.type === 'danger' && styles.dangerLabel]}>{action.label}</Text>
                                    {action.sub && <Text style={[styles.actionSub, action.type === 'danger' && styles.dangerSub]}>{action.sub}</Text>}
                                </View>
                                <View style={styles.arrowIcon}><Svg width="14" height="14" viewBox="0 0 14 14"><Path d="M5 3l4 4-4 4" stroke="#C8C5C0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg></View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.cancelBtn} onPress={hideSheet}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,25,23,0.5)' },
    sheet: { backgroundColor: 'white', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 40, width: '100%', maxHeight: SCREEN_HEIGHT * 0.8 },
    handle: { width: 36, height: 4, backgroundColor: '#D8D4CE', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
    header: { paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#D8D4CE', paddingBottom: 14 },
    projRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    projIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#1A1917', alignItems: 'center', justifyContent: 'center' },
    projName: { fontSize: 14, fontWeight: '600', color: '#1A1917' },
    projMeta: { fontSize: 11, color: '#8A8783', marginTop: 1 },
    actions: { paddingHorizontal: 14, paddingTop: 8 },
    actionItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: '#D8D4CE' },
    iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    textWrap: { flex: 1 },
    actionLabel: { fontSize: 14, color: '#1A1917', fontWeight: '500' },
    actionSub: { fontSize: 11, color: '#8A8783', marginTop: 1 },
    dangerLabel: { color: '#D95555' },
    dangerSub: { color: 'rgba(217,85,85,0.6)' },
    arrowIcon: { width: 14, height: 14 },
    cancelBtn: { marginHorizontal: 14, marginTop: 8, padding: 14, borderRadius: 14, backgroundColor: '#F0EDE8', borderWidth: 1, borderColor: '#D8D4CE', alignItems: 'center' },
    cancelText: { fontSize: 14, color: '#1A1917', fontWeight: '600' },
});
