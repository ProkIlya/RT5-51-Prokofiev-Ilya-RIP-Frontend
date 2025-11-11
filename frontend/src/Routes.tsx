export const ROUTES = {
  HOME: "/",
  SCENARIOS: "/scenarios",
  SCENARIO_DETAIL: "/scenarios/:id",
  TRIP: "/trip",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  SCENARIOS: "Сценарии",
  SCENARIO_DETAIL: "Детали сценария",
  TRIP: "Поездка",
};