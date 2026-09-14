export type AppUser = {
  id: string;
  name: string;
  contact: string;
  username: string;
  password: string;
  createdAt: string;
  isAdmin?: boolean;
};

export const USERS_KEY = "instaphone_users_v1";
export const SESSION_KEY = "instaphone_session_v1";
export const REGISTER_NOTICE_KEY = "instaphone_register_notice_v1";

const GLOBAL_USERS_KEY = "__instaphone_global_users__";
const AUTH_EVENT_NAME = "instaphone_auth_changed";
const USERS_EVENT_NAME = "instaphone_users_changed";

export const ADMIN_CREDENTIALS = {
  username: "twadmin",
  password: "1234",
};

function getGlobalUsersStore(): AppUser[] {
  const maybeStore = (globalThis as typeof globalThis & {
    [GLOBAL_USERS_KEY]?: AppUser[];
  })[GLOBAL_USERS_KEY];

  return Array.isArray(maybeStore) ? maybeStore : [];
}

function setGlobalUsersStore(users: AppUser[]) {
  (globalThis as typeof globalThis & {
    [GLOBAL_USERS_KEY]?: AppUser[];
  })[GLOBAL_USERS_KEY] = users;
}

function createAdminUser(): AppUser {
  return {
    id: "admin-twadmin",
    name: "TW Admin",
    contact: "admin@tw.local",
    username: ADMIN_CREDENTIALS.username,
    password: ADMIN_CREDENTIALS.password,
    createdAt: new Date().toISOString(),
    isAdmin: true,
  };
}

function emitCustomEvent(eventName: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName));
}

export function saveUsers(users: AppUser[]) {
  const normalizedUsers = users.filter(Boolean);
  setGlobalUsersStore(normalizedUsers);

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify(normalizedUsers));
  emitCustomEvent(USERS_EVENT_NAME);
}

export function readUsers(): AppUser[] {
  const adminUser = createAdminUser();

  if (typeof window !== "undefined") {
    try {
      const rawUsers = window.localStorage.getItem(USERS_KEY);
      const parsedUsers = rawUsers ? JSON.parse(rawUsers) : [];
      const storedUsers = Array.isArray(parsedUsers) ? parsedUsers : [];
      const globalUsers = getGlobalUsersStore();
      const sourceUsers = globalUsers.length > 0 ? globalUsers : storedUsers;

      const normalizedUsers = sourceUsers
        .filter((user): user is AppUser => !!user && typeof user === "object")
        .map((user) => ({
          ...user,
          id: user.id ?? `user-${Date.now()}-${Math.random()}`,
          name: String(user.name ?? "User"),
          contact: String(user.contact ?? ""),
          username: String(user.username ?? ""),
          password: String(user.password ?? ""),
          createdAt: user.createdAt ?? new Date().toISOString(),
          isAdmin: Boolean(user.isAdmin),
        }))
        .filter((user) => user.username || user.contact);

      const uniqueUsers = normalizedUsers.filter(
        (user, index, list) =>
          list.findIndex(
            (candidate) =>
              candidate.id === user.id ||
              (candidate.username && candidate.username.toLowerCase() === user.username.toLowerCase()) ||
              (candidate.contact && candidate.contact.toLowerCase() === user.contact.toLowerCase()),
          ) === index,
      );

      const adminExists = uniqueUsers.some(
        (user) => user.isAdmin || user.username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase(),
      );
      const mergedUsers = adminExists ? uniqueUsers : [...uniqueUsers, adminUser];

      const finalList = mergedUsers.some(
        (user) => user.username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase(),
      )
        ? mergedUsers
        : [adminUser, ...mergedUsers];

      setGlobalUsersStore(finalList);
      window.localStorage.setItem(USERS_KEY, JSON.stringify(finalList));
      return finalList;
    } catch {
      const fallbackUsers = getGlobalUsersStore().length > 0 ? getGlobalUsersStore() : [adminUser];
      setGlobalUsersStore(fallbackUsers);
      window.localStorage.setItem(USERS_KEY, JSON.stringify(fallbackUsers));
      return fallbackUsers;
    }
  }

  const globalUsers = getGlobalUsersStore();
  if (globalUsers.length > 0) {
    return globalUsers;
  }

  setGlobalUsersStore([adminUser]);
  return [adminUser];
}

export function saveSessionUser(user: AppUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
    emitCustomEvent(AUTH_EVENT_NAME);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  emitCustomEvent(AUTH_EVENT_NAME);
}

export function getSessionUser(): AppUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(SESSION_KEY);
    return rawSession ? (JSON.parse(rawSession) as AppUser) : null;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function setRegisterNotice(message: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!message) {
    window.localStorage.removeItem(REGISTER_NOTICE_KEY);
    return;
  }

  window.localStorage.setItem(REGISTER_NOTICE_KEY, message);
}

export function getRegisterNotice() {
  if (typeof window === "undefined") {
    return null;
  }

  const message = window.localStorage.getItem(REGISTER_NOTICE_KEY);
  if (!message) {
    return null;
  }

  window.localStorage.removeItem(REGISTER_NOTICE_KEY);
  return message;
}

export function findUserByCredentials(login: string, password: string): AppUser | null {
  const targetLogin = login.trim().toLowerCase();
  const users = readUsers();

  const user = users.find((item) => {
    const aliases = [item.username, item.contact].map((value) => value.trim().toLowerCase());
    return aliases.includes(targetLogin);
  });

  if (!user || user.password !== password) {
    return null;
  }

  return user;
}

export function createUserRecord(input: { name: string; contact: string; username: string; password: string }) {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
    name: input.name.trim(),
    contact: input.contact.trim(),
    username: input.username.trim(),
    password: input.password,
    createdAt: new Date().toISOString(),
  } satisfies AppUser;
}
