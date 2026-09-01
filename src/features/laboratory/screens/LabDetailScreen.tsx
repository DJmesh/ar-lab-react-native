/**
 * Feature: Laboratory — LabDetailScreen (theme-aware + responsive)
 */
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CategoryBadge, DifficultyBadge } from '../../../shared/components/Badge';
import { LoadingOverlay } from '../../../shared/components/LoadingOverlay';
import { ErrorState } from '../../../shared/components/ErrorState';
import { ThemeToggle } from '../../../shared/components/ThemeToggle';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { rs, rh } from '../../../shared/utils/responsive';
import { LaboratoryRepositoryImpl } from '../../../data/repositories/LaboratoryRepositoryImpl';
import type { Laboratory, LaboratoryStep } from '../../../domain/entities/Laboratory';
import type { RootStackParamList } from '../../../navigation/types';

type LabDetailRoute = RouteProp<RootStackParamList, 'LabDetail'>;
type LabDetailNav   = NativeStackNavigationProp<RootStackParamList, 'LabDetail'>;

const labRepo = new LaboratoryRepositoryImpl();

export const LabDetailScreen: React.FC = () => {
  const navigation = useNavigation<LabDetailNav>();
  const route      = useRoute<LabDetailRoute>();
  const { labId }  = route.params;
  const { theme, isDark } = useTheme();

  const [lab,   setLab]   = useState<Laboratory | null>(null);
  const [steps, setSteps] = useState<LaboratoryStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const c = theme.colors;
  const t = theme.typography;
  const s = theme.spacing;
  const r = theme.radius;

  useEffect(() => {
    (async () => {
      try {
        const [labData, stepsData] = await Promise.all([
          labRepo.findById(labId),
          labRepo.getSteps(labId),
        ]);
        if (!labData) throw new Error('Laboratório não encontrado');
        setLab(labData);
        setSteps(stepsData);
      } catch (e: any) {
        setError(e.message ?? 'Erro ao carregar');
      } finally {
        setLoading(false);
      }
    })();
  }, [labId]);

  if (loading) return <LoadingOverlay variant="fullscreen" message="Carregando laboratório..." />;
  if (error || !lab)
    return (
      <ErrorState
        message={error ?? 'Não encontrado.'}
        onAction={() => navigation.goBack()}
        actionLabel="Voltar"
      />
    );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg.primary }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={c.bg.primary} />
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: s.base, paddingVertical: s.md,
        }}>
          <TouchableOpacity
            style={{ width: rs(40), height: rs(40), borderRadius: r.full, backgroundColor: c.bg.secondary, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: c.text.primary, fontSize: rs(20), fontWeight: '600' }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: c.text.primary, fontSize: t.size.base, fontWeight: '700' }}>
            Detalhes
          </Text>
          <ThemeToggle />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: s.base, gap: s.lg }}>

          {/* Hero */}
          <View style={{ alignItems: 'center', gap: s.sm }}>
            <Text style={{ fontSize: rs(72), marginBottom: s.sm }}>🔬</Text>
            <View style={{ flexDirection: 'row', gap: s.sm }}>
              <CategoryBadge category={lab.category} />
              <DifficultyBadge level={lab.difficulty} />
            </View>
            <Text style={{ color: c.text.primary, fontSize: t.size.xl, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 }}>
              {lab.name}
            </Text>
            <Text style={{ color: c.text.secondary, fontSize: t.size.base, textAlign: 'center', lineHeight: t.size.base * 1.5, maxWidth: rs(320) }}>
              {lab.description}
            </Text>

            {/* Meta info */}
            <View style={{
              flexDirection: 'row', gap: s.lg,
              padding: s.base, backgroundColor: c.bg.secondary,
              borderRadius: r.xl, borderWidth: 1, borderColor: c.border.subtle,
              marginTop: s.sm, ...theme.shadows.card,
            }}>
              {[
                { icon: '⏱', label: `${lab.estimatedDuration} min` },
                { icon: '📋', label: `${steps.length} etapas` },
                ...(lab.arMarkerId ? [{ icon: '🔮', label: 'RA ativo', accent: true }] : []),
              ].map(({ icon, label, accent }) => (
                <View key={label} style={{ alignItems: 'center', gap: rs(4) }}>
                  <Text style={{ fontSize: rs(18) }}>{icon}</Text>
                  <Text style={{ color: accent ? c.brand.accent : c.text.secondary, fontSize: t.size.sm, fontWeight: '600' }}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Etapas */}
          {steps.length > 0 && (
            <View style={{ gap: s.sm }}>
              <Text style={{ color: c.text.primary, fontSize: t.size.md, fontWeight: '700', marginBottom: s.sm }}>
                Roteiro do laboratório
              </Text>
              {steps.map((step, idx) => (
                <View
                  key={step.id}
                  style={{
                    flexDirection: 'row', gap: s.md,
                    backgroundColor: c.bg.secondary, borderRadius: r.xl,
                    padding: s.base, borderWidth: 1, borderColor: c.border.subtle,
                    ...theme.shadows.card,
                  }}
                >
                  <View style={{ width: rs(32), height: rs(32), borderRadius: rs(16), backgroundColor: c.brand.primary, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: c.text.onBrand, fontSize: t.size.sm, fontWeight: '800' }}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1, gap: s.xs }}>
                    <Text style={{ color: c.text.primary, fontSize: t.size.base, fontWeight: '700' }}>
                      {step.title}
                    </Text>
                    <Text style={{ color: c.text.secondary, fontSize: t.size.sm, lineHeight: t.size.sm * 1.6 }}>
                      {step.description}
                    </Text>
                    {step.safetyWarning && (
                      <View style={{ flexDirection: 'row', gap: s.sm, backgroundColor: c.semantic.warningBg, borderRadius: r.md, padding: s.sm, marginTop: s.xs, borderWidth: 1, borderColor: `${c.semantic.warning}40` }}>
                        <Text style={{ fontSize: rs(14) }}>⚠️</Text>
                        <Text style={{ color: c.semantic.warning, fontSize: t.size.sm, flex: 1 }}>
                          {step.safetyWarning}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Botão de RA */}
          {lab.arMarkerId && (
            <TouchableOpacity
              style={{
                flexDirection: 'row', alignItems: 'center', gap: s.md,
                backgroundColor: c.brand.glow, borderRadius: r['2xl'],
                padding: s.lg, borderWidth: 1, borderColor: c.border.accent,
                marginBottom: rh(40), ...theme.shadows.glow,
              }}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('ARViewer', { labId: lab.id, labName: lab.name })}
            >
              <Text style={{ fontSize: rs(40) }}>🔮</Text>
              <View>
                <Text style={{ color: c.text.primary, fontSize: t.size.base, fontWeight: '700' }}>
                  Visualizar em Realidade Aumentada
                </Text>
                <Text style={{ color: c.text.secondary, fontSize: t.size.sm, marginTop: rs(2) }}>
                  Aponte a câmera para o marcador do roteiro
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
