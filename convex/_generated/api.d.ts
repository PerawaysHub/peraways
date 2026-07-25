/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activityLog from "../activityLog.js";
import type * as automations from "../automations.js";
import type * as candidates from "../candidates.js";
import type * as complianceDocuments from "../complianceDocuments.js";
import type * as contact from "../contact.js";
import type * as contacts from "../contacts.js";
import type * as crons from "../crons.js";
import type * as dashboard from "../dashboard.js";
import type * as documents from "../documents.js";
import type * as emails from "../emails.js";
import type * as finanzen from "../finanzen.js";
import type * as notifications from "../notifications.js";
import type * as permissions from "../permissions.js";
import type * as sendEmails from "../sendEmails.js";
import type * as termine from "../termine.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activityLog: typeof activityLog;
  automations: typeof automations;
  candidates: typeof candidates;
  complianceDocuments: typeof complianceDocuments;
  contact: typeof contact;
  contacts: typeof contacts;
  crons: typeof crons;
  dashboard: typeof dashboard;
  documents: typeof documents;
  emails: typeof emails;
  finanzen: typeof finanzen;
  notifications: typeof notifications;
  permissions: typeof permissions;
  sendEmails: typeof sendEmails;
  termine: typeof termine;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
