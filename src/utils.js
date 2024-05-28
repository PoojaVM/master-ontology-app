import { ROLES } from "./constants";

export const canManageUsers = (role) =>
  [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);

export const canAddAdmin = (role) => role === ROLES.SUPER_ADMIN;

export const canManageConcepts = (role) =>
  canManageUsers(role) || role === ROLES.EDITOR;
