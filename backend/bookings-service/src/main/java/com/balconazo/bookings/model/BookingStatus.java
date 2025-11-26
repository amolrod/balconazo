package com.balconazo.bookings.model;

public enum BookingStatus {
    PENDING,     // Reserva pendiente de confirmación
    CONFIRMED,   // Reserva confirmada
    CANCELLED,   // Reserva cancelada
    COMPLETED    // Reserva completada (fecha pasada)
}
