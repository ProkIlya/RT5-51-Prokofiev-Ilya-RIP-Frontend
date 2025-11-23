/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HandlerCartResponse {
  count?: number;
  trip_id?: number;
}

export interface HandlerScenarioRequest {
  aero_coeff?: number;
  description?: string;
  name: string;
  rolling_coeff?: number;
  speed?: number;
  system_consumption?: number;
  type: "дорога" | "комфорт";
}

export interface HandlerScenarioResponse {
  aero_coeff?: number;
  description?: string;
  id?: number;
  image_url?: string;
  name?: string;
  rolling_coeff?: number;
  speed?: number;
  status?: string;
  system_consumption?: number;
  type?: string;
}

export interface HandlerTripResponse {
  completed_at?: string;
  /** Изменено на RussianTime */
  created_at?: string;
  creator_login?: string;
  id?: number;
  moderator_login?: string;
  /** убрал omitempty */
  remaining_charge?: number;
  scenarios?: HandlerTripScenarioResponse[];
  start_charge?: number;
  status?: string;
  submitted_at?: string;
}

export interface HandlerTripScenarioResponse {
  duration?: number;
  scenario?: HandlerScenarioResponse;
  scenario_id?: number;
}

export namespace Api {
  /**
   * @description Get all driving scenarios with optional filtering
   * @tags Scenarios
   * @name ScenariosList
   * @summary Get scenarios list
   * @request GET:/api/scenarios
   * @response `200` `(HandlerScenarioResponse)[]` OK
   * @response `500` `object` Internal server error
   */
  export namespace ScenariosList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Filter by name */
      name?: string;
      /** Filter by type */
      type?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerScenarioResponse[];
  }

  /**
   * @description Create new driving scenario (moderator only)
   * @tags Scenarios
   * @name ScenariosCreate
   * @summary Create scenario
   * @request POST:/api/scenarios
   * @secure
   * @response `201` `HandlerScenarioResponse` Created
   * @response `400` `object` Bad request
   * @response `500` `object` Internal server error
   */
  export namespace ScenariosCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = HandlerScenarioRequest;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerScenarioResponse;
  }

  /**
   * @description Get driving scenario details by ID
   * @tags Scenarios
   * @name ScenariosDetail
   * @summary Get scenario by ID
   * @request GET:/api/scenarios/{id}
   * @response `200` `HandlerScenarioResponse` OK
   * @response `400` `object` Invalid ID
   * @response `404` `object` Scenario not found
   */
  export namespace ScenariosDetail {
    export type RequestParams = {
      /** Scenario ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerScenarioResponse;
  }

  /**
   * @description Update driving scenario (moderator only)
   * @tags Scenarios
   * @name ScenariosUpdate
   * @summary Update scenario
   * @request PUT:/api/scenarios/{id}
   * @secure
   * @response `200` `HandlerScenarioResponse` OK
   * @response `400` `object` Bad request
   * @response `404` `object` Scenario not found
   * @response `500` `object` Internal server error
   */
  export namespace ScenariosUpdate {
    export type RequestParams = {
      /** Scenario ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = HandlerScenarioRequest;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerScenarioResponse;
  }

  /**
   * @description Delete driving scenario (moderator only)
   * @tags Scenarios
   * @name ScenariosDelete
   * @summary Delete scenario
   * @request DELETE:/api/scenarios/{id}
   * @secure
   * @response `200` `object` Deleted successfully
   * @response `400` `object` Invalid ID
   * @response `404` `object` Scenario not found
   * @response `500` `object` Internal server error
   */
  export namespace ScenariosDelete {
    export type RequestParams = {
      /** Scenario ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Add driving scenario to user's draft trip
   * @tags Scenarios
   * @name ScenariosAddToTripCreate
   * @summary Add scenario to trip
   * @request POST:/api/scenarios/{id}/add-to-trip
   * @secure
   * @response `200` `object` Scenario added to trip
   * @response `401` `object` Unauthorized
   * @response `500` `object` Internal server error
   */
  export namespace ScenariosAddToTripCreate {
    export type RequestParams = {
      /** Scenario ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = object;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Upload image for driving scenario (moderator only)
   * @tags Scenarios
   * @name ScenariosScenarioimageCreate
   * @summary Upload scenario image
   * @request POST:/api/scenarios/{id}/scenarioimage
   * @secure
   * @response `200` `object` Image uploaded
   * @response `400` `object` Bad request
   * @response `500` `object` Internal server error
   */
  export namespace ScenariosScenarioimageCreate {
    export type RequestParams = {
      /** Scenario ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = {
      /** Image file */
      image: File;
    };
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Get trips with filtering. For moderators - all trips, for users - only their trips
   * @tags Trips
   * @name TripsList
   * @summary Get trips list
   * @request GET:/api/trips
   * @secure
   * @response `200` `(HandlerTripResponse)[]` OK
   * @response `401` `object` Unauthorized
   * @response `500` `object` Internal server error
   */
  export namespace TripsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Status filter */
      status?: string;
      /** Start date (YYYY-MM-DD) */
      date_from?: string;
      /** End date (YYYY-MM-DD) */
      date_to?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerTripResponse[];
  }

  /**
   * @description Create new trip draft
   * @tags Trips
   * @name TripsCreate
   * @summary Create trip
   * @request POST:/api/trips
   * @secure
   * @response `201` `object` Trip created
   * @response `400` `object` Bad request
   * @response `401` `object` Unauthorized
   * @response `500` `object` Internal server error
   */
  export namespace TripsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = object;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Get user's scenarios cart count. For guests returns 0.
   * @tags Trips
   * @name TripsScenarioscartList
   * @summary Get scenarios cart
   * @request GET:/api/trips/scenarioscart
   * @secure
   * @response `200` `HandlerCartResponse` OK
   */
  export namespace TripsScenarioscartList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerCartResponse;
  }

  /**
   * @description Get trip details by ID. Users can only access their own trips, moderators can access all.
   * @tags Trips
   * @name TripsDetail
   * @summary Get trip by ID
   * @request GET:/api/trips/{trip_id}
   * @secure
   * @response `200` `HandlerTripResponse` OK
   * @response `401` `object` Unauthorized
   * @response `403` `object` Access denied
   * @response `404` `object` Trip not found
   */
  export namespace TripsDetail {
    export type RequestParams = {
      /** Trip ID */
      tripId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandlerTripResponse;
  }

  /**
   * @description Update trip data (only for draft trips by owner)
   * @tags Trips
   * @name TripsUpdate
   * @summary Update trip
   * @request PUT:/api/trips/{trip_id}
   * @secure
   * @response `200` `object` Trip updated
   * @response `400` `object` Bad request
   * @response `403` `object` Access denied
   * @response `404` `object` Trip not found
   */
  export namespace TripsUpdate {
    export type RequestParams = {
      /** Trip ID */
      tripId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = object;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Delete trip (only by owner)
   * @tags Trips
   * @name TripsDelete
   * @summary Delete trip
   * @request DELETE:/api/trips/{trip_id}
   * @secure
   * @response `200` `object` Trip deleted
   * @response `400` `object` Bad request
   * @response `403` `object` Access denied
   * @response `404` `object` Trip not found
   */
  export namespace TripsDelete {
    export type RequestParams = {
      /** Trip ID */
      tripId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Complete or reject trip (moderator only)
   * @tags Trips
   * @name TripsReviewtripUpdate
   * @summary Review trip
   * @request PUT:/api/trips/{trip_id}/reviewtrip
   * @secure
   * @response `200` `object` Review successful
   * @response `400` `object` Bad request
   * @response `403` `object` Forbidden
   * @response `404` `object` Not found
   */
  export namespace TripsReviewtripUpdate {
    export type RequestParams = {
      /** Trip ID */
      tripId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = object;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Update scenario duration in trip (only for draft trips by owner)
   * @tags TripScenarios
   * @name TripsScenariosUpdate
   * @summary Update trip scenario
   * @request PUT:/api/trips/{trip_id}/scenarios/{scenario_id}
   * @secure
   * @response `200` `object` Trip scenario updated
   * @response `400` `object` Bad request
   * @response `403` `object` Access denied
   * @response `404` `object` Trip not found
   */
  export namespace TripsScenariosUpdate {
    export type RequestParams = {
      /** Trip ID */
      tripId: number;
      /** Scenario ID */
      scenarioId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = object;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Remove scenario from trip (only for draft trips by owner)
   * @tags TripScenarios
   * @name TripsScenariosDelete
   * @summary Remove scenario from trip
   * @request DELETE:/api/trips/{trip_id}/scenarios/{scenario_id}
   * @secure
   * @response `200` `object` Scenario removed from trip
   * @response `400` `object` Bad request
   * @response `403` `object` Access denied
   * @response `404` `object` Trip not found
   */
  export namespace TripsScenariosDelete {
    export type RequestParams = {
      /** Trip ID */
      tripId: number;
      /** Scenario ID */
      scenarioId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Submit draft trip for moderation
   * @tags Trips
   * @name TripsSubmittripUpdate
   * @summary Submit trip
   * @request PUT:/api/trips/{trip_id}/submittrip
   * @secure
   * @response `200` `object` Trip submitted
   * @response `400` `object` Bad request
   * @response `403` `object` Cannot submit trip
   * @response `404` `object` Trip not found
   */
  export namespace TripsSubmittripUpdate {
    export type RequestParams = {
      /** Trip ID */
      tripId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Authenticate user and return JWT token
   * @tags Users
   * @name UsersLoginCreate
   * @summary User login
   * @request POST:/api/users/login
   * @response `200` `object` Login successful
   * @response `401` `object` Unauthorized
   */
  export namespace UsersLoginCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = object;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Logout user and invalidate token
   * @tags Users
   * @name UsersLogoutCreate
   * @summary User logout
   * @request POST:/api/users/logout
   * @secure
   * @response `200` `object` Logout successful
   */
  export namespace UsersLogoutCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Get current user profile information
   * @tags Users
   * @name UsersProfileList
   * @summary Get user profile
   * @request GET:/api/users/profile
   * @secure
   * @response `200` `object` User profile
   */
  export namespace UsersProfileList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Update current user profile information
   * @tags Users
   * @name UsersProfileUpdate
   * @summary Update user profile
   * @request PUT:/api/users/profile
   * @secure
   * @response `200` `object` Profile updated
   */
  export namespace UsersProfileUpdate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = object;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }

  /**
   * @description Register a new user
   * @tags Users
   * @name UsersRegisterCreate
   * @summary User registration
   * @request POST:/api/users/register
   * @response `201` `object` User created
   * @response `400` `object` Bad request
   */
  export namespace UsersRegisterCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = object;
    export type RequestHeaders = {};
    export type ResponseBody = object;
  }
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title Tesla App API
 * @version 1.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @contact API Support <support@tesla-app.com> (http://localhost:8080)
 *
 * API for Tesla driving scenarios and trip management
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  api = {
    /**
     * @description Get all driving scenarios with optional filtering
     *
     * @tags Scenarios
     * @name ScenariosList
     * @summary Get scenarios list
     * @request GET:/api/scenarios
     * @response `200` `(HandlerScenarioResponse)[]` OK
     * @response `500` `object` Internal server error
     */
    scenariosList: (
      query?: {
        /** Filter by name */
        name?: string;
        /** Filter by type */
        type?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<HandlerScenarioResponse[], object>({
        path: `/api/scenarios`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create new driving scenario (moderator only)
     *
     * @tags Scenarios
     * @name ScenariosCreate
     * @summary Create scenario
     * @request POST:/api/scenarios
     * @secure
     * @response `201` `HandlerScenarioResponse` Created
     * @response `400` `object` Bad request
     * @response `500` `object` Internal server error
     */
    scenariosCreate: (
      input: HandlerScenarioRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<HandlerScenarioResponse, object>({
        path: `/api/scenarios`,
        method: "POST",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get driving scenario details by ID
     *
     * @tags Scenarios
     * @name ScenariosDetail
     * @summary Get scenario by ID
     * @request GET:/api/scenarios/{id}
     * @response `200` `HandlerScenarioResponse` OK
     * @response `400` `object` Invalid ID
     * @response `404` `object` Scenario not found
     */
    scenariosDetail: (id: number, params: RequestParams = {}) =>
      this.http.request<HandlerScenarioResponse, object>({
        path: `/api/scenarios/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update driving scenario (moderator only)
     *
     * @tags Scenarios
     * @name ScenariosUpdate
     * @summary Update scenario
     * @request PUT:/api/scenarios/{id}
     * @secure
     * @response `200` `HandlerScenarioResponse` OK
     * @response `400` `object` Bad request
     * @response `404` `object` Scenario not found
     * @response `500` `object` Internal server error
     */
    scenariosUpdate: (
      id: number,
      input: HandlerScenarioRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<HandlerScenarioResponse, object>({
        path: `/api/scenarios/${id}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete driving scenario (moderator only)
     *
     * @tags Scenarios
     * @name ScenariosDelete
     * @summary Delete scenario
     * @request DELETE:/api/scenarios/{id}
     * @secure
     * @response `200` `object` Deleted successfully
     * @response `400` `object` Invalid ID
     * @response `404` `object` Scenario not found
     * @response `500` `object` Internal server error
     */
    scenariosDelete: (id: number, params: RequestParams = {}) =>
      this.http.request<object, object>({
        path: `/api/scenarios/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Add driving scenario to user's draft trip
     *
     * @tags Scenarios
     * @name ScenariosAddToTripCreate
     * @summary Add scenario to trip
     * @request POST:/api/scenarios/{id}/add-to-trip
     * @secure
     * @response `200` `object` Scenario added to trip
     * @response `401` `object` Unauthorized
     * @response `500` `object` Internal server error
     */
    scenariosAddToTripCreate: (
      id: number,
      input: object,
      params: RequestParams = {},
    ) =>
      this.http.request<object, object>({
        path: `/api/scenarios/${id}/add-to-trip`,
        method: "POST",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload image for driving scenario (moderator only)
     *
     * @tags Scenarios
     * @name ScenariosScenarioimageCreate
     * @summary Upload scenario image
     * @request POST:/api/scenarios/{id}/scenarioimage
     * @secure
     * @response `200` `object` Image uploaded
     * @response `400` `object` Bad request
     * @response `500` `object` Internal server error
     */
    scenariosScenarioimageCreate: (
      id: number,
      data: {
        /** Image file */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<object, object>({
        path: `/api/scenarios/${id}/scenarioimage`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Get trips with filtering. For moderators - all trips, for users - only their trips
     *
     * @tags Trips
     * @name TripsList
     * @summary Get trips list
     * @request GET:/api/trips
     * @secure
     * @response `200` `(HandlerTripResponse)[]` OK
     * @response `401` `object` Unauthorized
     * @response `500` `object` Internal server error
     */
    tripsList: (
      query?: {
        /** Status filter */
        status?: string;
        /** Start date (YYYY-MM-DD) */
        date_from?: string;
        /** End date (YYYY-MM-DD) */
        date_to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<HandlerTripResponse[], object>({
        path: `/api/trips`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create new trip draft
     *
     * @tags Trips
     * @name TripsCreate
     * @summary Create trip
     * @request POST:/api/trips
     * @secure
     * @response `201` `object` Trip created
     * @response `400` `object` Bad request
     * @response `401` `object` Unauthorized
     * @response `500` `object` Internal server error
     */
    tripsCreate: (input: object, params: RequestParams = {}) =>
      this.http.request<object, object>({
        path: `/api/trips`,
        method: "POST",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get user's scenarios cart count. For guests returns 0.
     *
     * @tags Trips
     * @name TripsScenarioscartList
     * @summary Get scenarios cart
     * @request GET:/api/trips/scenarioscart
     * @secure
     * @response `200` `HandlerCartResponse` OK
     */
    tripsScenarioscartList: (params: RequestParams = {}) =>
      this.http.request<HandlerCartResponse, any>({
        path: `/api/trips/scenarioscart`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get trip details by ID. Users can only access their own trips, moderators can access all.
     *
     * @tags Trips
     * @name TripsDetail
     * @summary Get trip by ID
     * @request GET:/api/trips/{trip_id}
     * @secure
     * @response `200` `HandlerTripResponse` OK
     * @response `401` `object` Unauthorized
     * @response `403` `object` Access denied
     * @response `404` `object` Trip not found
     */
    tripsDetail: (tripId: number, params: RequestParams = {}) =>
      this.http.request<HandlerTripResponse, object>({
        path: `/api/trips/${tripId}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update trip data (only for draft trips by owner)
     *
     * @tags Trips
     * @name TripsUpdate
     * @summary Update trip
     * @request PUT:/api/trips/{trip_id}
     * @secure
     * @response `200` `object` Trip updated
     * @response `400` `object` Bad request
     * @response `403` `object` Access denied
     * @response `404` `object` Trip not found
     */
    tripsUpdate: (tripId: number, input: object, params: RequestParams = {}) =>
      this.http.request<object, object>({
        path: `/api/trips/${tripId}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete trip (only by owner)
     *
     * @tags Trips
     * @name TripsDelete
     * @summary Delete trip
     * @request DELETE:/api/trips/{trip_id}
     * @secure
     * @response `200` `object` Trip deleted
     * @response `400` `object` Bad request
     * @response `403` `object` Access denied
     * @response `404` `object` Trip not found
     */
    tripsDelete: (tripId: number, params: RequestParams = {}) =>
      this.http.request<object, object>({
        path: `/api/trips/${tripId}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Complete or reject trip (moderator only)
     *
     * @tags Trips
     * @name TripsReviewtripUpdate
     * @summary Review trip
     * @request PUT:/api/trips/{trip_id}/reviewtrip
     * @secure
     * @response `200` `object` Review successful
     * @response `400` `object` Bad request
     * @response `403` `object` Forbidden
     * @response `404` `object` Not found
     */
    tripsReviewtripUpdate: (
      tripId: number,
      input: object,
      params: RequestParams = {},
    ) =>
      this.http.request<object, object>({
        path: `/api/trips/${tripId}/reviewtrip`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update scenario duration in trip (only for draft trips by owner)
     *
     * @tags TripScenarios
     * @name TripsScenariosUpdate
     * @summary Update trip scenario
     * @request PUT:/api/trips/{trip_id}/scenarios/{scenario_id}
     * @secure
     * @response `200` `object` Trip scenario updated
     * @response `400` `object` Bad request
     * @response `403` `object` Access denied
     * @response `404` `object` Trip not found
     */
    tripsScenariosUpdate: (
      tripId: number,
      scenarioId: number,
      input: object,
      params: RequestParams = {},
    ) =>
      this.http.request<object, object>({
        path: `/api/trips/${tripId}/scenarios/${scenarioId}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove scenario from trip (only for draft trips by owner)
     *
     * @tags TripScenarios
     * @name TripsScenariosDelete
     * @summary Remove scenario from trip
     * @request DELETE:/api/trips/{trip_id}/scenarios/{scenario_id}
     * @secure
     * @response `200` `object` Scenario removed from trip
     * @response `400` `object` Bad request
     * @response `403` `object` Access denied
     * @response `404` `object` Trip not found
     */
    tripsScenariosDelete: (
      tripId: number,
      scenarioId: number,
      params: RequestParams = {},
    ) =>
      this.http.request<object, object>({
        path: `/api/trips/${tripId}/scenarios/${scenarioId}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Submit draft trip for moderation
     *
     * @tags Trips
     * @name TripsSubmittripUpdate
     * @summary Submit trip
     * @request PUT:/api/trips/{trip_id}/submittrip
     * @secure
     * @response `200` `object` Trip submitted
     * @response `400` `object` Bad request
     * @response `403` `object` Cannot submit trip
     * @response `404` `object` Trip not found
     */
    tripsSubmittripUpdate: (tripId: number, params: RequestParams = {}) =>
      this.http.request<object, object>({
        path: `/api/trips/${tripId}/submittrip`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Authenticate user and return JWT token
     *
     * @tags Users
     * @name UsersLoginCreate
     * @summary User login
     * @request POST:/api/users/login
     * @response `200` `object` Login successful
     * @response `401` `object` Unauthorized
     */
    usersLoginCreate: (input: object, params: RequestParams = {}) =>
      this.http.request<object, object>({
        path: `/api/users/login`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Logout user and invalidate token
     *
     * @tags Users
     * @name UsersLogoutCreate
     * @summary User logout
     * @request POST:/api/users/logout
     * @secure
     * @response `200` `object` Logout successful
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.http.request<object, any>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get current user profile information
     *
     * @tags Users
     * @name UsersProfileList
     * @summary Get user profile
     * @request GET:/api/users/profile
     * @secure
     * @response `200` `object` User profile
     */
    usersProfileList: (params: RequestParams = {}) =>
      this.http.request<object, any>({
        path: `/api/users/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update current user profile information
     *
     * @tags Users
     * @name UsersProfileUpdate
     * @summary Update user profile
     * @request PUT:/api/users/profile
     * @secure
     * @response `200` `object` Profile updated
     */
    usersProfileUpdate: (input: object, params: RequestParams = {}) =>
      this.http.request<object, any>({
        path: `/api/users/profile`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Register a new user
     *
     * @tags Users
     * @name UsersRegisterCreate
     * @summary User registration
     * @request POST:/api/users/register
     * @response `201` `object` User created
     * @response `400` `object` Bad request
     */
    usersRegisterCreate: (input: object, params: RequestParams = {}) =>
      this.http.request<object, object>({
        path: `/api/users/register`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
