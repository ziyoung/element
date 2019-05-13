<script>
// TODO: 优化这里的代码
// TreeTable 与 ExpandTable 共享这两个属性：expandRowKeys defaultExpandAll
// 因为要考虑到兼容性，所以在目前的 2.x 版本中只是做了代码层面的拆分
// 在下一个大版本中调整这部分代码的实现

import BaseTable from './base/table';
import expandStoreEnhancer from './expand/store-enhancer';
import objectAssign from 'element-ui/src/utils/merge';
// import { renderExpanded } from './expand/config';

export default {
  name: 'ElTable',

  mixins: [BaseTable],

  props: {
    expandRowKeys: Array,
    defaultExpandAll: Boolean
  },

  watch: {
    expandRowKeys: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.store.setExpandRowKeys(newVal);
        }
      }
    }
  },

  computed: {
    hasExpandColumn() {
      return this.store.states.columns.some(({ type }) => type === 'expand');
    }
  },

  methods: {
    enhanceStore(store) {
      const { states, ...methods } = expandStoreEnhancer;
      store.states = objectAssign(store.states, states);
      store = objectAssign(store, methods);
      return store;
    },

    decorateRowContent(tr, data) {
      if (this.hasExpandColumn && this.store.isRowExpanded(data.row)) {
        return [
          tr,
          <tr>
            <td colspan={ this.store.states.columns.length } class="el-table__expanded-cell">
              { this.renderExpanded ? this.renderExpanded(this.$createElement, data) : ''}
            </td>
          </tr>
        ];
      } else {
        return tr;
      }
    }
  }
};
</script>
