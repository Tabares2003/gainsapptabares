// components/StatisticsCard.jsx
import { MdOutlineQueryStats } from "react-icons/md";
import React, { useMemo } from "react";
import { LiaMedalSolid } from "react-icons/lia";

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

const formatearFechaFirestore = (fecha) => {
    const year = fecha.getFullYear();

    const month = String(
        fecha.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        fecha.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
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

    const diasTrabajados =
        Object.values(ingresos).filter(
            (ingreso) =>
                Number(ingreso.netoTotal) > 0
        ).length;

    const obtenerDiasObligatorios = () => {
        const diasLaborales =
            Number(
                user?.diaslaborales || 0
            );

        // Semana
        if (
            viewType ===
            VIEW_TYPES.WEEK
        ) {
            return diasLaborales;
        }

        // Quincena
        if (
            viewType ===
            VIEW_TYPES.FORTNIGHT
        ) {
            return Math.round(
                diasLaborales * 2
            );
        }

        // Mes
        if (
            viewType ===
            VIEW_TYPES.MONTH
        ) {
            const diasDelMes =
                days.filter(Boolean)
                    .length;

            return Math.round(
                (diasLaborales / 7) *
                diasDelMes
            );
        }

        return diasLaborales;
    };

    const diasObligatorios =
        obtenerDiasObligatorios();

    const diasFaltantes =
        Math.max(
            diasObligatorios -
            diasTrabajados,
            0
        );

    const diasExtra =
        Math.max(
            diasTrabajados -
            diasObligatorios,
            0
        );

    const porcentajeDias =
        diasObligatorios > 0
            ? Math.min(
                (diasTrabajados /
                    diasObligatorios) *
                100,
                100
            )
            : 0;

    const diasCumplidos =
        diasTrabajados >=
        diasObligatorios;


    const obtenerMensajeDias = () => {
        const periodo =
            nombrePeriodo[viewType];

        if (diasCumplidos) {
            if (diasExtra > 0) {
                return `¡Excelente! En esta ${periodo} trabajaste ${diasExtra} día${diasExtra > 1
                    ? "s"
                    : ""
                    } adicional${diasExtra > 1
                        ? "es"
                        : ""
                    } a tu objetivo.`;
            }

            return `¡Excelente! Cumpliste tu objetivo de días laborados para esta ${periodo}.`;
        }

        if (periodoFinalizado) {
            return `En esta ${periodo} te faltó trabajar ${diasFaltantes} día${diasFaltantes > 1
                ? "s"
                : ""
                } para cumplir tu objetivo.`;
        }

        return `Has trabajado ${diasTrabajados} de ${diasObligatorios} días planeados para esta ${periodo}.`;
    };

    const obtenerColoresDias = () => {
        if (diasCumplidos) {
            return {
                progreso: "#4CAF50",
                fondo: "#E8F5E9",
            };
        }

        if (periodoFinalizado) {
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

    const coloresDias =
        obtenerColoresDias();


    /**estadistica 3 */


    const metaSemanal =
        Number(user?.meta || 0);

    const diasLaborales =
        Number(
            user?.diaslaborales || 1
        );

    const dineroRestanteSemana =
        Math.max(
            metaSemanal -
            totalPeriodo,
            0
        );

    let diaSemana =
        new Date().getDay();

    if (diaSemana === 0) {
        diaSemana = 7;
    }

    const diasRestantes =
        Math.max(
            diasLaborales -
            (diaSemana - 1),
            1
        );



    const fechaHoy =
        formatearFechaFirestore(
            new Date()
        );

    const dineroHoy =
        ingresos[fechaHoy]
            ?.netoTotal || 0;


    const dineroRestanteSinHoy =
        Math.max(
            metaSemanal -
            (totalPeriodo - dineroHoy),
            0
        );

    const diasRestantesSinHoy =
        Math.max(
            diasRestantes,
            1
        );

    const metaDiariaActual =
        dineroRestanteSinHoy /
        diasRestantesSinHoy;

    const porcentajeDiario =
        metaDiariaActual > 0
            ? Math.min(
                (dineroHoy /
                    metaDiariaActual) *
                100,
                100
            )
            : 100;

    const objetivoDiarioCumplido =
        dineroHoy >=
        metaDiariaActual;

    const dineroFaltanteHoy = Math?.max(
        metaDiariaActual - dineroHoy,
        0
    );

    const dineroExtraHoy = Math?.max(
        dineroHoy - metaDiariaActual,
        0
    );

    const obtenerMensajeDiario =
        () => {
            if (
                totalPeriodo >=
                metaSemanal
            ) {
                return `¡Excelente! Ya cumpliste tu meta semanal.`;
            }

            if (objetivoDiarioCumplido) {
                if (dineroExtraHoy > 0) {
                    return `¡Excelente! Cumpliste tu objetivo de hoy y además generaste $${formatearNumero(
                        Math.round(dineroExtraHoy)
                    )} extra para alcanzar tu meta semanal.`;
                }

                return `¡Excelente! Cumpliste tu objetivo de hoy.`;
            }

            if (dineroHoy === 0) {
                return `Necesitas generar $${formatearNumero(
                    Math.round(metaDiariaActual)
                )} hoy para alcanzar tu meta semanal.`;
            }

            return `Te faltan $${formatearNumero(
                Math.round(dineroFaltanteHoy)
            )} para completar tu objetivo de hoy y alcanzar tu meta semanal.`;


        };

    const obtenerColoresDiario =
        () => {
            if (
                totalPeriodo >=
                metaSemanal
            ) {
                return {
                    progreso:
                        "#4CAF50",
                    fondo:
                        "#E8F5E9",
                };
            }

            if (
                objetivoDiarioCumplido
            ) {
                return {
                    progreso:
                        "#4CAF50",
                    fondo:
                        "#E8F5E9",
                };
            }

            return {
                progreso:
                    "#2d79f3",
                fondo:
                    "#E3F2FD",
            };
        };

    const coloresDiario =
        obtenerColoresDiario();

    const mostrarObjetivoDiario =
        viewType ===
        VIEW_TYPES.WEEK &&
        !periodoFinalizado;

    return (
        <div className="statistics-card">
            <div className="meta-container">
                <div className="meta-title">
                    <h3>Estadísticas <MdOutlineQueryStats /></h3>
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

            <div className="meta-container">
                <div className="meta-subtitle">
                    <h3>Días laborados</h3>
                </div>

                <div className="meta-porcentaje">
                    {obtenerMensajeDias()}
                </div>

                <div
                    className="meta-barra"
                    style={{
                        backgroundColor:
                            coloresDias.fondo,
                    }}
                >
                    <div
                        className="meta-barra-progreso"
                        style={{
                            width: `${porcentajeDias}%`,
                            backgroundColor:
                                coloresDias.progreso,
                        }}
                    />
                </div>

                <div className="meta-valores">
                    {diasTrabajados}
                    {" / "}
                    {diasObligatorios}
                    {" días"}
                </div>
            </div>

            {
                mostrarObjetivoDiario && (
                    <div className="meta-container">
                        <div className="meta-title-gold">
                            <h3>
                                Objetivo diario
                                {objetivoDiarioCumplido && (
                                    <LiaMedalSolid
                                        className="medalla-icon"
                                    />
                                )}
                            </h3>
                        </div>

                        <div className="meta-porcentaje">
                            {obtenerMensajeDiario()}
                        </div>

                        <div
                            className="meta-barra"
                            style={{
                                backgroundColor:
                                    coloresDiario.fondo,
                            }}
                        >
                            <div
                                className="meta-barra-progreso"
                                style={{
                                    width: `${porcentajeDiario}%`,
                                    backgroundColor:
                                        coloresDiario.progreso,
                                }}
                            />
                        </div>

                        <div className="meta-valores">
                            $
                            {formatearNumero(
                                dineroHoy
                            )}
                            {" / "}
                            $
                            {formatearNumero(
                                Math.round(
                                    metaDiariaActual
                                )
                            )}
                        </div>
                    </div>
                )
            }

        </div>
    );
}

export default StatisticsCard;