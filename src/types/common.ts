/**
 * Common Types
 *
 * This file contains common type definitions used throughout the application.
 * These types are designed to replace 'any' with more specific types.
 */

/**
 * JSON Value
 *
 * Represents any valid JSON value.
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

/**
 * JSON Object
 *
 * Represents a JSON object with string keys and JSON values.
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON Array
 *
 * Represents an array of JSON values.
 */
export type JsonArray = JsonValue[];

/**
 * Dictionary
 *
 * A generic dictionary type with string keys and values of type T.
 */
export type Dictionary<T> = Record<string, T>;

/**
 * Nullable
 *
 * A type that can be null or the specified type.
 */
export type Nullable<T> = T | null;

/**
 * Optional
 *
 * A type that can be undefined or the specified type.
 */
export type Optional<T> = T | undefined;

/**
 * AsyncFunction
 *
 * A generic type for async functions.
 */
export type AsyncFunction<T = void, Args extends unknown[] = unknown[]> =
  (...args: Args) => Promise<T>;

/**
 * SyncFunction
 *
 * A generic type for synchronous functions.
 */
export type SyncFunction<T = void, Args extends unknown[] = unknown[]> =
  (...args: Args) => T;

/**
 * ErrorWithMessage
 *
 * An error object with a message property.
 */
export interface ErrorWithMessage {
  message: string;
  [key: string]: unknown;
}

/**
 * ApiResponse
 *
 * A generic API response type.
 */
export interface ApiResponse<T> {
  data?: T;
  error?: ErrorWithMessage | string;
  status: number;
  success: boolean;
}

/**
 * PaginatedResponse
 *
 * A generic paginated response type.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * TimeRange
 *
 * Represents a time range for data filtering.
 */
export type TimeRange = '24h' | '7d' | '30d' | '90d' | 'custom';

/**
 * TimePeriod
 *
 * Represents a time period for data aggregation.
 */
export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

/**
 * SortDirection
 *
 * Represents a sort direction.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * SortOptions
 *
 * Represents sort options for data.
 */
export interface SortOptions {
  field: string;
  direction: SortDirection;
}

/**
 * FilterOptions
 *
 * Represents filter options for data.
 */
export interface FilterOptions {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  value: string | number | boolean | null;
}

/**
 * QueryOptions
 *
 * Represents query options for data fetching.
 */
export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sort?: SortOptions[];
  filters?: FilterOptions[];
  timeRange?: TimeRange;
  search?: string;
}

/**
 * Theme
 *
 * Represents a theme option.
 */
export type Theme = 'light' | 'dark';

/**
 * Size
 *
 * Represents a size option.
 */
export type Size = 'small' | 'medium' | 'large';

/**
 * Position
 *
 * Represents a position with x and y coordinates.
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Dimensions
 *
 * Represents dimensions with width and height.
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Rect
 *
 * Represents a rectangle with position and dimensions.
 */
export interface Rect extends Position, Dimensions {}

/**
 * WidgetSettings
 *
 * Represents settings for a widget.
 */
export interface WidgetSettings {
  position: Position;
  size: Size;
  theme: Theme;
  refreshInterval: number;
  [key: string]: unknown;
}
