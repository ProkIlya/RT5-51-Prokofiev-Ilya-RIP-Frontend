export const ROUTES = {
  HOME: "/",
  SCENARIOS: "/scenarios",
  SCENARIO_DETAIL: "/scenarios/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  TRIPS: "/trips",
  DRAFT_TRIP: "/trips/:tripId",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  SCENARIOS: "Сценарии",
  SCENARIO_DETAIL: "Детали сценария",
  LOGIN: "Вход",
  REGISTER: "Регистрация",
  PROFILE: "Личный кабинет",
  TRIPS: "Мои поездки",
  DRAFT_TRIP: "Заявка",
};