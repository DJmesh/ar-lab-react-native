/**
 * Feature: Laboratory — HomeScreen (Kids AR & Responsive Theme-Aware)
 *
 * @description Tela principal do AR World Kids com:
 * - Proteção completa contra colisões na Status Bar (insets.top)
 * - Filtros de categoria responsivos (Matemática, Geografia, Português, etc.)
 * - Experiência imersiva estilo Pokémon GO
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  { key: 'all',        label: 'Todos',       icon: '🌟' },
  { key: 'math',       label: 'Matemática',  icon: '🔢' },
  { key: 'geography',  label: 'Geografia',   icon: '🌍' },
  { key: 'portuguese', label: 'Português',   icon: '🔤' },
  { key: 'chemistry',  label: 'Química',     icon: '⚗️' },
  { key: 'biology',    label: 'Biologia',    icon: '🧬' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const insets     = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

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
      setError('Não foi possível carregar os módulos de aprendizado.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => { fetchLabs(); }, [fetchLabs]);

  // Garantir espaço de segurança no topo (Status Bar / Relógio / Notificações)
  const topPadding = Math.max(insets.top + rs(8), rs(38));
  // Garantir espaço de segurança na parte inferior (Barra de Gestos / Navegação)
  const bottomPadding = Math.max(insets.bottom + rh(24), rh(32));

  return (
    <View style={{ flex: 1, backgroundColor: c.bg.primary }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* ── Header Protegido contra Status Bar ───────────────────── */}
      <View
        style={{
          flexDirection:     'row',
          alignItems:        'center',
          justifyContent:    'space-between',
          paddingHorizontal: s.base,
          paddingTop:        topPadding,
          paddingBottom:     s.xs,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.text.tertiary, fontSize: t.size.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Aprendizado em RA
          </Text>
          <Text style={{ color: c.text.primary, fontSize: t.size['2xl'], fontWeight: '800', letterSpacing: -0.5 }}>
            AR World Kids 🌟
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: s.sm }}>
          <View style={{ backgroundColor: c.brand.glow, borderWidth: 1, borderColor: c.border.accent, borderRadius: r.md, paddingHorizontal: s.sm, paddingVertical: rs(4) }}>
            <Text style={{ color: c.brand.accent, fontSize: t.size.xs, fontWeight: '700' }}>
              Pré-zinho 🎈
            </Text>
          </View>
          <ThemeToggle />
        </View>
      </View>

      {/* ── Hero Banner estilo Pokémon GO ──────────────────────── */}
      <View
        style={{
          flexDirection:   'row',
          alignItems:      'center',
          marginHorizontal: s.base,
          marginVertical:  s.xs,
          backgroundColor: c.bg.secondary,
          borderRadius:    r['2xl'],
          padding:         s.base,
          gap:             s.md,
          borderWidth:     1,
          borderColor:     c.border.accent,
          ...theme.shadows.card,
        }}
      >
        <Text style={{ fontSize: rs(40) }}>🎮</Text>
        <View style={{ flex: 1, gap: rs(2) }}>
          <Text style={{ color: c.text.primary, fontSize: t.size.md, fontWeight: '700' }}>
            RA estilo Pokémon GO!
          </Text>
          <Text style={{ color: c.text.secondary, fontSize: t.size.xs, lineHeight: t.size.xs * 1.5 }}>
            Aponte a câmera para o chão ou mesa para explorar cenários 3D de Matemática, Geografia e Português!
          </Text>
        </View>
      </View>

      {/* ── Filtros de Categoria (Chips Responsivos) ──────────────── */}
      <View style={{ height: rs(48), marginVertical: s.xs }}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingHorizontal: s.base, alignItems: 'center', gap: s.xs }}
          renderItem={({ item }) => {
            const isActive = activeCategory === item.key;
            return (
              <TouchableOpacity
                style={{
                  flexDirection:     'row',
                  alignItems:        'center',
                  gap:               rs(6),
                  paddingHorizontal: rs(14),
                  paddingVertical:   rs(8),
                  borderRadius:      r.full,
                  backgroundColor:   isActive ? c.brand.primary : c.bg.secondary,
                  borderWidth:       1,
                  borderColor:       isActive ? c.brand.primary : c.border.subtle,
                }}
                onPress={() => setActiveCategory(item.key)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: rs(15) }}>{item.icon}</Text>
                <Text
                  style={{
                    fontSize:   t.size.sm,
                    fontWeight: isActive ? '700' : '600',
                    color:      isActive ? c.text.onBrand : c.text.secondary,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* ── Seção Header ─────────────────────────────────────────── */}
      <View
        style={{
          flexDirection:     'row',
          alignItems:        'center',
          justifyContent:    'space-between',
          paddingHorizontal: s.base,
          paddingVertical:   s.xs,
        }}
      >
        <Text style={{ color: c.text.primary, fontSize: t.size.base, fontWeight: '700' }}>
          Módulos Interativos 3D
        </Text>
        <Text style={{ color: c.text.tertiary, fontSize: t.size.xs }}>
          {labs.length} opções
        </Text>
      </View>

      {/* ── Lista de Módulos ────────────────────────────────────── */}
      {loading ? (
        <LoadingOverlay
          message="Carregando mundos 3D..."
          subMessage="Preparando experiências interativas"
        />
      ) : error ? (
        <ErrorState message={error} icon="📡" actionLabel="Recarregar" onAction={fetchLabs} />
      ) : (
        <FlatList
          data={labs}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingBottom: bottomPadding }}
          renderItem={({ item }) => (
            <LabCard
              lab={item}
              onPress={(lab) => navigation.navigate('LabDetail', { labId: lab.id, labName: lab.name })}
              onARPress={(lab) => navigation.navigate('ARViewer', { labId: lab.id, labName: lab.name })}
            />
          )}
          ListEmptyComponent={
            <ErrorState
              title="Nenhum módulo encontrado"
              message="Não há aulas disponíveis nesta categoria."
              icon="📭"
            />
          }
        />
      )}
    </View>
  );
};
