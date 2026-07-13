// components/StatisticsCard.jsx

import React, { useMemo } from "react";

const formatearNumero = (valor) => {
    if (!valor) return "";

    return valor
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const VIEW_TYPES = {
    MONTH: "month",
    WEEK: "week",
    FORTNIGHT: "fortnight",
};

function StatisticsCard({
    viewType,
    days,
    ingresos,
    user,

}) {

    const metaPeriodo = useMemo(() => {
        const metaSemanal =
            Number(user?.meta || 0);

        if (viewType === VIEW_TYPES.WEEK) {
            return metaSemanal;
        }

        if (
            viewType ===
            VIEW_TYPES.FORTNIGHT
        ) {
            return metaSemanal * 2;
        }

        if (viewType === VIEW_TYPES.MONTH) {
            const semanas = Math.ceil(
                days.filter(Boolean).length / 7
            );

            return metaSemanal * semanas;
        }

        return metaSemanal;
    }, [
        user?.meta,
        viewType,
        days,
    ]);

    const totalPeriodo =
        useMemo(() => {
            return Object.values(
                ingresos
            ).reduce(
                (total, ingreso) =>
                    total +
                    (ingreso.netoTotal || 0),
                0
            );
        }, [ingresos]);

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    const validDays =
        days.filter(Boolean);

    const ultimoDia =
        validDays[
        validDays.length - 1
        ] || null;

    const periodoFinalizado =
        ultimoDia &&
        ultimoDia < hoy;

    const porcentaje =
        metaPeriodo > 0
            ? Math.min(
                (totalPeriodo /
                    metaPeriodo) *
                100,
                100
            )
            : 0;

    const metaCompletada =
        totalPeriodo >= metaPeriodo;

    const dineroExtra =
        totalPeriodo - metaPeriodo;

    const dineroFaltante =
        metaPeriodo - totalPeriodo;

    const nombrePeriodo = {
        [VIEW_TYPES.WEEK]: "semana",
        [VIEW_TYPES.FORTNIGHT]:
            "quincena",
        [VIEW_TYPES.MONTH]: "mes",
    };


    const periodoFallido =
        periodoFinalizado &&
        !metaCompletada;

    const obtenerMensajeMeta = () => {
        const periodo =
            nombrePeriodo[viewType];

        const porcentajeFaltante =
            Math.max(
                100 - porcentaje,
                0
            );

        if (metaCompletada) {
            if (dineroExtra > 0) {
                return `¡Excelente! En este ${periodo} completaste tu meta y además generaste $${formatearNumero(
                    dineroExtra
                )} extra.`;
            }

            return `¡Excelente! En este ${periodo} completaste tu meta exitosamente.`;
        }

        // El período ya terminó
        if (periodoFinalizado) {
            return `En este ${periodo} te quedaste a ${porcentajeFaltante.toFixed(
                0
            )}% y $${formatearNumero(
                dineroFaltante
            )} de completar tu meta.`;
        }

        // El período sigue en curso
        return `En este ${periodo} llevas ${porcentaje.toFixed(
            0
        )}% de tu meta y te faltan $${formatearNumero(
            dineroFaltante
        )} para alcanzarla.`;
    };

    const obtenerColoresBarra = () => {
        if (metaCompletada) {
            return {
                progreso: "#4CAF50",
                fondo: "#E8F5E9",
            };
        }

        if (periodoFallido) {
            return {
                progreso: "#f44336",
                fondo: "#fe96a1",
            };
        }

        return {
            progreso: "#2d79f3",
            fondo: "#E3F2FD",
        };
    };

    const coloresBarra =
        obtenerColoresBarra();

    return (
        <div className="meta-container">
            <div className="meta-title">
                <h3>Estadísticas</h3>
            </div>

            <div className="meta-porcentaje">
                {obtenerMensajeMeta()}
            </div>

            <div
                className="meta-barra"
                style={{
                    backgroundColor:
                        coloresBarra.fondo,
                }}
            >
                <div
                    className="meta-barra-progreso"
                    style={{
                        width: `${Math.min(
                            porcentaje,
                            100
                        )}%`,
                        backgroundColor:
                            coloresBarra.progreso,
                    }}
                />
            </div>

            <div className="meta-valores">
                $
                {formatearNumero(
                    totalPeriodo
                )}
                {" / "}
                $
                {formatearNumero(
                    metaPeriodo
                )}
            </div>
        </div>
    );
}

export default StatisticsCard;