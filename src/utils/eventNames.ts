export const EventNames = {
  CHECK_IN: "Check in",
  BREAK_START: "Break",
  BREAK_END: "End break",
  CHECK_OUT: "Check out",
} as const;

export type EventName = (typeof EventNames)[keyof typeof EventNames];
