// TODO：有待调整
export function renderExpanded(data) {
  return this.$scopedSlots.default ? this.$scopedSlots.default(data) : this.$slots.default;
}
