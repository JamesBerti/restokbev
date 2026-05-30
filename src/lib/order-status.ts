export type OrderStatus =
  | "received"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "received",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Received",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function formatStatus(s: OrderStatus) {
  return STATUS_LABEL[s];
}

export function nextStatus(s: OrderStatus): OrderStatus | null {
  const i = ORDER_STATUS_FLOW.indexOf(s);
  if (i === -1 || i === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[i + 1];
}

export function statusToneClass(s: OrderStatus) {
  switch (s) {
    case "received":
      return "bg-primary-light text-primary-dark";
    case "preparing":
      return "bg-amber-100 text-amber-900";
    case "out_for_delivery":
      return "bg-teal/15 text-teal";
    case "delivered":
      return "bg-emerald-100 text-emerald-900";
    case "cancelled":
      return "bg-destructive-soft text-destructive";
  }
}
