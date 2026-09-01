/**
 * Feature: Laboratory — HomeScreen (theme-aware + responsive)
 *
 * @description Tela principal com:
 * - ThemeToggle no header
 * - Filtros de categoria responsivos
 * - FlatList de laboratórios com tema dinâmico
 * - useWindowDimensions para reatividade a rotações de tela
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LabCard } from '../components/LabCard';
import { LoadingOverlay } from '../../../shared/components/LoadingOverlay';
import { ErrorState } from '../../../shared/components/ErrorState';
import { ThemeToggle } from '../../../shared/components/ThemeToggle';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { rs, rh } from '../../../shared/utils/responsive';
import { LaboratoryRepositoryImpl } from '../../../data/repositories/LaboratoryRepositoryImpl';
import { GetLaboratoriesUseCase } from '../../../domain/usecases/LaboratoryUseCases';
import type { Laboratory, LaboratoryCategory } from '../../../domain/entities/Laboratory';
import type { RootStackParamList } from '../../../navigation/types';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const labRepo        = new LaboratoryRepositoryImpl();
const getLaboratories = new GetLaboratoriesUseCase(labRepo);

const CATEGORIES: { key: LaboratoryCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all',         label: 'Todos',     icon: '🔬' },
  { key: 'chemistry',   label: 'Química',   icon: '⚗️' },
  { key: 'biology',     label: 'Biologia',  icon: '🧬' },
  { key: 'physics',     label: 'Física',    icon: '⚡' },
  { key: 'electronics', label: 'Elétrica',  icon: '🔌' },
  { key: 'mechanics',   label: 'Mecânica',  icon: '⚙️' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const { theme, isDark }   = useTheme();
  const { width }           = useWindowDimensions(); // reativo a rotação

  const [labs, setLabs]             = useState<Laboratory[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<LaboratoryCategory | 'all'>('all');

  const c = theme.colors;
  const t = theme.typography;
  const s = theme.spacing;
  const r = theme.radius;

  const fetchLabs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getLaboratories.execute(
        activeCategory === 'all' ? undefined : activeCategory,
      );
      setLabs(result);
    } catch {
      setError('Não foi possível carregar os laboratórios. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => { fetchLabs(); }, [fetchLabs]);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg.primary }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={c.bg.primary}
      />
      <SafeAreaView style={{ flex: 1 }}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <View
          style={{
            flexDirection:  'row',
            alignItems:     'center',
            justifyContent: 'space-between',
            paddingHorizontal: s.base,
            paddingTop:     s.base,
            paddingBottom:  s.sm,
          }}
        >
          <View>
            <Text style={{ color: c.text.tertiary, fontSize: t.size.sm, fontWeight: '500' }}>
              Bem-vindo ao
            </Text>
            <Text style={{ color: c.text.primary, fontSize: t.size['2xl'], fontWeight: '800', letterSpacing: -0.5 }}>
              AR Lab 🔬
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: s.sm }}>
            {/* Badge ODS */}
            <View style={{ backgroundColor: c.brand.glow, borderWidth: 1, borderColor: c.border.accent, borderRadius: r.md, paddingHorizontal: s.sm, paddingVertical: rs(4) }}>
              <Text style={{ color: c.brand.accent, fontSize: t.size.xs, fontWeight: '700', letterSpacing: 0.5 }}>
                ODS 4
              </Text>
            </View>
            {/* Toggle de tema */}
            <ThemeToggle />
          </View>
        </View>

        {/* ── Hero Banner ──────────────────────────────────────────── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems:    'center',
            margin:        s.base,
            backgroundColor: c.bg.secondary,
            borderRadius:  r['2xl'],
            padding:       s.base,
            gap:           s.md,
            borderWidth:   1,
            borderColor:   c.border.medium,
            ...theme.shadows.card,
          }}
        >
          <Text style={{ fontSize: rs(48) }}>🧪</Text>
          <View style={{ flex: 1, gap: rs(4) }}>
            <Text style={{ color: c.text.primary, fontSize: t.size.md, fontWeight: '700' }}>
              Laboratório em RA
            </Text>
            <Text style={{ color: c.text.secondary, fontSize: t.size.sm, lineHeight: t.size.sm * 1.6 }}>
              Explore modelos 3D educacionais diretamente no ambiente físico com sua câmera.
            </Text>
          </View>
        </View>

        {/* ── Filtros de Categoria ─────────────────────────────────── */}
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingHorizontal: s.base, gap: s.sm, paddingBottom: s.sm }}
          renderItem={({ item }) => {
            const isActive = activeCategory === item.key;
            return (
              <TouchableOpacity
                style={{
                  flexDirection:    'row',
                  alignItems:       'center',
                  gap:              s.xs,
                  paddingHorizontal: s.md,
                  paddingVertical:  s.sm,
                  borderRadius:     r.full,
                  backgroundColor:  isActive ? c.brand.glow : c.bg.secondary,
                  borderWidth:      1,
                  borderColor:      isActive ? c.border.accent : c.border.subtle,
                }}
                onPress={() => setActiveCategory(item.key)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: rs(14) }}>{item.icon}</Text>
                <Text
                  style={{
                    fontSize:   t.size.sm,
                    fontWeight: isActive ? '700' : '500',
                    color:      isActive ? c.brand.accent : c.text.secondary,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* ── Cabeçalho da seção ───────────────────────────────────── */}
        <View
          style={{
            flexDirection:  'row',
            alignItems:     'center',
            justifyContent: 'space-between',
            paddingHorizontal: s.base,
            paddingVertical:   s.sm,
          }}
        >
          <Text style={{ color: c.text.primary, fontSize: t.size.base, fontWeight: '700' }}>
            Laboratórios disponíveis
          </Text>
          <Text style={{ color: c.text.tertiary, fontSize: t.size.sm }}>
            {labs.length} módulos
          </Text>
        </View>

        {/* ── Lista / Loading / Erro ───────────────────────────────── */}
        {loading ? (
          <LoadingOverlay
            message="Carregando laboratórios..."
            subMessage="Preparando conteúdo educacional"
          />
        ) : error ? (
          <ErrorState message={error} icon="📡" actionLabel="Recarregar" onAction={fetchLabs} />
        ) : (
          <FlatList
            data={labs}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: rh(40) }}
            renderItem={({ item }) => (
              <LabCard
                lab={item}
                onPress={(lab) => navigation.navigate('LabDetail', { labId: lab.id, labName: lab.name })}
                onARPress={(lab) => navigation.navigate('ARViewer', { labId: lab.id, labName: lab.name })}
              />
            )}
            ListEmptyComponent={
              <ErrorState
                title="Nenhum laboratório encontrado"
                message="Não há módulos disponíveis nesta categoria."
                icon="📭"
              />
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
};
