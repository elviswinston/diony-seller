export default interface OrderSummaryResponse {
  prepare: number;
  pendingApproval: number;
  shipping: number;
  shipped: number;
  cancelled: number;
}
