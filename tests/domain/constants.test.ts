/**
 * Constants & Display Names Tests
 *
 * Tests for display name maps and badge variant helpers.
 * Run with: npx vitest run tests/domain/constants.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  MACHINE_STATUS_DISPLAY,
  WORK_ORDER_STATUS_DISPLAY,
  WORK_ORDER_TYPE_DISPLAY,
  WORK_ORDER_PRIORITY_DISPLAY,
  DOCUMENT_TYPE_DISPLAY,
} from '@manuraj/domain';
import {
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
  getMachineStatusBadgeVariant,
} from '@manuraj/pitkit';

describe('Display Name Maps', () => {
  describe('MACHINE_STATUS_DISPLAY', () => {
    it('should map all machine statuses to Portuguese', () => {
      expect(MACHINE_STATUS_DISPLAY['operational']).toBe('Operacional');
      expect(MACHINE_STATUS_DISPLAY['maintenance']).toBe('Em Manutenção');
      expect(MACHINE_STATUS_DISPLAY['stopped']).toBe('Parada');
      expect(MACHINE_STATUS_DISPLAY['decommissioned']).toBe('Desativada');
    });

    it('should have exactly 4 statuses', () => {
      expect(Object.keys(MACHINE_STATUS_DISPLAY)).toHaveLength(4);
    });
  });

  describe('WORK_ORDER_STATUS_DISPLAY', () => {
    it('should map all work order statuses to Portuguese', () => {
      expect(WORK_ORDER_STATUS_DISPLAY['open']).toBe('Aberta');
      expect(WORK_ORDER_STATUS_DISPLAY['assigned']).toBe('Atribuída');
      expect(WORK_ORDER_STATUS_DISPLAY['in_progress']).toBe('Em Andamento');
      expect(WORK_ORDER_STATUS_DISPLAY['completed']).toBe('Concluída');
      expect(WORK_ORDER_STATUS_DISPLAY['cancelled']).toBe('Cancelada');
    });

    it('should have exactly 5 statuses', () => {
      expect(Object.keys(WORK_ORDER_STATUS_DISPLAY)).toHaveLength(5);
    });
  });

  describe('WORK_ORDER_TYPE_DISPLAY', () => {
    it('should map all work order types to Portuguese', () => {
      expect(WORK_ORDER_TYPE_DISPLAY['corrective']).toBe('Corretiva');
      expect(WORK_ORDER_TYPE_DISPLAY['preventive']).toBe('Preventiva');
      expect(WORK_ORDER_TYPE_DISPLAY['request']).toBe('Solicitação');
    });

    it('should have exactly 3 types', () => {
      expect(Object.keys(WORK_ORDER_TYPE_DISPLAY)).toHaveLength(3);
    });
  });

  describe('WORK_ORDER_PRIORITY_DISPLAY', () => {
    it('should map all priorities to Portuguese', () => {
      expect(WORK_ORDER_PRIORITY_DISPLAY['low']).toBe('Baixa');
      expect(WORK_ORDER_PRIORITY_DISPLAY['medium']).toBe('Média');
      expect(WORK_ORDER_PRIORITY_DISPLAY['high']).toBe('Alta');
      expect(WORK_ORDER_PRIORITY_DISPLAY['critical']).toBe('Crítica');
    });

    it('should have exactly 4 priorities', () => {
      expect(Object.keys(WORK_ORDER_PRIORITY_DISPLAY)).toHaveLength(4);
    });
  });

  describe('DOCUMENT_TYPE_DISPLAY', () => {
    it('should map all document types to Portuguese', () => {
      expect(DOCUMENT_TYPE_DISPLAY['manual']).toBe('Manual');
      expect(DOCUMENT_TYPE_DISPLAY['drawing']).toBe('Desenho');
      expect(DOCUMENT_TYPE_DISPLAY['certificate']).toBe('Certificado');
      expect(DOCUMENT_TYPE_DISPLAY['photo']).toBe('Foto');
      expect(DOCUMENT_TYPE_DISPLAY['other']).toBe('Outro');
    });

    it('should have exactly 5 types', () => {
      expect(Object.keys(DOCUMENT_TYPE_DISPLAY)).toHaveLength(5);
    });
  });
});

describe('Badge Variant Helpers', () => {
  describe('getStatusBadgeVariant', () => {
    it('should return correct variant for each work order status', () => {
      expect(getStatusBadgeVariant('open')).toBe('info');
      expect(getStatusBadgeVariant('assigned')).toBe('primary');
      expect(getStatusBadgeVariant('in_progress')).toBe('warning');
      expect(getStatusBadgeVariant('completed')).toBe('success');
      expect(getStatusBadgeVariant('cancelled')).toBe('danger');
    });

    it('should return default for unknown status', () => {
      expect(getStatusBadgeVariant('unknown')).toBe('default');
    });
  });

  describe('getPriorityBadgeVariant', () => {
    it('should return correct variant for each priority', () => {
      expect(getPriorityBadgeVariant('low')).toBe('default');
      expect(getPriorityBadgeVariant('medium')).toBe('info');
      expect(getPriorityBadgeVariant('high')).toBe('warning');
      expect(getPriorityBadgeVariant('critical')).toBe('danger');
    });

    it('should return default for unknown priority', () => {
      expect(getPriorityBadgeVariant('unknown')).toBe('default');
    });
  });

  describe('getMachineStatusBadgeVariant', () => {
    it('should return correct variant for each machine status', () => {
      expect(getMachineStatusBadgeVariant('operational')).toBe('success');
      expect(getMachineStatusBadgeVariant('maintenance')).toBe('warning');
      expect(getMachineStatusBadgeVariant('stopped')).toBe('danger');
      expect(getMachineStatusBadgeVariant('decommissioned')).toBe('default');
    });

    it('should return default for unknown status', () => {
      expect(getMachineStatusBadgeVariant('unknown')).toBe('default');
    });
  });
});
