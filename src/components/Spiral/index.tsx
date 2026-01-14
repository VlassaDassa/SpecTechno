import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import "./index.scss";

export interface SpiralConfig {
    lineColor: string;
    lineWidth: number;
    lineDash: string;
    nodeColor: string;
    showNodes: boolean;
    sCurveStrength: number;
    curveHeight: number;
    smoothness: number;
    customNodes?: CustomNodeConfig[];
}

export interface CustomNodeConfig {
    id: string;
    position: number;
    radius?: number;
    color?: string;
    content?: React.ReactNode;
}

const defaultConfig: SpiralConfig = {
    lineColor: "#BFF8E7",
    lineWidth: 7,
    lineDash: "none",
    nodeColor: "#4A90E2",
    showNodes: false,
    sCurveStrength: 100,
    curveHeight: 200,
    smoothness: 0.9,
    customNodes: [],
};

export interface BlockPosition {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    element: Element;
}

export interface PointOnCurve {
    x: number;
    y: number;
    tangent: { x: number; y: number };
    normal: { x: number; y: number };
}

interface CustomSpiralProps {
    blockSelector?: string;
    config?: Partial<SpiralConfig>;
}

interface CurveSegment {
    type: "M" | "C" | "L" | "S";
    points: { x: number; y: number }[];
    startIndex: number;
    endIndex: number;
}

const CustomSpiral: React.FC<CustomSpiralProps> = ({
    blockSelector = ".serviceNode",
    config = {},
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Объединяем конфиг сразу
    const spiralConfig = useMemo<SpiralConfig>(() => ({
        ...defaultConfig,
        ...config,
    }), [config]);

    const [path, setPath] = useState("");
    const [nodes, setNodes] = useState<
        Array<{ x: number; y: number; index: number }>
    >([]);
    const [foundElements, setFoundElements] = useState<Element[]>([]);
    
    // Контрольные значения теперь напрямую из spiralConfig
    const controlValues = useMemo(() => ({
        sCurveStrength: spiralConfig.sCurveStrength,
        curveHeight: spiralConfig.curveHeight,
        smoothness: spiralConfig.smoothness,
    }), [spiralConfig.sCurveStrength, spiralConfig.curveHeight, spiralConfig.smoothness]);

    const [curvePoints, setCurvePoints] = useState<PointOnCurve[]>([]);
    const [customNodePositions, setCustomNodePositions] = useState<
        Array<{
            config: CustomNodeConfig;
            point: PointOnCurve;
        }>
    >([]);

    // Храним сегменты кривой для точного позиционирования узлов
    const [curveSegments, setCurveSegments] = useState<CurveSegment[]>([]);

    const getBlockPositions = useCallback((): BlockPosition[] => {
        if (typeof window === "undefined") return [];

        const blocks = document.querySelectorAll(blockSelector);
        setFoundElements(Array.from(blocks));

        if (blocks.length === 0) {
            return [];
        }

        const container = document.querySelector(".services") || document.body;
        const containerRect = container.getBoundingClientRect();

        const positions: BlockPosition[] = [];

        blocks.forEach((block, index) => {
            const rect = block.getBoundingClientRect();

            let x = rect.left - containerRect.left + rect.width / 2;
            let y = rect.top - containerRect.top + rect.height / 2;
            
            
            // Смещение узлов в зависимости от размера экрана
            if (window.innerWidth <= 1920 && window.innerWidth > 1600) {
                if (block.id == "service-2") {
                    x = rect.left + 300;
                    y = rect.top + 100;
                }

                if (block.id == "service-3") {
                    x = rect.left - 10;
                    y = rect.top + 200;
                }
            } 
            else if (window.innerWidth > 1920) {
                if (block.id == "service-2") {
                    x = rect.left + 200;
                    y = rect.top + 100;
                }

                if (block.id == "service-3") {
                    x = rect.left - 200;
                    y = rect.top + 100;
                }
            }

            else if (window.innerWidth <= 1600 && window.innerWidth > 1440) {
                if (block.id == "service-2") {
                    x = rect.left + 600;
                    y = rect.top + 200;
                }

                if (block.id == "service-3") {
                    x = rect.left - 10;
                    y = rect.top + 200;
                }
            }

            else if (window.innerWidth <= 1440) {
                if (block.id == "service-2") {
                    x = rect.left + 600;
                    y = rect.top + 100;
                }

                if (block.id == "service-3") {
                    x = rect.left - 10;
                    y = rect.top + 100;
                }
            }
            

            positions.push({
                id: index,
                x,
                y,
                width: rect.width,
                height: rect.height,
                element: block,
            });
        });

        return positions;
    }, [blockSelector]);

    const calculatePointOnBezierCurve = useCallback((
        p0: { x: number; y: number },
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        p3: { x: number; y: number },
        t: number
    ): PointOnCurve => {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;

        const x =
            uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
        const y =
            uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

        const dx =
            -3 * uu * p0.x +
            3 * uu * p1.x -
            6 * u * t * p1.x -
            3 * tt * p2.x +
            6 * u * t * p2.x +
            3 * tt * p3.x;
        const dy =
            -3 * uu * p0.y +
            3 * uu * p1.y -
            6 * u * t * p1.y -
            3 * tt * p2.y +
            6 * u * t * p2.y +
            3 * tt * p3.y;

        const tangentLength = Math.sqrt(dx * dx + dy * dy);
        const tangent =
            tangentLength > 0
                ? { x: dx / tangentLength, y: dy / tangentLength }
                : { x: 0, y: 0 };

        const normal = { x: -tangent.y, y: tangent.x };

        return { x, y, tangent, normal };
    }, []);

    // Новая функция для разбора сегментов кривой
    const parsePathSegments = useCallback((pathData: string): CurveSegment[] => {
        const segments: CurveSegment[] = [];

        const commands = pathData.match(/[MCLS][^MCLS]*/g);
        if (!commands) return segments;

        let currentPoint = { x: 0, y: 0 };
        var startPoint = { x: 0, y: 0 };
        let segmentStartIndex = 0;

        for (const command of commands) {
            const type = command[0] as "M" | "C" | "L" | "S";
            const coords = command
                .slice(1)
                .trim()
                .split(/[\s,]+/)
                .map(Number);

            if (type === "M") {
                currentPoint = { x: coords[0], y: coords[1] };
                startPoint = { ...currentPoint };
                segments.push({
                    type: "M",
                    points: [currentPoint],
                    startIndex: segmentStartIndex,
                    endIndex: segmentStartIndex,
                });
                segmentStartIndex++;
            } else if (type === "C") {
                const [x1, y1, x2, y2, x, y] = coords;
                const p0 = currentPoint;
                const p1 = { x: x1, y: y1 };
                const p2 = { x: x2, y: y2 };
                const p3 = { x, y: y };

                const segmentPoints = [{ ...p0 }, p1, p2, p3];
                segments.push({
                    type: "C",
                    points: segmentPoints,
                    startIndex: segmentStartIndex,
                    endIndex: segmentStartIndex + 20, // 20 точек на сегмент
                });
                segmentStartIndex += 21;

                currentPoint = { x, y: y };
            } else if (type === "S") {
                // Для S команд нужны предыдущие контрольные точки
                const [x2, y2, x, y] = coords;
                const prevSegment = segments[segments.length - 1];

                let p1, p2, p3;
                if (prevSegment.type === "C") {
                    // Отражение предыдущей контрольной точки
                    const prevP2 = prevSegment.points[2];
                    p1 = {
                        x: 2 * currentPoint.x - prevP2.x,
                        y: 2 * currentPoint.y - prevP2.y,
                    };
                } else {
                    p1 = currentPoint;
                }

                p2 = { x: x2, y: y2 };
                p3 = { x, y: y };

                const segmentPoints = [currentPoint, p1, p2, p3];
                segments.push({
                    type: "S",
                    points: segmentPoints,
                    startIndex: segmentStartIndex,
                    endIndex: segmentStartIndex + 20,
                });
                segmentStartIndex += 21;

                currentPoint = { x, y: y };
            } else if (type === "L") {
                const [x, y] = coords;
                const p0 = currentPoint;
                const p1 = { x, y: y };

                const segmentPoints = [p0, p1];
                segments.push({
                    type: "L",
                    points: segmentPoints,
                    startIndex: segmentStartIndex,
                    endIndex:
                        segmentStartIndex +
                        Math.max(
                            1,
                            Math.floor(
                                Math.sqrt((x - p0.x) ** 2 + (y - p0.y) ** 2) /
                                    10
                            )
                        ),
                });
                segmentStartIndex += Math.max(
                    2,
                    Math.floor(
                        Math.sqrt((x - p0.x) ** 2 + (y - p0.y) ** 2) / 10
                    ) + 1
                );

                currentPoint = { x, y: y };
            }
        }

        return segments;
    }, []);

    // Улучшенная функция расчета точек на кривой с учетом сегментов
    const parsePathAndCalculatePoints = useCallback((pathData: string): PointOnCurve[] => {
        const points: PointOnCurve[] = [];
        const segments = parsePathSegments(pathData);

        for (const segment of segments) {
            if (segment.type === "C" || segment.type === "S") {
                const [p0, p1, p2, p3] = segment.points;
                const steps = 20;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const point = calculatePointOnBezierCurve(
                        p0,
                        p1,
                        p2,
                        p3,
                        t
                    );
                    points.push(point);
                }
            } else if (segment.type === "L") {
                const [p0, p1] = segment.points;
                const dx = p1.x - p0.x;
                const dy = p1.y - p0.y;
                const length = Math.sqrt(dx * dx + dy * dy);

                if (length > 0) {
                    const tangent = { x: dx / length, y: dy / length };
                    const normal = { x: -tangent.y, y: tangent.x };

                    const steps = Math.max(1, Math.floor(length / 10));
                    for (let i = 0; i <= steps; i++) {
                        const t = i / steps;
                        points.push({
                            x: p0.x + dx * t,
                            y: p0.y + dy * t,
                            tangent,
                            normal,
                        });
                    }
                }
            } else if (segment.type === "M") {
                const p0 = segment.points[0];
                points.push({
                    ...p0,
                    tangent: { x: 0, y: 0 },
                    normal: { x: 0, y: 0 },
                });
            }
        }

        return points;
    }, [parsePathSegments, calculatePointOnBezierCurve]);

    // Улучшенная функция расчета позиций кастомных узлов
    const calculateCustomNodePositions = useCallback((
        points: PointOnCurve[],
        customNodes: CustomNodeConfig[] = [],
        segments: CurveSegment[] = []
    ) => {
        if (points.length === 0 || customNodes.length === 0) return [];

        const nodePositions: Array<{
            config: CustomNodeConfig;
            point: PointOnCurve;
        }> = [];

        customNodes.forEach((nodeConfig) => {
            const position = Math.max(0, Math.min(1, nodeConfig.position));

            // Если есть сегменты, пытаемся найти точку на конкретном сегменте
            if (segments.length > 1) {
                // Распределяем позицию по сегментам
                const totalSegments = segments.length - 1; // Исключаем первый M сегмент
                const segmentIndex =
                    Math.min(
                        Math.floor(position * totalSegments),
                        totalSegments - 1
                    ) + 1; // +1 для пропуска M

                if (segmentIndex < segments.length) {
                    const segment = segments[segmentIndex];
                    const segmentPosition =
                        position * totalSegments - (segmentIndex - 1);
                    const segmentLocalPosition = Math.max(
                        0,
                        Math.min(1, segmentPosition)
                    );

                    if (segment.type === "C" || segment.type === "S") {
                        const [p0, p1, p2, p3] = segment.points;
                        const point = calculatePointOnBezierCurve(
                            p0,
                            p1,
                            p2,
                            p3,
                            segmentLocalPosition
                        );
                        nodePositions.push({
                            config: nodeConfig,
                            point,
                        });
                        return;
                    } else if (segment.type === "L") {
                        const [p0, p1] = segment.points;
                        const dx = p1.x - p0.x;
                        const dy = p1.y - p0.y;
                        const point = {
                            x: p0.x + dx * segmentLocalPosition,
                            y: p0.y + dy * segmentLocalPosition,
                            tangent: {
                                x: dx / Math.sqrt(dx * dx + dy * dy),
                                y: dy / Math.sqrt(dx * dx + dy * dy),
                            },
                            normal: {
                                x: -dy / Math.sqrt(dx * dx + dy * dy),
                                y: dx / Math.sqrt(dx * dx + dy * dy),
                            },
                        };
                        nodePositions.push({
                            config: nodeConfig,
                            point,
                        });
                        return;
                    }
                }
            }

            // Fallback: используем старый метод, если не удалось найти по сегментам
            const index = Math.floor(position * (points.length - 1));
            const point = points[Math.min(index, points.length - 1)];
            nodePositions.push({
                config: nodeConfig,
                point,
            });
        });

        return nodePositions;
    }, [calculatePointOnBezierCurve]);

    const createAdvancedSCurve = useCallback((positions: BlockPosition[]): string => {
        if (positions.length < 2) return "";

        setNodes(positions.map((pos, idx) => ({ ...pos, index: idx })));

        const { sCurveStrength, curveHeight, smoothness } = spiralConfig;

        let pathData = `M ${positions[0].x} ${positions[0].y}`;

        const points = positions.map((p) => ({ x: p.x, y: p.y }));

        const augmentedPoints = [
            {
                x: points[0].x - (points[1]?.x - points[0].x) * 0.5,
                y: points[0].y,
            },
            ...points,
            {
                x:
                    points[points.length - 1].x +
                    (points[points.length - 1].x -
                        points[points.length - 2]?.x) *
                        0.5,
                y: points[points.length - 1].y,
            },
        ];

        for (let i = 1; i < augmentedPoints.length - 2; i++) {
            const p0 = augmentedPoints[i - 1];
            const p1 = augmentedPoints[i];
            const p2 = augmentedPoints[i + 1];
            const p3 = augmentedPoints[i + 2];

            let cp1x = p1.x + (p2.x - p0.x) / 6;
            let cp1y = p1.y + (p2.y - p0.y) / 6;

            let cp2x = p2.x - (p3.x - p1.x) / 6;
            let cp2y = p2.y - (p3.y - p1.y) / 6;

            const segmentIndex = i - 1;
            const bendDirection = segmentIndex % 2 === 0 ? 1 : -1;
            const bendAmount =
                curveHeight * (sCurveStrength / 100) * smoothness;

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 10) {
                const px = -dy / distance;
                const py = dx / distance;

                cp1x += px * bendAmount * bendDirection * 0.3;
                cp1y += py * bendAmount * bendDirection * 0.3;
                cp2x += px * bendAmount * bendDirection * 0.3;
                cp2y += py * bendAmount * bendDirection * 0.3;
            }

            if (segmentIndex === 0) {
                pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
            } else {
                pathData += ` S ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
            }
        }

        return pathData;
    }, [spiralConfig]);

    const updateCurve = useCallback(() => {
        const positions = getBlockPositions();

        if (positions.length >= 2) {
            const newPath = createAdvancedSCurve(positions);
            setPath(newPath);
            
            // Вычисляем точки кривой
            const points = parsePathAndCalculatePoints(newPath);
            setCurvePoints(points);
            
            // Вычисляем сегменты
            const segments = parsePathSegments(newPath);
            setCurveSegments(segments);
            
            // Вычисляем позиции кастомных узлов
            const customNodePos = calculateCustomNodePositions(
                points,
                spiralConfig.customNodes,
                segments
            );
            setCustomNodePositions(customNodePos);
        } else {
            setPath("");
            setCurvePoints([]);
            setCurveSegments([]);
            setCustomNodePositions([]);
        }
    }, [
        getBlockPositions, 
        createAdvancedSCurve, 
        parsePathAndCalculatePoints,
        parsePathSegments,
        calculateCustomNodePositions,
        spiralConfig.customNodes
    ]);

    useEffect(() => {
        updateCurve();

        const handleResize = () => {
            requestAnimationFrame(updateCurve);
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleResize);

        const observer = new MutationObserver(() => {
            setTimeout(updateCurve, 100);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateCurve);
        });

        document.querySelectorAll(blockSelector).forEach((el) => {
            resizeObserver.observe(el);
        });

        const intervalId = setInterval(updateCurve, 2000);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleResize);
            observer.disconnect();
            resizeObserver.disconnect();
            clearInterval(intervalId);
        };
    }, [updateCurve, blockSelector]);

    // Убираем лишний useEffect для controlValues, так как они теперь в spiralConfig

    return (
        <>
            <div
                ref={containerRef}
                className="custom-spiral-container"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            >
                <svg
                    ref={svgRef}
                    className="spiral-svg"
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "visible",
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                >
                    <defs>
                        <filter id="smoothFilter">
                            <feGaussianBlur
                                in="SourceGraphic"
                                stdDeviation="0.5"
                                result="blur"
                            />
                            <feColorMatrix
                                in="blur"
                                type="matrix"
                                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 18 -7"
                                result="smooth"
                            />
                        </filter>
                    </defs>

                    {path && (
                        <>
                            <path
                                d={path}
                                fill="none"
                                stroke="rgba(0, 0, 0, 0.2)"
                                strokeWidth={spiralConfig.lineWidth + 4}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray={spiralConfig.lineDash}
                                style={{
                                    filter: "blur(4px)",
                                }}
                            />

                            <path
                                d={path}
                                fill="none"
                                stroke={spiralConfig.lineColor}
                                strokeWidth={spiralConfig.lineWidth}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray={spiralConfig.lineDash}
                                style={{
                                    filter: "url(#smoothFilter)",
                                }}
                            />
                        </>
                    )}

                    {customNodePositions.map(({ config, point }) => {
                        const lengthLine = 200;

                        const angleDeg =
                            parseFloat(config.id.split("-")[1]) === 2 ? -90 : 0;
                        const baseAngleDeg = -45;

                        const angle =
                            (baseAngleDeg + angleDeg) * (Math.PI / 180);

                        return (
                            <g
                                key={`custom-node-${config.id}`}
                                className="custom-node"
                                style={{
                                    pointerEvents: "auto",
                                    cursor: "pointer",
                                }}
                            >
                                <line
                                    x1={point.x}
                                    y1={point.y}
                                    x2={point.x + lengthLine * Math.cos(angle)}
                                    y2={point.y + lengthLine * Math.sin(angle)}
                                    className="nodeLine"
                                />
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r={config.radius || 15}
                                    className="nodeCircle"
                                    style={{
                                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                                    }}
                                />

                                {config.content && (
                                    <foreignObject
                                        x={point.x + point.normal.x * 30}
                                        y={point.y + point.normal.y * 30 - 50}
                                        width="200"
                                        height="100"
                                        style={{
                                            pointerEvents: "auto",
                                            overflow: "visible",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                pointerEvents: "auto",
                                            }}
                                        >
                                            <div className="nodeContent">
                                                {config.content}
                                            </div>
                                        </div>
                                    </foreignObject>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </>
    );
};

export default CustomSpiral;