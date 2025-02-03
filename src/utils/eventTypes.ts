export const EventTypes = {
  CHECK_IN: "check_in",
  BREAK_START: "break_start",
  BREAK_END: "break_end",
  CHECK_OUT: "check_out",
} as const;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];
