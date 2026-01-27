export interface TodoItem {
  id: string,
  date: string,
  time: string,
  content: string,
  check: boolean,
  iso8601?: string
}

export interface UserInfo {
  uid: string | null | undefined,
  email: string | null | undefined,
  displayName: string | null | undefined,
  photoURL: string | null | undefined
}