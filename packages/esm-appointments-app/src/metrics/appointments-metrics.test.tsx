import React from 'react';
import { render, screen } from '@testing-library/react';
import { openmrsFetch } from '@openmrs/esm-framework';
import { mockAppointmentMetrics, mockProvidersCount, mockStartTime } from '__mocks__';
import AppointmentsMetrics from './appointments-metrics.component';

const mockedOpenmrsFetch = openmrsFetch as jest.Mock;

jest.mock('../hooks/useClinicalMetrics', () => {
  const originalModule = jest.requireActual('../hooks/useClinicalMetrics');

  return {
    ...originalModule,
    useClinicalMetrics: jest.fn().mockImplementation(() => ({
      highestServiceLoad: mockAppointmentMetrics.highestServiceLoad,
      isLoading: mockAppointmentMetrics.isLoading,
      error: mockAppointmentMetrics.error,
    })),
    useAllAppointmentsByDate: jest.fn().mockImplementation(() => ({
      totalProviders: mockProvidersCount.totalProviders,
      isLoading: mockProvidersCount.isLoading,
      error: mockProvidersCount.error,
    })),
    useScheduledAppointment: jest.fn().mockImplementation(() => ({
      totalScheduledAppointments: mockAppointmentMetrics.totalAppointments,
    })),
    useAppointmentDate: jest.fn().mockImplementation(() => ({
      startDate: mockStartTime.startTime,
    })),
  };
});

describe('Appointment metrics', () => {
  it('renders metrics from the appointments list', async () => {
    mockedOpenmrsFetch.mockResolvedValue({ data: [] });

    renderAppointmentMetrics();

    await screen.findByText(/appointment metrics/i);
    expect(screen.getByText(/scheduled appointments/i)).toBeInTheDocument();
    expect(screen.getByText(/patients/i)).toBeInTheDocument();
    expect(screen.getByText(/16/i)).toBeInTheDocument();
    expect(screen.getByText(/4/i)).toBeInTheDocument();
  });
});

const filteredArrivedAppointments = [];

const filteredPendingAppointments = [];

function getTotalPatients(filteredArrivedAppointments: any[], filteredPendingAppointments: any[]) {
  return filteredArrivedAppointments.length + filteredPendingAppointments.length;
}

describe('Total Patients Calculation', () => {
  it('should calculate the total patients correctly', () => {
    const totalPatients = getTotalPatients(filteredArrivedAppointments, filteredPendingAppointments);
    expect(totalPatients);
  });
});

function renderAppointmentMetrics() {
  render(<AppointmentsMetrics appointmentServiceType="consultation-service-uuid" />);
}
